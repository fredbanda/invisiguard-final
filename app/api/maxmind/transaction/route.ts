/* eslint-disable  @typescript-eslint/no-explicit-any */

import { PrismaClient } from '@prisma/client';
import * as minFraud from '@maxmind/minfraud-api-node';
import { NextResponse } from 'next/server';
import { generateMinFraudReport } from '@/lib/pdf-generator';
import { db } from '@/lib/db';


const prisma = new PrismaClient();
const accountId = process.env.MINFRAUD_ACCOUNT_ID || process.env.MAXMIND_ACCOUNT_ID || "";
const licenseKey = process.env.MINFRAUD_LICENSE_KEY || process.env.MAXMIND_LICENSE_KEY || "";
const client = new minFraud.Client(accountId, licenseKey);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userId, ...transactionData } = data;

    // Create MinFraud transaction object
    const transaction = new minFraud.Transaction({
      device: new minFraud.Device({
        ipAddress: transactionData.deviceIpAddress,
      }),
      event: new minFraud.Event({
        transactionId: transactionData.eventTransactionId,
        type: transactionData.eventType,
      }),
      account: new minFraud.Account({
        userId: transactionData.accountUserId,
      }),
    });

    // Get risk score from MaxMind
    const response = await client.score(transaction);

    // Save transaction to database
    const dbTransaction = await db.maxMindTransaction.create({
      data: {
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
    
        // ✅ Device Information
        deviceIpAddress: transactionData.deviceIpAddress,
    
        // ✅ Event Details
        eventShopId: transactionData.eventShopId,
        eventTime: new Date(transactionData.eventTime),
        eventTransactionId: transactionData.eventTransactionId,
        eventType: transactionData.eventType,
    
        // ✅ Account Information
        accountUserId: transactionData.accountUserId,
        accountUsername: transactionData.accountUsername,
    
        // ✅ Email Details
        emailAddress: transactionData.emailAddress,
        emailDomain: transactionData.emailDomain,
    
        // ✅ Billing Information
        billingAddress: transactionData.billingAddress,
        billingAddress2: transactionData.billingAddress2 || null,
        billingCity: transactionData.billingCity,
        billingCompany: transactionData.billingCompany || null,
        billingCountry: transactionData.billingCountry,
        billingFirstName: transactionData.billingFirstName,
        billingLastName: transactionData.billingLastName,
        billingPhoneCountryCode: transactionData.billingPhoneCountryCode,
        billingPhoneNumber: transactionData.billingPhoneNumber,
        billingPostal: transactionData.billingPostal,
        billingRegion: transactionData.billingRegion,
    
        // ✅ Shipping Information
        shippingAddress: transactionData.shippingAddress,
        shippingAddress2: transactionData.shippingAddress2 || null,
        shippingCity: transactionData.shippingCity,
        shippingCompany: transactionData.shippingCompany || null,
        shippingCountry: transactionData.shippingCountry,
        shippingDeliverySpeed: transactionData.shippingDeliverySpeed,
        shippingFirstName: transactionData.shippingFirstName,
        shippingLastName: transactionData.shippingLastName,
        shippingPhoneCountryCode: transactionData.shippingPhoneCountryCode,
        shippingPhoneNumber: transactionData.shippingPhoneNumber,
        shippingPostal: transactionData.shippingPostal,
        shippingRegion: transactionData.shippingRegion,
    
        // ✅ Payment Details
        paymentDeclineCode: transactionData.paymentDeclineCode || null,
        paymentProcessor: transactionData.paymentProcessor,
        paymentWasAuthorized: transactionData.paymentWasAuthorized,
    
        // ✅ Credit Card Information
        creditCardAvsResult: transactionData.creditCardAvsResult,
        creditCardBankName: transactionData.creditCardBankName || null,
        creditCardBankPhoneCountryCode: transactionData.creditCardBankPhoneCountryCode || null,
        creditCardBankPhoneNumber: transactionData.creditCardBankPhoneNumber || null,
        creditCardCvvResult: transactionData.creditCardCvvResult,
        creditCardIssuerIdNumber: transactionData.creditCardIssuerIdNumber,
        creditCardLastDigits: transactionData.creditCardLastDigits,
        creditCardToken: transactionData.creditCardToken || null,
        creditCardWas3DSecureSuccessful: transactionData.creditCardWas3DSecureSuccessful || false,
    
        // ✅ Order Details
        orderAffiliateId: transactionData.orderAffiliateId || null,
        orderAmount: transactionData.orderAmount,
        orderCurrency: transactionData.orderCurrency,
        orderDiscountCode: transactionData.orderDiscountCode || null,
        orderHasGiftMessage: transactionData.orderHasGiftMessage,
        orderIsGift: transactionData.orderIsGift,
        orderReferrerUri: transactionData.orderReferrerUri || null,
        orderSubaffiliateId: transactionData.orderSubaffiliateId || null,
    
        // ✅ Risk Scoring
        riskScore: response.riskScore,
        ipAddressRisk: response.ipAddress?.risk || 0,
    
        // ✅ Shopping Cart Items (if available)
        shoppingCartItems: {
          create: transactionData.shoppingCartItems?.map((item: any) => ({
            category: item.category,
            itemId: item.itemId,
            price: item.price,
            quantity: item.quantity,
          })) || [],
        },
      },
    });
    
    console.log(dbTransaction);
    
    // Generate PDF
    const pdfBytes = await generateMinFraudReport(dbTransaction, dbTransaction.id);

    // Store PDF in the database
    await prisma.maxMindTransaction.update({
      where: { id: dbTransaction.id },
      data: { generatedPdf: pdfBytes },
    });

    return NextResponse.json({
      success: true,
      transactionId: dbTransaction.id,
      riskScore: response.riskScore,
      ipAddressRisk: response.ipAddress?.risk || 0,
    });
  } catch (error) {
    console.error('Error processing transaction:', error);
    return NextResponse.json(
      { error: 'Failed to process transaction', details: error },
      { status: 500 }
    );
  }
}


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const userId = searchParams.get("userId");
    const minRiskScore = parseFloat(searchParams.get("minRiskScore") || "0");
    const maxRiskScore = parseFloat(searchParams.get("maxRiskScore") || "100");

    // Query conditions
    const where: any = {};
    if (startDate && endDate) {
      where.eventTime = { gte: new Date(startDate), lte: new Date(endDate) };
    }
    if (userId) {
      where.userId = userId;
    }
    if (!isNaN(minRiskScore) && !isNaN(maxRiskScore)) {
      where.riskScore = { gte: minRiskScore, lte: maxRiskScore };
    }

    // Fetch transactions from database with filters
    const transactions = await prisma.maxMindTransaction.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { eventTime: "desc" },
    });

    // Get total count for pagination
    const totalCount = await prisma.maxMindTransaction.count({ where });

    return NextResponse.json({
      transactions,
      pagination: { page, pageSize: limit, total: totalCount },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
