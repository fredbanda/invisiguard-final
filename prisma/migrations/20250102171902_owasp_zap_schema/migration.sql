-- CreateTable
CREATE TABLE "pen_test_report" (
    "id" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "results" JSONB,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pen_test_report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pen_test_report" ADD CONSTRAINT "pen_test_report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
