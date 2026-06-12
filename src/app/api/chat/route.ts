import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY is not set");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "DhakaStay",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",
        messages: [
          {
            role: "system",
            content: "তুমি DhakaStay-এর AI Assistant। DhakaStay হলো Dhaka শহরের একটি Student Housing Platform। শুধু hostel booking, room info, pricing, location সম্পর্কে সাহায্য করবে। বাংলা ও English দুটোতেই উত্তর দিতে পারবে।"
          },
          {
            role: "user",
            content: message
          }
        ],
      }),
    });

    // ← এই অংশটা আগে ছিল না
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", JSON.stringify(errorData));
      return NextResponse.json(
        { error: "AI service error", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("Unexpected response structure:", JSON.stringify(data));
      return NextResponse.json({ error: "No reply from AI" }, { status: 500 });
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}