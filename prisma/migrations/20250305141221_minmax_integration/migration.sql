/*
  Warnings:

  - You are about to drop the column `data` on the `pdf_data` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fingerprintId]` on the table `pdf_data` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pdfBytes` to the `pdf_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pdfName` to the `pdf_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pdf_data" DROP COLUMN "data",
ADD COLUMN     "pdfBytes" BYTEA NOT NULL,
ADD COLUMN     "pdfName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "maxmind_transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deviceIpAddress" TEXT NOT NULL,
    "eventShopId" TEXT NOT NULL,
    "eventTime" TIMESTAMP(3) NOT NULL,
    "eventTransactionId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "accountUserId" TEXT NOT NULL,
    "accountUsername" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "emailDomain" TEXT NOT NULL,
    "billingAddress" TEXT NOT NULL,
    "billingAddress2" TEXT,
    "billingCity" TEXT NOT NULL,
    "billingCompany" TEXT,
    "billingCountry" TEXT NOT NULL,
    "billingFirstName" TEXT NOT NULL,
    "billingLastName" TEXT NOT NULL,
    "billingPhoneCountryCode" TEXT NOT NULL,
    "billingPhoneNumber" TEXT NOT NULL,
    "billingPostal" TEXT NOT NULL,
    "billingRegion" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "shippingAddress2" TEXT,
    "shippingCity" TEXT NOT NULL,
    "shippingCompany" TEXT,
    "shippingCountry" TEXT NOT NULL,
    "shippingDeliverySpeed" TEXT NOT NULL,
    "shippingFirstName" TEXT NOT NULL,
    "shippingLastName" TEXT NOT NULL,
    "shippingPhoneCountryCode" TEXT NOT NULL,
    "shippingPhoneNumber" TEXT NOT NULL,
    "shippingPostal" TEXT NOT NULL,
    "shippingRegion" TEXT NOT NULL,
    "paymentDeclineCode" TEXT,
    "paymentProcessor" TEXT NOT NULL,
    "paymentWasAuthorized" BOOLEAN NOT NULL,
    "creditCardAvsResult" TEXT NOT NULL,
    "creditCardBankName" TEXT,
    "creditCardBankPhoneCountryCode" TEXT,
    "creditCardBankPhoneNumber" TEXT,
    "creditCardCvvResult" TEXT NOT NULL,
    "creditCardIssuerIdNumber" TEXT NOT NULL,
    "creditCardLastDigits" TEXT NOT NULL,
    "creditCardToken" TEXT,
    "creditCardWas3DSecureSuccessful" BOOLEAN NOT NULL,
    "orderAffiliateId" TEXT,
    "orderAmount" DOUBLE PRECISION NOT NULL,
    "orderCurrency" TEXT NOT NULL,
    "orderDiscountCode" TEXT,
    "orderHasGiftMessage" BOOLEAN NOT NULL,
    "orderIsGift" BOOLEAN NOT NULL,
    "orderReferrerUri" TEXT,
    "orderSubaffiliateId" TEXT,
    "riskScore" DOUBLE PRECISION NOT NULL,
    "ipAddressRisk" INTEGER NOT NULL,
    "generatedPdf" BYTEA,

    CONSTRAINT "maxmind_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShoppingCartItem" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ShoppingCartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pdf_data_fingerprintId_key" ON "pdf_data"("fingerprintId");

-- AddForeignKey
ALTER TABLE "maxmind_transactions" ADD CONSTRAINT "maxmind_transactions_accountUserId_fkey" FOREIGN KEY ("accountUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingCartItem" ADD CONSTRAINT "ShoppingCartItem_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "maxmind_transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
