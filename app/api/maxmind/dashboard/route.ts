/* eslint-disable  @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

interface Transaction {
  createdAt: string | number | Date;
  riskScore: number;
}

interface GroupedData {
  timeUnit: string;
  count: number;
  avgRiskScore: number;
  totalRiskScore: number;
}

interface GroupedDataMap {
  [key: string]: GroupedData;
}

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "week"; // week, month, year
    const userId = searchParams.get("userId");

    let startDate: Date;
    const now = new Date();

    // Set the appropriate date range based on the timeframe
    switch (timeframe) {
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }

    // Build filter conditions
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const filterConditions: any = {
      createdAt: {
        gte: startDate,
      },
    };

    if (userId) {
      filterConditions.userId = userId;
    }

    // Get transactions in the date range
    const transactions = await prisma.maxMindTransaction.findMany({
      where: filterConditions,
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        createdAt: true,
        riskScore: true,
        ipAddressRisk: true,
        orderAmount: true,
        orderCurrency: true,
        paymentWasAuthorized: true,
        creditCardWas3DSecureSuccessful: true,
      },
    });

    // Calculate key metrics
    const totalTransactions = transactions.length;
    const highRiskTransactions = transactions.filter(
      (t) => t.riskScore >= 75
    ).length;
    const mediumRiskTransactions = transactions.filter(
      (t) => t.riskScore >= 30 && t.riskScore < 75
    ).length;
    const lowRiskTransactions = transactions.filter(
      (t) => t.riskScore < 30
    ).length;

    // Calculate average risk score
    const avgRiskScore =
      totalTransactions > 0
        ? transactions.reduce((sum, t) => sum + t.riskScore, 0) /
          totalTransactions
        : 0;

    // Group transactions by day/week/month for chart data
    const chartData = groupTransactionsByTimeUnit(transactions, timeframe);

    // Currency distribution
    const currencyDistribution = transactions.reduce((acc, t) => {
      const currency = t.orderCurrency;
      if (!acc[currency]) {
        acc[currency] = 0;
      }
      acc[currency]++;
      return acc;
    }, {} as Record<string, number>);

    // Return dashboard data
    return NextResponse.json({
      summary: {
        totalTransactions,
        highRiskTransactions,
        mediumRiskTransactions,
        lowRiskTransactions,
        avgRiskScore,
      },
      chartData,
      currencyDistribution,
      recentTransactions: transactions.slice(-5).reverse(),
    });
  } catch (error) {
    console.error("Error retrieving dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to retrieve dashboard data", details: error },
      { status: 500 }
    );
  }
}

// Helper function to group transactions by time unit

function groupTransactionsByTimeUnit(
  transactions: Transaction[],
  timeframe: string
): GroupedData[] {
  const groupedData: GroupedDataMap = {};

  // biome-ignore lint/complexity/noForEach: <explanation>
  transactions.forEach((transaction) => {
    let timeUnit: string;
    const date = new Date(transaction.createdAt);

    switch (timeframe) {
      case "week":
      case "month":
        // Group by day
        timeUnit = date.toISOString().split("T")[0];
        break;
      case "year":
        // Group by month
        timeUnit = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        break;
      default:
        timeUnit = date.toISOString().split("T")[0];
    }

    if (!groupedData[timeUnit]) {
      groupedData[timeUnit] = {
        timeUnit,
        count: 0,
        avgRiskScore: 0,
        totalRiskScore: 0,
      };
    }

    groupedData[timeUnit].count++;
    groupedData[timeUnit].totalRiskScore += transaction.riskScore;
    groupedData[timeUnit].avgRiskScore =
      groupedData[timeUnit].totalRiskScore / groupedData[timeUnit].count;
  });

  // Convert to array and sort by time unit
  return Object.values(groupedData).sort((a, b) =>
    a.timeUnit.localeCompare(b.timeUnit)
  );
}
