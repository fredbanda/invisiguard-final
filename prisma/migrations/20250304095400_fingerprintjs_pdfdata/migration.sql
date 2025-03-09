-- AlterTable
-- ALTER TABLE "scan" ADD COLUMN     "ips" TEXT[];

-- CreateTable
CREATE TABLE "pdf_data" (
    "id" TEXT NOT NULL,
    "fingerprintId" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pdf_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pdf_data" ADD CONSTRAINT "pdf_data_fingerprintId_fkey" FOREIGN KEY ("fingerprintId") REFERENCES "user_fingerprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
