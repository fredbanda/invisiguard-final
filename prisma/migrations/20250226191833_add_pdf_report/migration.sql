/*
  Warnings:

  - You are about to drop the `max_mind_report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "max_mind_report" DROP CONSTRAINT "max_mind_report_userId_fkey";

-- DropForeignKey
ALTER TABLE "scan" DROP CONSTRAINT "scan_userId_fkey";

-- DropTable
DROP TABLE "max_mind_report";

-- DropTable
DROP TABLE "scan";

-- CreateTable
CREATE TABLE "scan_report" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "pdfData" BYTEA,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scan_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "visitorId" TEXT,
    "ipAddress" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "iin" TEXT,
    "eventTime" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL,
    "billingCity" TEXT,
    "billingCountry" TEXT,
    "billingPostalCode" TEXT,
    "billingPhone" TEXT,
    "shippingAddress1" TEXT,
    "shippingAddress2" TEXT,
    "shippingCountry" TEXT,
    "shippingPostalCode" TEXT,
    "riskScore" DOUBLE PRECISION,
    "minFraudData" JSONB NOT NULL,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "scan_report" ADD CONSTRAINT "scan_report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
