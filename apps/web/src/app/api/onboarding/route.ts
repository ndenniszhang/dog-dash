import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const client = await clerkClient();
  const user = await client.users.updateUserMetadata(userId, {
    publicMetadata: body,
  });

  return NextResponse.json({ metadata: user.publicMetadata });
}
