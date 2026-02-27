import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
// import { ObjectId } from 'mongodb';

// ==================== READ (GET ALL) ====================
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const transactions = await db
      .collection('transactions')
      .find({})
      .sort({ date: -1 })
      .toArray();

    const formattedTransactions = transactions.map((transaction) => ({
      id: transaction._id.toString(),
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
    }));

    return NextResponse.json(formattedTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// ==================== CREATE (POST) ====================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, description, amount, type, category } = body;

    if (!date || !description || !amount || !type || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection('transactions').insertOne({
      date,
      description,
      amount: parseFloat(amount),
      type,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newTransaction = {
      id: result.insertedId.toString(),
      date,
      description,
      amount: parseFloat(amount),
      type,
      category,
    };

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
