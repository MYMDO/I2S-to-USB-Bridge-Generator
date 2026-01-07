import React, { useState } from 'react';
import { McuType, MicrophoneType, PinConfig, AudioConfig, AppState } from './types';
import { WiringDiagram } from './components/WiringDiagram';
import { generateFirmwareCode } from './services/geminiService';

const DEFAULT_PINS: Record<string, PinConfig> = {
  [McuType.ESP32_S3]: { bck: 4, ws: 5, sd: 6 },
  [McuType.RP2040]: { bck: 10, ws: 11, sd: 12 },
};

export default function App() {
  const [state, setState] = useState<AppState>({
    mcu: McuType.ESP32_S3,
    mic: MicrophoneType.INMP441,
    pins: DEFAULT_PINS[McuType.ESP32_S3],
    audio: {
      sampleRate: 48000,
      bitDepth: 32,
      channelCount: 2,
      bufferSize: 1024,
    },
    isGenerating: false,
    generatedCode: null,
    error: null,
  });

  const handleMcuChange = (mcu: McuType) => {
    setState(prev => ({ ...prev, mcu, pins: DEFAULT_PINS[mcu] }));
  };

  const handlePinChange = (key: keyof PinConfig, value: string) => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      setState(prev => ({ ...prev, pins: { ...prev.pins, [key]: num } }));
    }
  };

  const handleGenerate = async () => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const code = await generateFirmwareCode(state);
      setState(prev => ({ ...prev, generatedCode: code, isGenerating: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, isGenerating: false }));
    }
  };

  const copyToClipboard = () => {
    if (state.generatedCode) {
      navigator.clipboard.writeText(state.generatedCode);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-primary-500/30">
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">I2S to USB Audio Bridge</h1>
              <p className="text-xs text-slate-400">Driverless Microphone Solution Generator</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-500">
             <span>Powered by Gemini 2.5</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Configuration */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Introduction Card */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-lg font-semibold text-white mb-2">Проблема та Рішення</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              I2S мікрофони неможливо підключити напряму до Windows без драйверів.
              Оптимальне рішення: використання мікроконтролера як <strong>USB Audio Class</strong> мосту.
              Цей інструмент генерує готовий код (Firmware), який робить мікрофон Plug & Play.
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-primary-500/10 text-primary-400 text-xs rounded border border-primary-500/20">Windows 10/11 Compatible</span>
              <span className="px-2 py-1 bg-accent-500/10 text-accent-400 text-xs rounded border border-accent-500/20">No Drivers Needed</span>
            </div>
          </div>

          {/* Settings Form */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
            <h3 className="text-md font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs border border-slate-700">1</span>
              Конфігурація (Hardware Setup)
            </h3>

            <div className="space-y-5">
              
              {/* MCU Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Мікроконтролер</label>
                <div className="grid grid-cols-1 gap-2">
                  {(Object.values(McuType) as McuType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleMcuChange(type)}
                      className={`text-left px-4 py-3 rounded-lg border transition-all duration-200 flex items-center justify-between ${
                        state.mcu === type
                          ? 'bg-primary-600/10 border-primary-500 text-primary-100 ring-1 ring-primary-500/50'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span>{type}</span>
                      {state.mcu === type && <div className="w-2 h-2 rounded-full bg-primary-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pins Config */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Pin Configuration (GPIO)</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-yellow-400 block mb-1 font-mono">SCK/BCK</span>
                    <input 
                      type="number" 
                      value={state.pins.bck}
                      onChange={(e) => handlePinChange('bck', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-center font-mono text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-white block mb-1 font-mono">WS/LRCK</span>
                    <input 
                      type="number" 
                      value={state.pins.ws}
                      onChange={(e) => handlePinChange('ws', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-center font-mono text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-400 block mb-1 font-mono">SD/DIN</span>
                    <input 
                      type="number" 
                      value={state.pins.sd}
                      onChange={(e) => handlePinChange('sd', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-center font-mono text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

               {/* Audio Config */}
               <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Sample Rate</label>
                <select 
                  value={state.audio.sampleRate}
                  onChange={(e) => setState(p => ({...p, audio: {...p.audio, sampleRate: parseInt(e.target.value)}}))}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-300 focus:border-primary-500 outline-none"
                >
                  <option value="16000">16000 Hz (Voice)</option>
                  <option value="44100">44100 Hz (CD)</option>
                  <option value="48000">48000 Hz (DVD/Standard)</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={state.isGenerating}
                className={`w-full py-4 rounded-lg font-bold text-sm uppercase tracking-wider transition-all shadow-lg ${
                  state.isGenerating 
                    ? 'bg-slate-700 text-slate-400 cursor-wait' 
                    : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white shadow-primary-500/25'
                }`}
              >
                {state.isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Generating Code...
                  </span>
                ) : (
                  'Створити прошивку (Generate)'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Visualization & Output */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Wiring Diagram */}
          <WiringDiagram pins={state.pins} mcu={state.mcu} />

          {/* Error Message */}
          {state.error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg text-sm">
              <strong>Error:</strong> {state.error}
            </div>
          )}

          {/* Code Output */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[600px]">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <span className="text-sm font-mono text-slate-400">firmware.cpp</span>
              {state.generatedCode && (
                <button 
                  onClick={copyToClipboard}
                  className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  Copy Code
                </button>
              )}
            </div>
            
            <div className="flex-1 relative bg-slate-950 overflow-hidden">
              {state.generatedCode ? (
                <pre className="absolute inset-0 p-4 overflow-auto text-xs md:text-sm font-mono text-slate-300 leading-relaxed">
                  <code>{state.generatedCode}</code>
                </pre>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                  <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <p className="text-sm">Натисніть "Generate" щоб отримати код</p>
                  <p className="text-xs opacity-50 mt-2">Code will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}