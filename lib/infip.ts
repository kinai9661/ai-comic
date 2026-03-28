export interface GenerateImageParams {
  prompt: string;
  n?: number;
  size?: string;
  model?: string;
}

export async function generateImage(params: GenerateImageParams): Promise<string[]> {
  const response = await fetch("https://api.infip.pro/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.INFIP_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: params.model ?? "img4",
      prompt: params.prompt,
      n: params.n ?? 1,
      size: params.size ?? "1024x1024",
      response_format: "url",
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Infip API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return (data.data as { url: string }[]).map((item) => item.url);
}
