-- CreateTable
CREATE TABLE "max_mind_report" (
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

    CONSTRAINT "max_mind_report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "max_mind_report" ADD CONSTRAINT "max_mind_report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
