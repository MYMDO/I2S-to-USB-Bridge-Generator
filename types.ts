export enum McuType {
  ESP32_S3 = 'ESP32-S3 (Native USB)',
  RP2040 = 'Raspberry Pi Pico (RP2040)',
}

export enum MicrophoneType {
  INMP441 = 'INMP441 (Omnidirectional)',
  MSM261S4030 = 'MSM261S4030 (High Sensitivity)',
  Generic_I2S = 'Generic I2S Philips Standard',
}

export interface PinConfig {
  bck: number; // Bit Clock
  ws: number;  // Word Select (L/R Clock)
  sd: number;  // Serial Data
}

export interface AudioConfig {
  sampleRate: number;
  bitDepth: 16 | 24 | 32;
  channelCount: 1 | 2;
  bufferSize: number;
}

export interface AppState {
  mcu: McuType;
  mic: MicrophoneType;
  pins: PinConfig;
  audio: AudioConfig;
  isGenerating: boolean;
  generatedCode: string | null;
  error: string | null;
}