
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { EXPORT_GUIDE_CONTEXT } from '../constants';

const API_KEY = process.env.API_KEY;

let aiInstance: GoogleGenAI | null = null;
let currentApiKeyUsed: string | null = null;

const getAi = (): GoogleGenAI => {
  let key: string | undefined = undefined;
  if (typeof window !== 'undefined') {
    key = localStorage.getItem('custom_gemini_api_key') || undefined;
  }
  if (!key) {
    key = API_KEY;
  }
  if (!key) {
    throw new Error("API Key is not configured. Please configure your Gemini API Key in the Settings panel.");
  }
  
  if (!aiInstance || currentApiKeyUsed !== key) {
    aiInstance = new GoogleGenAI({ apiKey: key });
    currentApiKeyUsed = key;
  }
  return aiInstance;
};

export const generateAiResponse = async (prompt: string): Promise<string> => {
  try {
    const ai = getAi();
    const fullPrompt = `${EXPORT_GUIDE_CONTEXT}\n\n---\n\nUSER QUERY: ${prompt}\n\nAI RESPONSE:`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
    });

    if (response && response.text) {
      return response.text;
    }
    throw new Error("No response from AI. Please try again.");
  } catch (error) {
    console.error("Error generating AI response:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to call the Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while contacting the AI service.");
  }
};


export const generateCreativeAiResponse = async (prompt: string, model: string = 'gemini-3-flash-preview'): Promise<string> => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    if (response && response.text) {
      return response.text;
    }
    throw new Error("No response from AI. Please try again.");
  } catch (error) {
    console.error("Error generating creative AI response:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to call the Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while contacting the AI service.");
  }
};

export const generateGroundedAiResponse = async (prompt: string, enableThinking: boolean): Promise<GenerateContentResponse> => {
  const ai = getAi();
  // Use flash model for speed unless thinking is explicitly requested
  const model = enableThinking ? 'gemini-3.1-pro-preview' : 'gemini-3-flash-preview';
  const config: any = {
    tools: [{ googleSearch: {} }],
  };

  if (enableThinking) {
    // Thinking level can be adjusted for speed vs depth
    config.thinkingConfig = { thinkingLevel: 'LOW' }; 
  }

  return ai.models.generateContent({
    model: model,
    contents: prompt,
    config: config,
  });
};

export const generateMapResponse = async (prompt: string, location: { latitude: number, longitude: number }): Promise<GenerateContentResponse> => {
    const ai = getAi();
    return ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{googleMaps: {}}],
            toolConfig: {
                retrievalConfig: {
                    latLng: location
                }
            }
        },
    });
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (error) {
        console.error("Error generating speech:", error);
        return undefined;
    }
};