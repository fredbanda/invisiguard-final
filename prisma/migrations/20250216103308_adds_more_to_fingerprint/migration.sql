/*
  Warnings:

  - Made the column `ipAddress` on table `user_fingerprint` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_fingerprint" ALTER COLUMN "ipAddress" SET NOT NULL;
