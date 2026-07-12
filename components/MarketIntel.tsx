
import React, { useState, useRef, useEffect } from 'react';
import { generateGroundedAiResponse, generateSpeech } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { translations } from '../translations';
import { MicrophoneIcon, MicrophoneOffIcon, TextToSpeechIcon, DownloadIcon, BrainIcon, BackArrowIcon } from './icons';
import { decode } from '../utils/audio';
import { GenerateContentResponse } from '@google/genai';
import { Page } from '../types';

interface MarketIntelProps {
  t: (key: keyof typeof translations.en) => string;
  setActivePage: (page: Page) => void;
}

const MarketIntel: React.FC<MarketIntelProps> = ({ t, setActivePage }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<GenerateContentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const isStoppingAudioRef = useRef(false);

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (notification) {
        const timer = setTimeout(() => {
            setNotification(null);
        }, 5000);
        return () => clearTimeout(timer);
    }
  }, [notification]);

  const presets = [
    "What are current global trade trends for agricultural products?",
    "Which countries have recently increased their import of Indian textiles?",
    "What is the latest news regarding shipping costs from India to Europe?",
    "Provide a market analysis for exporting organic spices to the USA, including recent consumer trends."
  ];

  const handleQuerySubmit = async (currentQuery: string) => {
    if (!currentQuery.trim()) return;
    setIsLoading(true);
    setResponse(null);
    try {
        const aiResponse = await generateGroundedAiResponse(currentQuery, isThinkingMode);
        setResponse(aiResponse);
    } catch(error) {
        console.error("Error fetching grounded response", error);
        // You could set an error state here to show in the UI
    }
    setIsLoading(false);
  };
  
  const handlePresetClick = (presetQuery: string) => {
    setQuery(presetQuery);
    handleQuerySubmit(presetQuery);
  };

  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        
        mediaRecorderRef.current.ondataavailable = event => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
            setNotification("Audio recorded! For this demo, please type your query as transcription is a simulation.");
            stream.getTracks().forEach(track => track.stop()); // Stop the microphone access
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
    } catch (error) {
        console.error("Error accessing microphone:", error);
        setNotification("Could not access the microphone. Please check your browser permissions.");
    }
  };
  
   const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleMicClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const stopAudio = () => {
        isStoppingAudioRef.current = true;
        if (audioSourceRef.current) {
            try {
                audioSourceRef.current.stop();
            } catch (e) {
                // Ignore errors if already stopped
            }
            audioSourceRef.current = null;
        }
        setIsSpeaking(false);
        setIsGeneratingAudio(false);
    };

    const playAudio = async (base64Audio: string): Promise<void> => {
        if (isStoppingAudioRef.current) return;
        
        return new Promise((resolve, reject) => {
            try {
                if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                }
                const audioContext = audioContextRef.current;
                const audioData = decode(base64Audio);
                const rawData = new Int16Array(audioData.buffer);
                const frameCount = rawData.length;
                const audioBuffer = audioContext.createBuffer(1, frameCount, 24000);
                const channelData = audioBuffer.getChannelData(0);

                for (let i = 0; i < frameCount; i++) {
                    channelData[i] = rawData[i] / 32768.0;
                }

                const source = audioContext.createBufferSource();
                audioSourceRef.current = source;
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.onended = () => {
                    audioSourceRef.current = null;
                    resolve();
                };
                source.start();
            } catch (error) {
                console.error("Error playing audio:", error);
                reject(error);
            }
        });
    };
    
    const handleReadAloud = async () => {
      if (isSpeaking || isGeneratingAudio) {
          stopAudio();
          return;
      }

      const textToRead = response?.text;
      if (!textToRead) return;
      
      setIsSpeaking(true);
      isStoppingAudioRef.current = false;

      // Split text into smaller chunks (sentences) for faster initial playback
      const chunks = textToRead.match(/[^.!?]+[.!?]+/g) || [textToRead];
      
      try {
          for (const chunk of chunks) {
              if (isStoppingAudioRef.current) break;
              
              setIsGeneratingAudio(true);
              const audioData = await generateSpeech(chunk.trim());
              setIsGeneratingAudio(false);

              if (audioData && !isStoppingAudioRef.current) {
                  await playAudio(audioData);
              }
          }
      } catch (error) {
          console.error("Audio generation/playback error:", error);
      } finally {
          setIsSpeaking(false);
          setIsGeneratingAudio(false);
      }
    };

    const handleDownload = () => {
      if (!response || !response.text) return;

      let reportContent = `Market Intelligence Report\n`;
      reportContent += `==========================\n\n`;
      reportContent += `Query: ${query}\n`;
      reportContent += `Thinking Mode: ${isThinkingMode ? 'Enabled' : 'Disabled'}\n\n`;
      reportContent += `--- AI Analysis ---\n`;
      reportContent += `${response.text}\n\n`;

      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (sources && sources.length > 0) {
        reportContent += `--- Sources ---\n`;
        sources.forEach((chunk, index) => {
          reportContent += `${index + 1}. ${chunk.web.title}\n   ${chunk.web.uri}\n\n`;
        });
      }

      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = `Market_Report_${query.substring(0, 25).replace(/\s/g, '_')}.txt`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

  return (
    <div>
      <header className="mb-6">
        <button onClick={() => setActivePage('dashboard')} className="flex items-center gap-2 text-sm text-text-secondary hover:text-brand mb-4 transition-colors">
          <BackArrowIcon />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-3xl font-bold text-text-primary">{t('marketIntelEngine')}</h1>
        <p className="text-md text-text-secondary">{t('marketIntelSubheading')}</p>
      </header>

      <div className="bg-primary p-4 rounded-lg shadow-lg mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
            <h3 className="w-full text-sm font-semibold text-text-secondary mb-1">{t('tryPrompts')}</h3>
            {presets.map((p, i) => (
                <button 
                    key={i}
                    onClick={() => handlePresetClick(p)}
                    className="bg-accent text-text-primary px-3 py-1 rounded-full text-sm hover:bg-brand hover:text-primary transition"
                >
                    {p}
                </button>
            ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleQuerySubmit(query); }}>
          {notification && (
              <div className="bg-highlight text-text-primary text-sm p-3 rounded-md mb-3 text-center transition-opacity duration-300 border border-brand/20">
                  {notification}
              </div>
          )}
          <div className="relative mb-6">
             <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('marketIntelPlaceholder')}
                className="w-full bg-secondary border-2 border-accent/50 rounded-2xl shadow-inner p-5 pr-16 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all resize-none placeholder:text-text-secondary/50"
                rows={3}
             />
             <div className="absolute top-4 right-4">
                <button 
                    type="button" 
                    onClick={handleMicClick} 
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 border-2 ${
                        isRecording 
                        ? 'bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                        : 'bg-accent/30 text-text-secondary border-accent/50 hover:bg-brand/10 hover:text-brand hover:border-brand/50'
                    }`}
                    title={isRecording ? "Stop Recording" : "Start Voice Search"}
                >
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        {isRecording ? 'Listening...' : 'Voice Search'}
                    </span>
                    <div className={isRecording ? 'animate-pulse' : ''}>
                        {isRecording ? <MicrophoneOffIcon className="w-3.5 h-3.5" /> : <MicrophoneIcon className="w-3.5 h-3.5" />}
                    </div>
                </button>
             </div>
          </div>
           <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="relative group">
                <label htmlFor="thinking-mode" className="flex items-center cursor-pointer select-none">
                    <div className="relative">
                        <input type="checkbox" id="thinking-mode" className="sr-only" checked={isThinkingMode} onChange={() => setIsThinkingMode(!isThinkingMode)} />
                        {/* Glassmorphic Track */}
                        <div className={`w-14 h-7 rounded-full border transition-all duration-500 ${
                            isThinkingMode 
                            ? 'bg-brand/10 border-brand/50 shadow-[0_0_15px_rgba(var(--brand-rgb),0.2)]' 
                            : 'bg-accent/30 border-accent/50'
                        }`}></div>
                        {/* Glow Thumb */}
                        <div className={`absolute top-1 transition-all duration-500 ease-out w-5 h-5 rounded-full flex items-center justify-center ${
                            isThinkingMode 
                            ? 'left-8 bg-brand shadow-[0_0_10px_rgba(var(--brand-rgb),0.5)]' 
                            : 'left-1 bg-text-secondary'
                        }`}>
                            <BrainIcon className={`w-3 h-3 ${isThinkingMode ? 'text-primary' : 'text-accent'}`} />
                        </div>
                    </div>
                    <div className="ml-3 flex flex-col">
                        <span className={`text-[10px] font-black uppercase tracking-[0.15em] transition-colors duration-300 ${isThinkingMode ? 'text-brand' : 'text-text-secondary'}`}>
                            {t('thinkingMode')}
                        </span>
                        <span className="text-[8px] text-text-secondary/50 font-bold uppercase tracking-widest">
                            {isThinkingMode ? 'Neural' : 'Standard'}
                        </span>
                    </div>
                </label>
                 <div className="absolute bottom-full left-0 mb-3 w-max bg-highlight text-primary text-[10px] font-bold uppercase tracking-widest rounded-lg py-2 px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl border border-brand/30 translate-y-2 group-hover:translate-y-0">
                    {t('thinkingModeTooltip')}
                </div>
            </div>
            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full sm:w-auto flex-grow relative overflow-hidden group bg-brand text-primary font-black py-4 px-8 rounded-2xl transition-all active:scale-95 disabled:bg-gray-600 disabled:text-gray-400 shadow-xl shadow-brand/20 uppercase tracking-[0.2em] text-sm"
            >
                <div className="relative z-10 flex items-center justify-center gap-3">
                    {isLoading ? (
                        <>
                            <LoadingSpinner />
                            <span className="animate-pulse">{isThinkingMode ? 'Synthesizing Intelligence...' : 'Processing...'}</span>
                        </>
                    ) : (
                        <>
                            <span>{t('askAI')}</span>
                            <div className="w-1.5 h-1.5 bg-primary rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                        </>
                    )}
                </div>
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
           </div>
        </form>
      </div>

      { (isLoading || response) && (
        <div className="bg-primary p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-text-primary">{t('aiAnalysis')}</h2>
            {response && !isLoading && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReadAloud}
                  className={`flex items-center gap-2 text-sm font-bold py-2 px-4 rounded-xl transition-all duration-300 ${isSpeaking || isGeneratingAudio ? 'bg-red-500 text-white animate-pulse' : 'bg-highlight text-text-primary hover:bg-brand hover:text-primary'}`}
                >
                  {isGeneratingAudio ? <LoadingSpinner/> : isSpeaking ? <div className="flex gap-1 items-center"><div className="w-1 h-3 bg-white animate-bounce"></div><div className="w-1 h-3 bg-white animate-bounce delay-75"></div><div className="w-1 h-3 bg-white animate-bounce delay-150"></div></div> : <TextToSpeechIcon />}
                  {isSpeaking || isGeneratingAudio ? 'Stop Reading' : t('readAloud')}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-highlight text-text-primary text-sm font-bold py-2 px-4 rounded-xl hover:bg-brand hover:text-primary transition-all"
                >
                  <DownloadIcon />
                  {t('downloadReport')}
                </button>
              </div>
            )}
          </div>
          {isLoading && <LoadingSpinner />}
          {response?.text && <div className="prose prose-invert max-w-none text-text-secondary whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: response.text.replace(/\n/g, '<br />') }} />}
          
          {response?.candidates?.[0]?.groundingMetadata?.groundingChunks && response.candidates[0].groundingMetadata.groundingChunks.length > 0 && (
              <div className="mt-6 border-t border-accent pt-4">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Sources</h3>
                  <div className="flex flex-col gap-2">
                      {response.candidates[0].groundingMetadata.groundingChunks.map((chunk, index) => (
                          <a 
                            href={chunk.web.uri} 
                            key={index}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-brand hover:underline bg-secondary p-2 rounded-md truncate"
                            title={chunk.web.title}
                          >
                              {index + 1}. {chunk.web.title}
                          </a>
                      ))}
                  </div>
              </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketIntel;
