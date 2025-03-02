/*
  Warnings:

  - You are about to drop the `Fingerprint` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Fingerprint";

-- CreateTable
CREATE TABLE "UserFingerprint" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "riskScore" DOUBLE PRECISION,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "UserFingerprint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserFingerprint_userId_key" ON "UserFingerprint"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFingerprint_fingerprint_key" ON "UserFingerprint"("fingerprint");
