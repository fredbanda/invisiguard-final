-- CreateTable
CREATE TABLE "business" (
    "id" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT,
    "address" TEXT,
    "companyName" TEXT,
    "industry" TEXT,
    "website" TEXT,
    "preferredTime" TEXT[],
    "timezone" TEXT,
    "additionalNotes" TEXT,
    "serviceDescription" TEXT,
    "timeline" TEXT,
    "budget" TEXT,
    "country" TEXT,
    "companySize" TEXT,
    "annualRevenue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);
