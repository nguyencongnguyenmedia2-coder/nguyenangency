import React from "react";
import prisma from "@/lib/prisma";
import BookingManagerClient from "@/components/admin/BookingManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const resolvedParams = await searchParams;
  const initialCodeFilter = resolvedParams?.code || "";

  const [bookings, services, staffUsers] = await Promise.all([
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

  const serializedBookings = bookings.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
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

