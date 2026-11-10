import React from "react";
import prisma from "@/lib/prisma";
import BookingManagerClient from "@/components/admin/BookingManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ code?: string }> | { code?: string };
}) {
  const resolvedParams = searchParams ? await Promise.resolve(searchParams) : {};
  const initialCodeFilter = resolvedParams?.code || "";

  let bookings: any[] = [];
  let services: any[] = [];
  let staffUsers: any[] = [];

  try {
    const results = await Promise.all([
      prisma.serviceBooking.findMany({
        include: {
          customer: {
            select: {
              id: true,
              code: true,
              name: true,
              email: true,
              phone: true,
              company: true,
              telegramUserId: true,
              telegramUsername: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.service.findMany({
        where: { status: "PUBLISHED", deletedAt: null },
        select: {
          id: true,
          title: true,
          group: true,
          priceLabel: true,
        },
        orderBy: { order: "asc" },
      }),
      prisma.user.findMany({
        where: {
          roleName: { in: ["SUPER_ADMIN", "ADMIN", "STAFF"] },
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          roleName: true,
        },
      }),
    ]);
    bookings = results[0] || [];
    services = results[1] || [];
    staffUsers = results[2] || [];
  } catch (err) {
    console.warn("[AdminBookingsPage] DB fetch fallback active:", err);
  }

  const serializedBookings = bookings.map((b) => ({
    ...b,
    createdAt: b.createdAt ? new Date(b.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: b.updatedAt ? new Date(b.updatedAt).toISOString() : new Date().toISOString(),
  }));

  return (
    <BookingManagerClient
      initialBookings={serializedBookings}
      services={services}
      staffUsers={staffUsers}
      initialCodeFilter={initialCodeFilter}
    />
  );
}

