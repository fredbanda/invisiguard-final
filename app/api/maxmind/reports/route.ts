import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    // biome-ignore lint/style/useNumberNamespace: <explanation>
    const page = parseInt(searchParams.get('page') || '1');
    // biome-ignore lint/style/useNumberNamespace: <explanation>
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Build filter conditions
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            const filterConditions: any = {};
    
    if (userId) {
      filterConditions.userId = userId;
    }
    
    if (startDate && endDate) {
      filterConditions.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      filterConditions.createdAt = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      filterConditions.createdAt = {
        lte: new Date(endDate),
      };
    }
    
    // Get transactions
    const transactions = await prisma.maxMindTransaction.findMany({
      where: filterConditions,
      include: {
        shoppingCartItems: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });
    
    // Get total count for pagination
    const totalCount = await prisma.maxMindTransaction.count({
      where: filterConditions,
    });
    
    return NextResponse.json({
      transactions,
      pagination: {
        total: totalCount,
        page,
        pageSize: limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error retrieving transaction reports:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve reports', details: error }, 
      { status: 500 }
    );
  }
}
