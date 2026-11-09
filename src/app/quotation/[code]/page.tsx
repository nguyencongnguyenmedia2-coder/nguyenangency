import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import QuotationViewerClient from "@/components/quotation/QuotationViewerClient";

export async function generateMetadata({ params }: { params: { code: string } }) {
  return {
    title: `Báo Giá Dịch Vụ #${params.code} – NGUYÊN AGENCY`,
  };
}

export default async function QuotationPage({ params }: { params: { code: string } }) {
  const quotation = await prisma.quotation.findUnique({
    where: { code: params.code },
    include: {
      customer: true,
      items: true,
    },
  });

  if (!quotation) {
    notFound();
  }

  return <QuotationViewerClient quotation={quotation} />;
}

