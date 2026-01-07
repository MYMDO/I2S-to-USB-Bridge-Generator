import { GoogleGenAI } from "@google/genai";
import { AppState, McuType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFirmwareCode = async (config: AppState): Promise<string> => {
  const isEsp32 = config.mcu === McuType.ESP32_S3;
  
  const systemPrompt = `
    You are an expert Embedded Systems Engineer specializing in USB Audio Class (UAC) implementation.
    Your task is to write complete, professional, and optimized C++ firmware code.
    
    GOAL: Create a firmware that reads audio from an I2S microphone and sends it to a PC via USB as a standard USB Microphone.
    CRITICAL: The device must appear in Windows as a standard audio input device WITHOUT requiring any custom drivers (Plug & Play).
    
    Target Hardware: ${config.mcu}
    Microphone: ${config.mic}
    
    Pins Configuration:
    - I2S Bit Clock (BCK/SCK): GPIO ${config.pins.bck}
    - I2S Word Select (WS/LRCK): GPIO ${config.pins.ws}
    - I2S Serial Data (SD/DIN): GPIO ${config.pins.sd}
    
    Audio Settings:
    - Sample Rate: ${config.audio.sampleRate} Hz
    - Bit Depth: ${config.audio.bitDepth}-bit
    - Channels: ${config.audio.channelCount}
    
    REQUIREMENTS:
    1. If ESP32-S3: Use the ESP-IDF or Arduino 'USB' library with the 'USB Audio' class features. Prefer the 'EspTinyUSB' or native ESP32-S3 USB capabilities.
    2. If RP2040: Use the 'Adafruit TinyUSB' library and 'I2S' PIO implementation or the 'Pico Audio' library.
    3. The code must be production-ready, handling buffering correctly to avoid audio glitches or drift.
    4. Include comments explaining how to compile (e.g., "Select 'USB Mode: OTG/TinyUSB' in Arduino IDE").
    5. Provide ONLY the code within a C++ code block. No conversational filler before or after the code block.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Updated to valid model for coding tasks
      contents: systemPrompt,
      config: {
        temperature: 0.2, // Low temperature for precise code
      }
    });

    return response.text || "// Error: No code generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate firmware. Please check API key and try again.");
  }
};