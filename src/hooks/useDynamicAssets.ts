import { useState, useEffect } from 'react';
import { publicApi } from '../lib/api';

export function useDynamicAssets() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [fontUrl, setFontUrl] = useState<string>('');
  const [backgroundUrl, setBackgroundUrl] = useState<string>('');

  useEffect(() => {
    // Load font
    const loadFont = async () => {
      try {
        const fontBlob = await publicApi.getFontFile();
        const fontUrl = URL.createObjectURL(fontBlob);

        // Create font face
        const fontFace = new FontFace('DynamicFont', `url(${fontUrl})`);
        await fontFace.load();
        document.fonts.add(fontFace);

        setFontUrl(fontUrl);
        setFontLoaded(true);
      } catch (error) {
        console.error('Failed to load font:', error);
        // Fallback to system font
        setFontLoaded(true);
      }
    };

    // Load background
    const loadBackground = async () => {
      try {
        const backgroundBlob = await publicApi.getBackgroundFile();
        const backgroundUrl = URL.createObjectURL(backgroundBlob);
        setBackgroundUrl(backgroundUrl);
        setBackgroundLoaded(true);
      } catch (error) {
        console.error('Failed to load background:', error);
        // Fallback to default background
        setBackgroundUrl('/assets/images/backgrounds/bg8.png');
        setBackgroundLoaded(true);
      }
    };

    loadFont();
    loadBackground();

    // Cleanup URLs on unmount
    return () => {
      if (fontUrl) URL.revokeObjectURL(fontUrl);
      if (backgroundUrl && backgroundUrl.startsWith('blob:')) URL.revokeObjectURL(backgroundUrl);
    };
  }, []);

  return {
    fontLoaded,
    backgroundLoaded,
    fontUrl,
    backgroundUrl,
  };
}