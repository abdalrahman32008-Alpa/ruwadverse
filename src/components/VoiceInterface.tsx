import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, Square, Loader2, Sparkles, Volume2 } from 'lucide-react';
import * as Sentry from "@sentry/react";

export const VoiceInterface = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API key missing");
      
      const genAI = new GoogleGenAI({ apiKey });
      const ai = Sentry.instrumentGoogleGenAIClient(genAI, {
        recordInputs: true,
        recordOutputs: true,
      });
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1 } });
      mediaStreamRef.current = stream;
      
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      // Use ScriptProcessorNode for simplicity in this example (AudioWorklet is better for prod)
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "أنت RAED، مدرب صوتي لرواد الأعمال. ساعدني في التدريب على عرض فكرتي (Pitch). كن مشجعاً وقدم ملاحظات بناءة. تحدث باللغة العربية.",
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            
            // Start sending audio
            processorRef.current!.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              // Convert Float32Array to Int16Array
              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
              }
              // Convert to base64
              const buffer = new ArrayBuffer(pcmData.length * 2);
              const view = new DataView(buffer);
              for (let i = 0; i < pcmData.length; i++) {
                view.setInt16(i * 2, pcmData[i], true);
              }
              const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: { data: base64, mimeType: 'audio/pcm;rate=16000' }
                });
              });
            };
            
            source.connect(processorRef.current!);
            processorRef.current!.connect(audioContextRef.current!.destination);
          },
          onmessage: (message: LiveServerMessage) => {
            // Handle audio output
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              setIsSpeaking(true);
              const binaryString = atob(base64Audio);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              
              // Decode PCM16 to Float32
              const pcm16 = new Int16Array(bytes.buffer);
              const float32 = new Float32Array(pcm16.length);
              for (let i = 0; i < pcm16.length; i++) {
                float32[i] = pcm16[i] / 0x7FFF;
              }
              
              const audioBuffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
              audioBuffer.getChannelData(0).set(float32);
              
              const source = audioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioContextRef.current.destination);
              
              const currentTime = audioContextRef.current.currentTime;
              const playTime = Math.max(currentTime, nextPlayTimeRef.current);
              source.start(playTime);
              nextPlayTimeRef.current = playTime + audioBuffer.duration;
              
              source.onended = () => {
                if (audioContextRef.current && audioContextRef.current.currentTime >= nextPlayTimeRef.current - 0.1) {
                  setIsSpeaking(false);
                }
              };
            }
            
            // Handle interruption
            if (message.serverContent?.interrupted) {
              nextPlayTimeRef.current = audioContextRef.current?.currentTime || 0;
              setIsSpeaking(false);
            }
            
            // Handle transcriptions
            if (message.serverContent?.modelTurn?.parts[0]?.text) {
              setTranscript(prev => [...prev, { role: 'model', text: message.serverContent!.modelTurn!.parts[0].text! }]);
            }
          },
          onerror: (err) => {
            console.error(err);
            setError("حدث خطأ في الاتصال");
            disconnect();
          },
          onclose: () => {
            disconnect();
          }
        }
      });
      
      sessionRef.current = await sessionPromise;
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "فشل الاتصال بالميكروفون");
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
  };

  useEffect(() => {
    return () => disconnect();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className={`w-96 h-96 rounded-full bg-[#FFD700] blur-[100px] transition-all duration-1000 ${isSpeaking ? 'scale-150 opacity-20' : 'scale-100'}`} />
      </div>

      <div className="relative z-10 text-center max-w-md w-full">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Sparkles className="text-[#FFD700]" />
            المدرب الصوتي
          </h2>
          <p className="text-gray-400">
            تدرب على عرض فكرتك (Pitch) في محادثة صوتية حية مع RAED AI. سيقوم بتقييم أدائك وإعطائك نصائح فورية.
          </p>
        </div>

        <div className="relative w-48 h-48 mx-auto mb-12">
          {/* Pulsing rings when connected */}
          {isConnected && (
            <>
              <div className={`absolute inset-0 border-2 border-[#FFD700]/30 rounded-full animate-ping ${isSpeaking ? 'duration-700' : 'duration-1000'}`} />
              <div className={`absolute inset-[-20px] border border-[#FFD700]/10 rounded-full animate-ping delay-150 ${isSpeaking ? 'duration-700' : 'duration-1000'}`} />
            </>
          )}
          
          <button
            onClick={isConnected ? disconnect : connect}
            disabled={isConnecting}
            className={`w-full h-full rounded-full flex flex-col items-center justify-center gap-3 transition-all duration-500 shadow-2xl ${
              isConnected 
                ? 'bg-red-500/10 border-2 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white shadow-red-500/20' 
                : 'bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-black hover:scale-105 shadow-[#FFD700]/20'
            }`}
          >
            {isConnecting ? (
              <Loader2 size={48} className="animate-spin" />
            ) : isConnected ? (
              <>
                <Square size={40} className="fill-current" />
                <span className="font-bold">إنهاء المحادثة</span>
              </>
            ) : (
              <>
                <Mic size={48} />
                <span className="font-bold text-lg">ابدأ التحدث</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="bg-[#0B0C0E] border border-white/5 rounded-2xl p-4 h-32 overflow-y-auto">
          {transcript.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              {isConnected ? "تحدث الآن..." : "سيظهر النص هنا أثناء المحادثة"}
            </div>
          ) : (
            <div className="space-y-2 text-sm text-right">
              {transcript.map((t, i) => (
                <div key={i} className={`${t.role === 'model' ? 'text-[#FFD700]' : 'text-gray-300'}`}>
                  <span className="font-bold text-xs opacity-50 ml-2">
                    {t.role === 'model' ? 'RAED:' : 'أنت:'}
                  </span>
                  {t.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
