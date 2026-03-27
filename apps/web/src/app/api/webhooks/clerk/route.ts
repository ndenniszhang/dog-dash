/**
 * Clerk webhook route — simulated user sync.
 * Replace with real Svix signature verification for production.
 */

import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/services/user.service';

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    first_name: string;
    last_name: string;
    image_url: string;
    phone_numbers: Array<{ phone_number: string }>;
  };
}

export async function POST(req: NextRequest) {
  let body: ClerkWebhookEvent;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { type, data } = body;

  if (type === 'user.created' || type === 'user.updated') {
    await userService.upsert({
      clerkId: data.id,
      email: data.email_addresses[0]?.email_address ?? '',
      firstName: data.first_name ?? '',
      lastName: data.last_name ?? '',
      imageUrl: data.image_url,
      phone: data.phone_numbers[0]?.phone_number ?? '',
    });
  }

  return NextResponse.json({ received: true });
}
