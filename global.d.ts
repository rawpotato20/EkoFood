// global.d.ts
export {};

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, any>) => void;
      identify?: (data: Record<string, any>) => void;
    };
  }
}
