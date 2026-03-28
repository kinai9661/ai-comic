import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://ai.dooo.ng/v1",
  apiKey: process.env.DOOO_API_KEY,
});

export default client;
