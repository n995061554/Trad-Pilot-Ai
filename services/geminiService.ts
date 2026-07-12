
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { EXPORT_GUIDE_CONTEXT } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateAiResponse = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is not configured. Please set the API_KEY environment variable.");
  }
  try {
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
  if (!API_KEY) {
    throw new Error("API Key is not configured. Please set the API_KEY environment variable.");
  }
  try {
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
  if (!API_KEY) {
    throw new Error("API Key is not configured.");
  }

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
    if (!API_KEY) {
        throw new Error("API Key is not configured.");
    }
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
    if (!API_KEY) {
        throw new Error("API Key is not configured.");
    }
    try {
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