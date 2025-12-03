import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from '../types';

export const analyzeHallucination = async (
  context: string,
  response: string
): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Act as a Hallucination Detection System.
    Your goal is to evaluate if the 'Response' is factually supported by the 'Context'.
    
    Context: "${context}"
    Response: "${response}"
    
    Perform two checks:
    1. Similarity: How semantically close are the key facts? (0.0 to 1.0)
    2. Contradiction: Does the response directly contradict the context?
    
    IMPORTANT: Provide the 'reasoning' in Chinese (Simplified).
    
    Return a structured analysis.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      similarityScore: { type: Type.NUMBER, description: "A float between 0 and 1 indicating semantic similarity of facts." },
      contradictionFound: { type: Type.BOOLEAN, description: "True if a direct contradiction is found." },
      reasoning: { type: Type.STRING, description: "A brief explanation of why this verdict was reached, written in Chinese." },
      verdict: { type: Type.STRING, enum: ["FACTUAL", "HALLUCINATION", "UNCERTAIN"] }
    },
    required: ["similarityScore", "contradictionFound", "reasoning", "verdict"]
  };

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.1, // Low temperature for consistent logic checks
      }
    });

    const jsonText = result.text;
    if (!jsonText) throw new Error("No response text from Gemini");

    return JSON.parse(jsonText) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Failed", error);
    throw error;
  }
};