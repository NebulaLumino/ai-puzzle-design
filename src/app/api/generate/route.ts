import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { formData, systemPrompt } = await req.json();
    const userMessage = `${systemPrompt}\n\nFORM DATA:\n${JSON.stringify(formData, null, 2)}`;
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an expert game designer and content creator. Generate detailed, creative, and actionable game content based on the user's form inputs. Format your response clearly with headers, bullet points, and structured sections.",
        },
        { role: "user", content: userMessage },
      ],
      temperature: 0.8,
      max_tokens: 3000,
    });
    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
