import { URL } from 'node:url';
import * as minFraud from '@maxmind/minfraud-api-node';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generatePdfForTransaction } from '@/lib/pdf-generator';

const prisma = new PrismaClient();

// This should be in an environment variable
const MAXMIND_ACCOUNT_ID = process.env.MAXMIND_ACCOUNT_ID || "1234";
const MAXMIND_LICENSE_KEY = process.env.MAXMIND_LICENSE_KEY || "LICENSEKEY";

// Create reusable client
const client = new minFraud.Client(MAXMIND_ACCOUNT_ID, MAXMIND_LICENSE_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userId, ...transactionData } = data;
    
    // Create a new MinFraud transaction object
    const transaction = new minFraud.Transaction({
      device: new minFraud.Device({
        ipAddress: transactionData.deviceIpAddress,
        acceptLanguage: transactionData.deviceAcceptLanguage,
        sessionAge: transactionData.deviceSessionAge,
        sessionId: transactionData.deviceSessionId,
        userAgent: transactionData.deviceUserAgent,
      }),
      event: new minFraud.Event({
        shopId: transactionData.eventShopId,
        time: new Date(transactionData.eventTime),
        transactionId: transactionData.eventTransactionId,
        type: transactionData.eventType,
      }),
      account: new minFraud.Account({
        userId: transactionData.accountUserId,
        username: transactionData.accountUsername,
      }),
      email: new minFraud.Email({
        address: transactionData.emailAddress,
        domain: transactionData.emailDomain,
      }),
      billing: new minFraud.Billing({
        address: transactionData.billingAddress,
        address2: transactionData.billingAddress2,
        city: transactionData.billingCity,
        company: transactionData.billingCompany,
        country: transactionData.billingCountry,
        firstName: transactionData.billingFirstName,
        lastName: transactionData.billingLastName,
        phoneCountryCode: transactionData.billingPhoneCountryCode,
        phoneNumber: transactionData.billingPhoneNumber,
        postal: transactionData.billingPostal,
        region: transactionData.billingRegion,
      }),
      shipping: new minFraud.Shipping({
        address: transactionData.shippingAddress,
        address2: transactionData.shippingAddress2,
        city: transactionData.shippingCity,
        company: transactionData.shippingCompany,
        country: transactionData.shippingCountry,
        firstName: transactionData.shippingFirstName,
        lastName: transactionData.shippingLastName,
        phoneCountryCode: transactionData.shippingPhoneCountryCode,
        phoneNumber: transactionData.shippingPhoneNumber,
        postal: transactionData.shippingPostal,
        region: transactionData.shippingRegion,
      }),
      payment: new minFraud.Payment({
        declineCode: transactionData.paymentDeclineCode,
        processor: transactionData.paymentProcessor,
        wasAuthorized: transactionData.paymentWasAuthorized,
      }),
      creditCard: new minFraud.CreditCard({
        avsResult: transactionData.creditCardAvsResult,
        bankName: transactionData.creditCardBankName,
        bankPhoneCountryCode: transactionData.creditCardBankPhoneCountryCode,
        bankPhoneNumber: transactionData.creditCardBankPhoneNumber,
        cvvResult: transactionData.creditCardCvvResult,
        issuerIdNumber: transactionData.creditCardIssuerIdNumber,
        last4digits: transactionData.creditCardLastDigits,
        token: transactionData.creditCardToken,
      }),
      order: new minFraud.Order({
        affiliateId: transactionData.orderAffiliateId,
        amount: transactionData.orderAmount,
        currency: transactionData.orderCurrency,
        discountCode: transactionData.orderDiscountCode,
        hasGiftMessage: transactionData.orderHasGiftMessage,
        isGift: transactionData.orderIsGift,
        referrerUri: transactionData.orderReferrerUri ? new URL(transactionData.orderReferrerUri) : undefined,
        subaffiliateId: transactionData.orderSubaffiliateId,
      }),
      shoppingCart: transactionData.shoppingCartItems?.map(item => 
        new minFraud.ShoppingCartItem({
          category: item.category,
          itemId: item.itemId,
          price: item.price,
          quantity: item.quantity,
        })
      ) || [],
    });

    // Get risk score from MaxMind
    const response = await client.score(transaction);
    
    // Create a new database record with the transaction data and the risk score
    const dbTransaction = await prisma.maxMindTransaction.create({
      data: {
        userId,
        deviceIpAddress: transactionData.deviceIpAddress,
        eventShopId: transactionData.eventShopId,
        eventTime: new Date(transactionData.eventTime),
        eventTransactionId: transactionData.eventTransactionId,
        eventType: transactionData.eventType,
        accountUserId: transactionData.accountUserId,
        accountUsername: transactionData.accountUsername,
        emailAddress: transactionData.emailAddress,
        emailDomain: transactionData.emailDomain,
        billingAddress: transactionData.billingAddress,
        billingAddress2: transactionData.billingAddress2,
        billingCity: transactionData.billingCity,
        billingCompany: transactionData.billingCompany,
        billingCountry: transactionData.billingCountry,
        billingFirstName: transactionData.billingFirstName,
        billingLastName: transactionData.billingLastName,
        billingPhoneCountryCode: transactionData.billingPhoneCountryCode,
        billingPhoneNumber: transactionData.billingPhoneNumber,
        billingPostal: transactionData.billingPostal,
        billingRegion: transactionData.billingRegion,
        shippingAddress: transactionData.shippingAddress,
        shippingAddress2: transactionData.shippingAddress2,
        shippingCity: transactionData.shippingCity,
        shippingCompany: transactionData.shippingCompany,
        shippingCountry: transactionData.shippingCountry,
        shippingDeliverySpeed: transactionData.shippingDeliverySpeed,
        shippingFirstName: transactionData.shippingFirstName,
        shippingLastName: transactionData.shippingLastName,
        shippingPhoneCountryCode: transactionData.shippingPhoneCountryCode,
        shippingPhoneNumber: transactionData.shippingPhoneNumber,
        shippingPostal: transactionData.shippingPostal,
        shippingRegion: transactionData.shippingRegion,
        paymentDeclineCode: transactionData.paymentDeclineCode,
        paymentProcessor: transactionData.paymentProcessor,
        paymentWasAuthorized: transactionData.paymentWasAuthorized,
        creditCardAvsResult: transactionData.creditCardAvsResult,
        creditCardBankName: transactionData.creditCardBankName,
        creditCardBankPhoneCountryCode: transactionData.creditCardBankPhoneCountryCode,
        creditCardBankPhoneNumber: transactionData.creditCardBankPhoneNumber,
        creditCardCvvResult: transactionData.creditCardCvvResult,
        creditCardIssuerIdNumber: transactionData.creditCardIssuerIdNumber,
        creditCardLastDigits: transactionData.creditCardLastDigits,
        creditCardToken: transactionData.creditCardToken,
        creditCardWas3DSecureSuccessful: transactionData.creditCardWas3DSecureSuccessful || false,
        orderAffiliateId: transactionData.orderAffiliateId,
        orderAmount: transactionData.orderAmount,
        orderCurrency: transactionData.orderCurrency,
        orderDiscountCode: transactionData.orderDiscountCode,
        orderHasGiftMessage: transactionData.orderHasGiftMessage,
        orderIsGift: transactionData.orderIsGift,
        orderReferrerUri: transactionData.orderReferrerUri,
        orderSubaffiliateId: transactionData.orderSubaffiliateId,
        riskScore: response.riskScore,
        ipAddressRisk: response.ipAddress?.risk,
        shoppingCartItems: {
          create: transactionData.shoppingCartItems?.map(item => ({
            category: item.category,
            itemId: item.itemId,
            price: item.price,
            quantity: item.quantity,
          })) || [],
        },
      },
    });

    // Generate PDF report and update the record with the PDF data
    const pdfBytes = await generatePdfForTransaction(dbTransaction);
    
    await prisma.maxMindTransaction.update({
      where: { id: dbTransaction.id },
      data: { generatedPdf: pdfBytes },
    });

    return NextResponse.json({ 
      success: true, 
      transactionId: dbTransaction.id,
      riskScore: response.riskScore,
      ipAddressRisk: response.ipAddress.risk
    });
  } catch (error) {
    console.error('Error processing transaction:', error);
    return NextResponse.json(
      { error: 'Failed to process transaction', details: error}, 
      { status: 500 }
    );
  }
}
