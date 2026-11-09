import { prisma } from './prisma';
import { syncRecordToSupabase } from './supabase';

export type TelegramAdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';

export type AdminActionPermission =
  | 'booking.view'
  | 'booking.confirm'
  | 'booking.call'
  | 'booking.quotation'
  | 'booking.project'
  | 'booking.detail'
  | 'booking.status'
  | 'booking.cancel'
  | 'admin.manage'
  | 'stats.view';

const ROLE_DEFAULT_PERMISSIONS: Record<TelegramAdminRole, AdminActionPermission[]> = {
  SUPER_ADMIN: [
    'booking.view',
    'booking.confirm',
    'booking.call',
    'booking.quotation',
    'booking.project',
    'booking.detail',
    'booking.status',
    'booking.cancel',
    'admin.manage',
    'stats.view',
  ],
  ADMIN: [
    'booking.view',
    'booking.confirm',
    'booking.call',
    'booking.quotation',
    'booking.project',
    'booking.detail',
    'booking.status',
    'booking.cancel',
    'stats.view',
  ],
  STAFF: [
    'booking.view',
    'booking.call',
    'booking.detail',
    'booking.status',
  ],
};

/**
 * Ensures the primary TELEGRAM_ADMIN_CHAT_ID from .env is registered as SUPER_ADMIN
 * in `telegram_admins` so the owner is immediately authorized.
 */
export async function ensureDefaultSuperAdmin(): Promise<void> {
  const envAdminId = process.env.TELEGRAM_ADMIN_CHAT_ID?.trim();
  if (!envAdminId) return;

  const existing = await prisma.telegramAdmin.findUnique({
    where: { telegramUserId: envAdminId },
  });

  if (!existing) {
    const created = await prisma.telegramAdmin.create({
      data: {
        telegramUserId: envAdminId,
        fullName: 'Nguyên Director (Super Admin)',
        role: 'SUPER_ADMIN',
        isActive: true,
        permissions: JSON.stringify(ROLE_DEFAULT_PERMISSIONS.SUPER_ADMIN),
      },
    });

    void syncRecordToSupabase('telegram_admins', {
      id: created.id,
      telegram_user_id: created.telegramUserId,
      telegram_username: created.telegramUsername,
      full_name: created.fullName,
      role: created.role,
      is_active: created.isActive,
      permissions: ROLE_DEFAULT_PERMISSIONS.SUPER_ADMIN,
    });
  }
}

/**
 * Authenticates and authorizes a Telegram user strictly by `telegramUserId` (never by username).
 */
export async function verifyTelegramAdminPermission(
  telegramUserId: string | number,
  requiredPermission: AdminActionPermission
): Promise<{
  authorized: boolean;
  admin?: {
    id: string;
    telegramUserId: string;
    telegramUsername: string | null;
    fullName: string;
    role: TelegramAdminRole;
    permissions: string[];
  };
  reason?: string;
}> {
  await ensureDefaultSuperAdmin();

  const userIdStr = String(telegramUserId).trim();
  const adminRecord = await prisma.telegramAdmin.findUnique({
    where: { telegramUserId: userIdStr },
  });

  if (!adminRecord) {
    return {
      authorized: false,
      reason: 'Tài khoản Telegram này chưa được đăng ký trong danh sách Quản trị viên (telegram_admins).',
    };
  }

  if (!adminRecord.isActive) {
    return {
      authorized: false,
      reason: 'Tài khoản Quản trị viên của bạn đang bị khóa hoặc tạm ngưng.',
    };
  }

  const role = (adminRecord.role as TelegramAdminRole) || 'STAFF';
  let customPerms: string[] = [];
  try {
    const parsed = JSON.parse(adminRecord.permissions || '[]');
    if (Array.isArray(parsed)) customPerms = parsed;
  } catch {
    customPerms = [];
  }

  const effectivePermissions = Array.from(
    new Set([...(ROLE_DEFAULT_PERMISSIONS[role] || []), ...customPerms])
  );

  if (role !== 'SUPER_ADMIN' && !effectivePermissions.includes(requiredPermission)) {
    return {
      authorized: false,
      admin: {
        id: adminRecord.id,
        telegramUserId: adminRecord.telegramUserId,
        telegramUsername: adminRecord.telegramUsername,
        fullName: adminRecord.fullName,
        role,
        permissions: effectivePermissions,
      },
      reason: `Vai trò ${role} không có quyền thực hiện thao tác "${requiredPermission}".`,
    };
  }

  return {
    authorized: true,
    admin: {
      id: adminRecord.id,
      telegramUserId: adminRecord.telegramUserId,
      telegramUsername: adminRecord.telegramUsername,
      fullName: adminRecord.fullName,
      role,
      permissions: effectivePermissions,
    },
  };
}

/**
 * Enforces business workflow rules for booking status transitions.
 */
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  NEW: ['CONFIRMED', 'CONSULTING', 'QUOTATION_SENT', 'CANCELLED'],
  CONFIRMED: ['CONSULTING', 'QUOTATION_SENT', 'IN_PROGRESS', 'CANCELLED'],
  CONSULTING: ['CONFIRMED', 'QUOTATION_SENT', 'IN_PROGRESS', 'CANCELLED'],
  QUOTATION_SENT: ['CONSULTING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

export function validateBookingStatusTransition(
  currentStatus: string,
  targetStatus: string,
  role: TelegramAdminRole = 'ADMIN'
): { valid: boolean; reason?: string } {
  if (currentStatus === targetStatus) {
    return {
      valid: false,
      reason: `Đơn hàng đã ở trạng thái ${targetStatus}, không thể cập nhật lặp lại.`,
    };
  }

  if (currentStatus === 'COMPLETED') {
    return {
      valid: false,
      reason: 'Đơn hàng đã HOÀN THÀNH (COMPLETED), không thể chuyển sang trạng thái khác.',
    };
  }

  if (currentStatus === 'CANCELLED' && role !== 'SUPER_ADMIN') {
    return {
      valid: false,
      reason: 'Đơn hàng đã HỦY (CANCELLED). Chỉ SUPER_ADMIN mới có quyền mở lại.',
    };
  }

  if (targetStatus === 'CANCELLED' && role === 'STAFF') {
    return {
      valid: false,
      reason: 'Nhân viên (STAFF) không có quyền hủy đơn hàng.',
    };
  }

  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(targetStatus) && role !== 'SUPER_ADMIN') {
    return {
      valid: false,
      reason: `Không thể chuyển trực tiếp từ trạng thái ${currentStatus} sang ${targetStatus} theo quy trình nghiệp vụ.`,
    };
  }

  return { valid: true };
}

