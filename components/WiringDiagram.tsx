import React from 'react';
import { PinConfig, McuType } from '../types';

interface Props {
  pins: PinConfig;
  mcu: McuType;
}

export const WiringDiagram: React.FC<Props> = ({ pins, mcu }) => {
  return (
    <div className="w-full p-6 bg-slate-900 rounded-xl border border-slate-700 shadow-inner">
      <h3 className="text-lg font-semibold text-primary-400 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        Схема підключення (Wiring Diagram)
      </h3>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 my-8">
        {/* Microphone */}
        <div className="relative group">
          <div className="w-32 h-40 bg-green-700 rounded-md border-2 border-green-500 flex flex-col items-center justify-between p-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <span className="text-xs font-bold text-white opacity-80">I2S Microphone</span>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border border-slate-500 grid grid-cols-3 gap-[1px] overflow-hidden opacity-50">
                 {/* Mic Mesh simulation */}
                 {[...Array(9)].map((_, i) => <div key={i} className="bg-slate-400 w-full h-full"></div>)}
              </div>
            </div>
            <div className="w-full flex flex-col gap-2 mb-1">
              <div className="flex justify-between w-full px-1">
                <span className="text-[10px] text-white">SCK</span>
                <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]"></div>
              </div>
              <div className="flex justify-between w-full px-1">
                <span className="text-[10px] text-white">WS</span>
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
              </div>
              <div className="flex justify-between w-full px-1">
                <span className="text-[10px] text-white">SD</span>
                <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-white">INMP441</span>
          </div>
        </div>

        {/* Wires SVG */}
        <div className="hidden md:block w-32 h-40 relative">
           <svg className="w-full h-full absolute top-0 left-0" style={{ overflow: 'visible' }}>
             {/* SCK Wire */}
             <path d="M -10 90 C 20 90, 80 40, 140 40" stroke="#FACC15" strokeWidth="3" fill="none" strokeDasharray="4 2" className="animate-pulse" />
             <text x="60" y="60" fill="#FACC15" fontSize="10" fontFamily="monospace">SCK (GPIO {pins.bck})</text>
             
             {/* WS Wire */}
             <path d="M -10 108 C 20 108, 80 70, 140 70" stroke="#FFFFFF" strokeWidth="3" fill="none" />
             <text x="60" y="85" fill="#FFFFFF" fontSize="10" fontFamily="monospace">WS (GPIO {pins.ws})</text>
             
             {/* SD Wire */}
             <path d="M -10 126 C 20 126, 80 100, 140 100" stroke="#60A5FA" strokeWidth="3" fill="none" />
             <text x="60" y="115" fill="#60A5FA" fontSize="10" fontFamily="monospace">SD (GPIO {pins.sd})</text>

             {/* Power Wires implied */}
             <path d="M -10 30 C 20 30, 80 10, 140 10" stroke="#EF4444" strokeWidth="1" fill="none" opacity="0.5" />
             <path d="M -10 145 C 20 145, 80 130, 140 130" stroke="#000000" strokeWidth="1" fill="none" opacity="0.5" />
           </svg>
        </div>

        {/* MCU */}
        <div className="w-40 h-56 bg-slate-800 rounded-md border-2 border-slate-600 flex flex-col items-center p-3 relative shadow-xl">
           <div className="absolute top-[-8px] w-12 h-4 bg-slate-400 rounded-sm border border-slate-500"></div> {/* USB Port */}
           <span className="mt-4 text-xs font-bold text-primary-400">{mcu === McuType.ESP32_S3 ? 'ESP32-S3' : 'RP2040'}</span>
           
           <div className="flex-1 w-full flex flex-col justify-center gap-3 mt-4">
             <div className="flex items-center gap-2 w-full justify-start">
                <div className="w-2 h-2 rounded-full bg-red-500 ml-1"></div>
                <span className="text-[9px] text-slate-400">3.3V / VCC</span>
             </div>
             <div className="flex items-center gap-2 w-full justify-start">
                <div className="w-2 h-2 rounded-full bg-yellow-400 ml-1"></div>
                <span className="text-[9px] text-yellow-200">GPIO {pins.bck}</span>
             </div>
             <div className="flex items-center gap-2 w-full justify-start">
                <div className="w-2 h-2 rounded-full bg-white ml-1"></div>
                <span className="text-[9px] text-slate-200">GPIO {pins.ws}</span>
             </div>
             <div className="flex items-center gap-2 w-full justify-start">
                <div className="w-2 h-2 rounded-full bg-blue-400 ml-1"></div>
                <span className="text-[9px] text-blue-200">GPIO {pins.sd}</span>
             </div>
             <div className="flex items-center gap-2 w-full justify-start">
                <div className="w-2 h-2 rounded-full bg-black border border-slate-600 ml-1"></div>
                <span className="text-[9px] text-slate-400">GND</span>
             </div>
           </div>
           
           <div className="absolute bottom-2 w-full text-center">
             <span className="text-[10px] text-slate-500">USB Audio Class Device</span>
           </div>
        </div>
      </div>
      
      <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded mt-2 border border-slate-800">
        <strong className="text-primary-400">Примітка:</strong> {mcu === McuType.ESP32_S3 
          ? 'Для ESP32-S3 використовуйте "USB OTG" порт (якщо на платі два порти) для прямого підключення до ПК.' 
          : 'Raspberry Pi Pico має нативний USB. Підключайте стандартним кабелем.'}
      </div>
    </div>
  );
};