/* eslint-disable @typescript-eslint/no-explicit-any */

import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { PestAlertEmail } from "@/lib/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  let body;

  try {
    // Check Content-Type before parsing
    if (request.headers.get("content-type") !== "application/json") {
      return NextResponse.json(
        { error: "Invalid Content-Type. Expected application/json" },
        { status: 400 }
      );
    }

    body = await request.json();

    console.log("Received Body:", body);

    console.log(body.email);

    const { data, error } = await resend.emails.send({
      from: "Acme <no-reply@kargoxlogistics.com>",
      to: [body.email],
      subject: "Price Update Notification",
      react: PestAlertEmail({
        pest: body.pest,
        confidence: body.confidence
      }) as React.ReactElement
    });

    console.log(data);

    if (error) {
      console.error("Email sending error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error("Error processing request:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const config = {
  runtime: "nodejs"
};
