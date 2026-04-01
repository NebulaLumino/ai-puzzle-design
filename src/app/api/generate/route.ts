import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { puzzleType, difficulty, theme, numPuzzles } = await req.json();

    const prompt = `You are a world-class puzzle designer. Design ${numPuzzles} unique and creative puzzle${numPuzzles > 1 ? 's' : ''} with the following specifications:

- **Puzzle Type:** ${puzzleType}
- **Difficulty:** ${difficulty}
- **Theme:** ${theme}

For each puzzle, provide:
1. **Name** - A catchy, memorable title
2. **Mechanic** - How the puzzle works (be specific and creative)
3. **Setup** - What the player sees/has access to
4. **Solution Hint** - A subtle clue for stuck players
5. **Difficulty Notes** - Why this is rated at ${difficulty} difficulty

Make the puzzles original, engaging, and varied. Format each puzzle clearly with headers.`;

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a world-class puzzle designer with expertise in logic puzzles, escape room challenges, lateral thinking, word puzzles, mechanical puzzles, and more. Be creative, specific, and detailed in your designs." },
          { role: "user", content: prompt }
        ],
        temperature: 0.9,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: err }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No response generated.";
    return NextResponse.json({ result: content });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
