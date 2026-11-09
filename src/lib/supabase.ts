import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type StorageBucketName =
  | 'nguyen-agency-media'
  | 'agency-assets'
  | 'customer-uploads'
  | 'project-files'
  | 'quotation-files';

let browserClient: SupabaseClient | null = null;
let serverAdminClient: SupabaseClient | null = null;

/**
 * Browser / public client using NEXT_PUBLIC_SUPABASE_ANON_KEY (publishable key).
 * Never exposes service_role key to the browser.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return browserClient;
}

/**
 * Server-side Supabase client. Uses SUPABASE_SERVICE_ROLE_KEY when available on the server,
 * falling back to NEXT_PUBLIC_SUPABASE_ANON_KEY for public/RLS-permitted operations.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }

  if (!serverAdminClient) {
    serverAdminClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return serverAdminClient;
}

/**
 * Check whether Supabase connection is configured and reachable.
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  url: string | null;
  hasServiceRole: boolean;
  message: string;
}> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || null;
  const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const client = getSupabaseServerClient();

  if (!client || !url) {
    return {
      connected: false,
      url,
      hasServiceRole,
      message: 'Chưa cấu hình biến môi trường NEXT_PUBLIC_SUPABASE_URL / KEY.',
    };
  }

  try {
    // Lightweight query to verify reachability of the Supabase REST endpoint
    const { error } = await client.from('services').select('id').limit(1);
    if (error && !error.message.includes('relation') && !error.message.includes('does not exist')) {
      return {
        connected: true,
        url,
        hasServiceRole,
        message: `Đã kết nối Supabase (${error.message})`,
      };
    }
    return {
      connected: true,
      url,
      hasServiceRole,
      message: 'Kết nối Supabase Cloud hoạt động bình thường.',
    };
  } catch (err) {
    return {
      connected: false,
      url,
      hasServiceRole,
      message: err instanceof Error ? err.message : 'Lỗi kết nối Supabase.',
    };
  }
}

/**
 * Best-effort dual-write / synchronization to Supabase PostgreSQL REST API
 * when running with local Prisma SQLite + remote Supabase project.
 */
export async function syncRecordToSupabase(
  table: string,
  payload: Record<string, unknown>
): Promise<{ synced: boolean; error?: string }> {
  const client = getSupabaseServerClient();
  if (!client) {
    return { synced: false, error: 'Supabase client not configured' };
  }

  try {
    const { error } = await client.from(table).upsert(payload, { onConflict: 'id' });
    if (error) {
      return { synced: false, error: error.message };
    }
    return { synced: true };
  } catch (err) {
    return {
      synced: false,
      error: err instanceof Error ? err.message : 'Unknown Supabase sync error',
    };
  }
}

/**
 * Best-effort delete synchronization to Supabase PostgreSQL REST API.
 */
export async function deleteRecordFromSupabase(
  table: string,
  id: string
): Promise<{ deleted: boolean; error?: string }> {
  const client = getSupabaseServerClient();
  if (!client) {
    return { deleted: false, error: 'Supabase client not configured' };
  }

  try {
    const { error } = await client.from(table).delete().eq('id', id);
    if (error) {
      return { deleted: false, error: error.message };
    }
    return { deleted: true };
  } catch (err) {
    return {
      deleted: false,
      error: err instanceof Error ? err.message : 'Unknown Supabase delete error',
    };
  }
}

/**
 * Upload a file buffer or Blob to one of the 4 standardized Supabase Storage buckets:
 * - agency-assets (public)
 * - customer-uploads (private, signed URLs)
 * - project-files (private, signed URLs)
 * - quotation-files (private, signed URLs)
 */
export async function uploadToSupabaseBucket(
  bucket: StorageBucketName,
  filePath: string,
  fileBody: Buffer | Uint8Array | Blob,
  contentType: string
): Promise<{
  success: boolean;
  path?: string;
  publicUrl?: string;
  signedUrl?: string;
  error?: string;
}> {
  const client = getSupabaseServerClient();
  if (!client) {
    return { success: false, error: 'Supabase client chưa được cấu hình' };
  }

  try {
    let { data, error } = await client.storage.from(bucket).upload(filePath, fileBody, {
      contentType,
      upsert: true,
    });

    if (
      error &&
      (error.message.toLowerCase().includes('bucket') ||
        error.message.toLowerCase().includes('not found'))
    ) {
      await client.storage.createBucket(bucket, {
        public: bucket === 'nguyen-agency-media' || bucket === 'agency-assets',
      });
      const retry = await client.storage.from(bucket).upload(filePath, fileBody, {
        contentType,
        upsert: true,
      });
      data = retry.data;
      error = retry.error;
    }

    if (error || !data) {
      return { success: false, error: error?.message || 'Upload thất bại' };
    }

    if (bucket === 'nguyen-agency-media' || bucket === 'agency-assets') {
      const { data: pub } = client.storage.from(bucket).getPublicUrl(data.path);
      return {
        success: true,
        path: data.path,
        publicUrl: pub.publicUrl,
      };
    }

    const { data: signed, error: signErr } = await client.storage
      .from(bucket)
      .createSignedUrl(data.path, 60 * 60 * 24 * 7); // 7 days

    return {
      success: true,
      path: data.path,
      signedUrl: signErr ? undefined : signed?.signedUrl,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Lỗi không xác định khi tải file lên Supabase Storage',
    };
  }
}

/**
 * Generate a temporary Signed URL for private buckets (customer-uploads, project-files, quotation-files).
 */
export async function getSignedStorageUrl(
  bucket: StorageBucketName,
  filePath: string,
  expiresInSeconds = 3600
): Promise<string | null> {
  const client = getSupabaseServerClient();
  if (!client) return null;

  try {
    const { data, error } = await client.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresInSeconds);
    if (error || !data) return null;
    return data.signedUrl;
  } catch {
    return null;
  }
}

