import { NextResponse } from 'next/server';

// Example: Replace with your actual database logic
import { db } from '@/lib/db';

// Example: Replace with your schemas or validation
import { createPenTestReportSchema } from '@/schemas';

// GET Handler
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (id) {
      const data = await db.penTestReport.findUnique({ where: { id } });
      if (!data) return NextResponse.json({ error: 'Data not found' }, { status: 404 });
      return NextResponse.json(data);
    } else {
      const allData = await db.penTestReport.findMany();
      return NextResponse.json(allData);
    }
  } catch (error: unknown) {
    console.error('Error in GET handler:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST Handler
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createPenTestReportSchema.parse(body); // Replace with your schema validation

    const newData = await db.penTestReport.create({ data: validatedData });
    return NextResponse.json(newData, { status: 201 });
  } catch (error: unknown) {
    console.error('Error in POST handler:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

