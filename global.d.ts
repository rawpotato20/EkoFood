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

declare module "react-image-gallery" {
  import * as React from "react";

  interface ReactImageGalleryItem {
    original: string;
    thumbnail?: string;
    originalTitle?: string;
    thumbnailTitle?: string;
    description?: string;
  }

  interface ReactImageGalleryProps {
    items: ReactImageGalleryItem[];
    showThumbnails?: boolean;
    showFullscreenButton?: boolean;
    showPlayButton?: boolean;
    onSlide?: (currentIndex: number) => void;
    [key: string]: any;
  }

  export default class ImageGallery extends React.Component<ReactImageGalleryProps> {}
}
