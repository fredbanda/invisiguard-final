/*
  Warnings:

  - You are about to drop the `scan_report` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "scan_report" DROP CONSTRAINT "scan_report_userId_fkey";

-- DropTable
DROP TABLE "scan_report";

-- CreateTable
CREATE TABLE "scan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emails" TEXT[],
    "phones" TEXT[],
    "domains" TEXT[],
    "result" TEXT,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "scan" ADD CONSTRAINT "scan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
