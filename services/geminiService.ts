import { GoogleGenAI, Chat } from "@google/genai";
import { CompanyAnalysis } from "../types";

// Helper to clean JSON string if it comes in a markdown block
const cleanJsonString = (str: string): string => {
  return str.replace(/```json\n?|\n?```/g, "").trim();
};

export class GeminiService {
  private ai: GoogleGenAI;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.API_KEY || '';
    if (!this.apiKey) {
      console.error("API_KEY is missing from environment variables.");
    }
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  async analyzeWebsite(url: string): Promise<CompanyAnalysis> {
    const model = 'gemini-2.5-flash';
    
    // We cannot use responseSchema with googleSearch, so we ask for JSON in the text.
    const prompt = `
      You are an expert AI persona architect. Your goal is to analyze the company at this URL: ${url}
      
      Perform a deep "crawl" simulation using Google Search to understand the company's:
      1. Core identity and mission.
      2. Product or service offerings (look for features, pricing, sub-pages info).
      3. Brand voice/tone (e.g., professional, playful, authoritative).
      4. Target audience and key value propositions.

      Based on this research, generate a highly optimized "System Instruction" for an AI Sales Representative for this company. 
      The system instruction should define the AI's persona, its knowledge base, its goal (conversion/support), and guardrails.

      Output the result STRICTLY as a JSON object with the following structure. Do not add any markdown formatting outside the JSON block.
      
      {
        "name": "Company Name",
        "description": "Short description",
        "industry": "Industry sector",
        "targetAudience": ["Audience 1", "Audience 2"],
        "keySellingPoints": ["Point 1", "Point 2"],
        "brandTone": "e.g. Professional and Empathetic",
        "products": [{"name": "Prod 1", "description": "Desc"}],
        "generatedSystemInstruction": "The full, long-form system prompt text..."
      }
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          // DO NOT use responseSchema or responseMimeType when using googleSearch
        }
      });

      const text = response.text || "";
      const cleanedText = cleanJsonString(text);
      
      try {
        const data = JSON.parse(cleanedText);
        return data as CompanyAnalysis;
      } catch (parseError) {
        console.error("Failed to parse JSON:", cleanedText);
        throw new Error("The AI analysis completed, but the output format was malformed. Please try again.");
      }

    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      throw error;
    }
  }

  createChatSession(systemInstruction: string): Chat {
    return this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      }
    });
  }
}

export const geminiService = new GeminiService();
