/*
  Warnings:

  - You are about to drop the `UserFingerprint` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "UserFingerprint";

-- CreateTable
CREATE TABLE "user_fingerprint" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fingerprintId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "country" TEXT,
    "city" TEXT,
    "isp" TEXT,
    "npnOrProxy" TEXT,
    "botProbability" DOUBLE PRECISION,
    "confidenceScore" DOUBLE PRECISION,
    "fraudScore" DOUBLE PRECISION,
    "browser" TEXT,
    "os" TEXT,
    "device" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "user_fingerprint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_fingerprint_userId_key" ON "user_fingerprint"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_fingerprint_fingerprintId_key" ON "user_fingerprint"("fingerprintId");

-- AddForeignKey
ALTER TABLE "user_fingerprint" ADD CONSTRAINT "user_fingerprint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
