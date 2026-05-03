import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

const STOCK_FILE = join(process.cwd(), 'data', 'stock.json');

function readStock(): { count: number } {
  try {
    if (!existsSync(STOCK_FILE)) {
      const dir = join(process.cwd(), 'data');
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(STOCK_FILE, JSON.stringify({ count: 100 }));
      return { count: 100 };
    }
    return JSON.parse(readFileSync(STOCK_FILE, 'utf-8'));
  } catch {
    return { count: 100 };
  }
}

function writeStock(count: number) {
  const dir = join(process.cwd(), 'data');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(STOCK_FILE, JSON.stringify({ count }));
}

// GET /api/stock → { count, available, low }
export async function GET() {
  const { count } = readStock();
  return NextResponse.json({
    count,
    available: count > 0,
    low: count > 0 && count <= 20,
  });
}

// POST /api/stock { count: number } — requires Authorization: Bearer ADMIN_SECRET
export async function POST(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  const auth = req.headers.get('authorization') ?? '';
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { count } = (body ?? {}) as { count?: unknown };
  if (typeof count !== 'number' || count < 0 || !Number.isInteger(count)) {
    return NextResponse.json({ error: 'count must be a non-negative integer' }, { status: 422 });
  }

  writeStock(count);
  return NextResponse.json({ success: true, count });
}
