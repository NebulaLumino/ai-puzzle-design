"use client";
import { useState } from "react";

const PUZZLE_TYPES = ["Logic Grid", "Escape Room", "Word/Wordplay", "Lateral Thinking", "Mechanical/Rube Goldberg", "Pattern Recognition", "Cryptic", "Mathematical"];
const DIFFICULTIES = ["Easy", "Medium", "Hard", "Expert", "Master"];
const THEMES = ["Ancient Egypt", "Cyberpunk City", "Pirate Treasure", "Space Station", "Haunted Mansion", "Underwater Kingdom", "Wild West", "Fantasy Forest", "Steampunk Factory", "Zen Garden"];

export default function PuzzleDesignPage() {
  const [puzzleType, setPuzzleType] = useState("Escape Room");
  const [difficulty, setDifficulty] = useState("Medium");
  const [theme, setTheme] = useState("Cyberpunk City");
  const [numPuzzles, setNumPuzzles] = useState("3");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ puzzleType, difficulty, theme, numPuzzles: parseInt(numPuzzles) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setResult(data.result);
    } catch { setError("Failed to generate puzzles."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-950 via-slate-900 to-violet-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
            🧩 AI Puzzle Designer
          </h1>
          <p className="text-slate-400">Generate unique, creative puzzles tailored to your specifications</p>
        </header>

        <form onSubmit={handleGenerate} className="bg-slate-800/60 backdrop-blur rounded-2xl p-6 mb-8 border border-violet-500/20 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-violet-300 mb-2">Puzzle Type</label>
              <select value={puzzleType} onChange={e => setPuzzleType(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                {PUZZLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-violet-300 mb-2">Difficulty</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-violet-300 mb-2">Theme / Setting</label>
              <select value={theme} onChange={e => setTheme(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-violet-300 mb-2">Number of Puzzles</label>
              <select value={numPuzzles} onChange={e => setNumPuzzles(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                {[1,2,3,4,5].map(n => <option key={n} value={String(n)}>{n}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl font-semibold text-white transition-all disabled:opacity-50">
            {loading ? "Designing Puzzles..." : "🎲 Generate Puzzles"}
          </button>
        </form>

        {error && <div className="bg-red-900/40 border border-red-500/40 rounded-xl p-4 text-red-300 mb-6">{error}</div>}

        {result && (
          <div className="bg-slate-800/60 backdrop-blur rounded-2xl p-6 border border-violet-500/20">
            <h2 className="text-xl font-bold text-violet-300 mb-4">🎨 Your Puzzles</h2>
            <div className="prose prose-invert prose-violet max-w-none whitespace-pre-wrap text-slate-200 leading-relaxed">{result}</div>
          </div>
        )}
      </div>
    </main>
  );
}
