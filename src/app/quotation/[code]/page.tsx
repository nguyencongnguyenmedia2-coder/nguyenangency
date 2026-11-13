import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import QuotationViewerClient from "@/components/quotation/QuotationViewerClient";

export async function generateMetadata({ params }: { params: { code: string } }) {
  return {
    title: `Báo Giá Dịch Vụ #${params.code} – NGUYÊN AGENCY`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function QuotationPage({ params }: { params: { code: string } }) {
  let quotation: any = null;
  try {
    quotation = await prisma.quotation.findUnique({
      where: { code: params.code },
      include: {
        customer: true,
        items: true,
      },
    });
  } catch (err) {
    console.warn("[QuotationPage] DB fetch fallback active:", err);
  }

  if (!quotation) {
    notFound();
  }

  return <QuotationViewerClient quotation={quotation} />;
}

