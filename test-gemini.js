import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  console.log("API Key present:", !!process.env.GEMINI_API_KEY);
  if (!process.env.GEMINI_API_KEY) {
    console.error("No API Key found in .env");
    return;
  }

  const modelsToTest = ["gemini-1.5-flash-001", "gemini-1.5-flash", "gemini-pro"];

  for (const modelName of modelsToTest) {
    console.log(`\nTesting model: ${modelName}`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello, are you working?");
      console.log(`✅ Success with ${modelName}:`, result.response.text().slice(0, 50) + "...");
    } catch (error) {
      console.error(`❌ Error with ${modelName}:`, error.message);
    }
  }
}

run();
