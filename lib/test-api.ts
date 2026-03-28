import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://ai.dooo.ng/v1",
  apiKey: process.env.DOOO_API_KEY,
});

export async function testAPI() {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-5.4",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: "Hello, respond with JSON: {\"test\": true}",
        },
      ],
      response_format: { type: "json_object" },
    } as any);

    console.log("API Response:", response);
    return response;
  } catch (error: any) {
    console.error("API Error:", error.message);
    console.error("Error details:", error);
    throw error;
  }
}
