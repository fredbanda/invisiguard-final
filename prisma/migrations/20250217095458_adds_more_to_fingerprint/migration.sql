/*
  Warnings:

  - You are about to drop the column `city` on the `user_fingerprint` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `user_fingerprint` table. All the data in the column will be lost.
  - You are about to drop the column `fingerprintId` on the `user_fingerprint` table. All the data in the column will be lost.
  - You are about to drop the column `fraudScore` on the `user_fingerprint` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `user_fingerprint` table. All the data in the column will be lost.
  - You are about to drop the column `isp` on the `user_fingerprint` table. All the data in the column will be lost.
  - You are about to drop the column `vpnOrProxy` on the `user_fingerprint` table. All the data in the column will be lost.
  - Added the required column `visitorId` to the `user_fingerprint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_fingerprint" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "fingerprintId",
DROP COLUMN "fraudScore",
DROP COLUMN "ip",
DROP COLUMN "isp",
DROP COLUMN "vpnOrProxy",
ADD COLUMN     "incognito" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "platform" TEXT,
ADD COLUMN     "screenResolution" TEXT,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "timezone" TEXT,
ADD COLUMN     "touchScreen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "visitorId" TEXT NOT NULL,
ADD COLUMN     "vpnDetected" BOOLEAN NOT NULL DEFAULT false;
