"use client";
import { useState } from "react";

interface PanelResult {
  imageUrl: string;
  dialogue: string;
  description: string;
}

const STYLES = [
  { value: "manga", label: "日漫（Manga）" },
  { value: "webtoon", label: "韓漫（Webtoon���" },
  { value: "american comic", label: "美漫（American Comic）" },
  { value: "chibi", label: "Q版（Chibi）" },
];

const PANEL_COUNTS = [2, 4, 6, 8];

export default function Home() {
  const [story, setStory] = useState("");
  const [style, setStyle] = useState("manga");
  const [panelCount, setPanelCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"idle" | "storyboard" | "images" | "done">("idle");
  const [title, setTitle] = useState("");
  const [panels, setPanels] = useState<PanelResult[]>([]);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!story.trim()) return;
    setLoading(true);
    setError("");
    setPanels([]);
    setTitle("");

    try {
      // Step 1: ���鏡生成
      setStep("storyboard");
      const sbRes = await fetch("/api/storyboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story, panelCount, style }),
      });
      if (!sbRes.ok) throw new Error("分鏡生成失敗");
      const sbData = await sbRes.json();
      setTitle(sbData.title ?? "");

      // Step 2: 圖像生成
      setStep("images");
      const imgRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panels: sbData.panels }),
      });
      if (!imgRes.ok) throw new Error("圖像生成失敗");
      const imgData = await imgRes.json();
      setPanels(imgData.panels);
      setStep("done");
    } catch (e: any) {
      setError(e.message ?? "未知錯誤");
      setStep("idle");
    } finally {
      setLoading(false);
    }
  }

  const stepLabel: Record<string, string> = {
    storyboard: "🧠 正在分析故事，生成分鏡腳本...",
    images: "🎨 正在生成漫畫圖像，請稍候...",
  };

  // Grid columns based on panel count
  const gridCols = panelCount <= 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2";

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎌 AI 漫���生成器
          </h1>
          <p className="text-gray-400">輸���你的故事，AI 自動生成漫畫分鏡與圖像</p>
        </div>

        {/* Input Panel */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-8 shadow-lg border border-gray-800">
          <textarea
            className="w-full bg-gray-800 text-white rounded-xl p-4 h-36 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 text-sm mb-4"
            placeholder="在這裡輸入你的故事...例如：一個少女在廢墟城市中發現了一隻受傷的機器人，兩人相互扶持，共同面對末日的危機。"
            value={story}
            onChange={(e) => setStory(e.target.value)}
          />

          <div className="flex flex-wrap gap-4 mb-4">
            {/* 風格選擇 */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs text-gray-400 mb-1">漫畫風格</label>
              <select
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                {STYLES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* 格數選擇 */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs text-gray-400 mb-1">Panel 數量</label>
              <div className="flex gap-2">
                {PANEL_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setPanelCount(n)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                      panelCount === n
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {n}格
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !story.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition text-sm"
          >
            {loading ? stepLabel[step] ?? "處理中..." : "✨ 生成漫畫"}
          </button>

          {error && (
            <div className="mt-4 bg-red-900/40 border border-red-700 rounded-lg px-4 py-3 text-sm text-red-300">
              ❌ {error}
            </div>
          )}
        </div>

        {/* Result */}
        {panels.length > 0 && (
          <div>
            {title && (
              <h2 className="text-2xl font-bold text-center mb-6 text-purple-300">
                《{title}》
              </h2>
            )}
            <div className={`grid ${gridCols} gap-4`}>
              {panels.map((panel, i) => (
                <div
                  key={i}
                  className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-lg"
                >
                  {/* Panel number */}
                  <div className="bg-gray-800 px-3 py-1 text-xs text-gray-400 font-mono">
                    Panel {i + 1}
                  </div>

                  {/* Image */}
                  <div className="relative aspect-square bg-gray-800">
                    <img
                      src={panel.imageUrl}
                      alt={`Panel ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/1024x1024/1f2937/6b7280?text=Image+Error";
                      }}
                    />
                  </div>

                  {/* Dialogue */}
                  {panel.dialogue && (
                    <div className="px-4 py-3 bg-white text-gray-900 text-sm font-medium border-t-2 border-gray-200">
                      💬 {panel.dialogue}
                    </div>
                  )}

                  {/* Description */}
                  {panel.description && (
                    <div className="px-4 py-2 text-xs text-gray-500">
                      {panel.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
