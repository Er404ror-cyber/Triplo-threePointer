export type Platform = 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'native' | 'image';

export interface ParsedMedia {
  platform: Platform;
  id: string | null;
  embedUrl: string;
  thumbnailUrl: string | null;
}

export function parseMediaUrl(url: string, mediaType: 'video' | 'image' = 'video'): ParsedMedia {
  if (!url) return { platform: 'native', id: null, embedUrl: '', thumbnailUrl: '' };
  
  if (mediaType === 'image') {
    return { platform: 'image', id: null, embedUrl: url, thumbnailUrl: url };
  }

  // YOUTUBE
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch) {
    return {
      platform: 'youtube',
      id: ytMatch[1],
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`
    };
  }

  // TIKTOK
  const tkMatch = url.match(/tiktok\.com\/.*video\/(\d+)/);
  if (tkMatch) {
    return {
      platform: 'tiktok',
      id: tkMatch[1],
      embedUrl: `https://www.tiktok.com/embed/v2/${tkMatch[1]}`,
      thumbnailUrl: null
    };
  }

  // INSTAGRAM
  const igMatch = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
  if (igMatch) {
    return {
      platform: 'instagram',
      id: igMatch[1],
      embedUrl: `https://www.instagram.com/p/${igMatch[1]}/embed`,
      thumbnailUrl: null
    };
  }

  // FACEBOOK
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return {
      platform: 'facebook',
      id: null,
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`,
      thumbnailUrl: null
    };
  }

  // NATIVO (Local, Cloudinary, AWS)
  return {
    platform: 'native',
    id: null,
    embedUrl: url,
    thumbnailUrl: `${url}#t=0.1` // O truque #t=0.1 carrega só o primeiro frame (poupa CPU/Bateria)
  };
}