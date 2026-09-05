export interface ParsedMedia {
  platform: 'youtube' | 'vimeo' | 'tiktok' | 'instagram' | 'facebook' | 'native' | 'image' | 'generic';
  embedUrl: string;
  isVertical: boolean;
  thumbnailUrl?: string;
}

export const parseSocialMediaUrl = (url: string, type: string): ParsedMedia => {
  if (!url) return { platform: 'generic', embedUrl: '', isVertical: false };

  const lowerUrl = url.toLowerCase();

  // 1. IMAGENS
  if (
    type === 'image' || 
    /\.(jpeg|jpg|gif|png|webp|avif)(?:\?|$)/i.test(lowerUrl) || 
    lowerUrl.includes('fbcdn.net') || 
    lowerUrl.includes('twimg.com')
  ) {
    return { platform: 'image', embedUrl: url, thumbnailUrl: url, isVertical: false };
  }

  // 2. VÍDEOS NATIVOS
  if (/\.(mp4|webm|ogg|mov)(?:\?|$)/i.test(lowerUrl)) {
    return { platform: 'native', embedUrl: url, isVertical: false };
  }

  // 3. YOUTUBE (Gera thumbnail de alta resolução direto no parser)
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (ytMatch) {
    const videoId = ytMatch[1];
    const isShort = lowerUrl.includes('/shorts/');
    return {
      platform: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      isVertical: isShort,
    };
  }
// No bloco 4 (FACEBOOK) do parseSocialMediaUrl:
if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) {
  let cleanUrl = url;
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.delete('mibextid');
    urlObj.searchParams.delete('eav');
    cleanUrl = urlObj.toString();
  } catch {}

  const encodedFbUrl = encodeURIComponent(cleanUrl);
  const isFbReel = lowerUrl.includes('/reel/') || lowerUrl.includes('/reels/');
  
  return {
    platform: 'facebook',
    // autoplay=0 e mute=1 garantem que a CPU não processe decodificação contínua na miniatura
    embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodedFbUrl}&show_text=false&width=auto&autoplay=0&mute=1`,
    isVertical: isFbReel,
  };
}

  // 5. TIKTOK
  const tiktokMatch = url.match(/tiktok\.com\/.*video\/(\d+)/);
  if (tiktokMatch) {
    return {
      platform: 'tiktok',
      embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`,
      isVertical: true,
    };
  }

  // 6. INSTAGRAM
  const instaMatch = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
  if (instaMatch) {
    return {
      platform: 'instagram',
      embedUrl: `https://www.instagram.com/p/${instaMatch[1]}/embed/`,
      isVertical: true,
    };
  }

  // 7. VIMEO
  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
  if (vimeoMatch) {
    return {
      platform: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}`,
      isVertical: false,
    };
  }

  return { platform: 'generic', embedUrl: url, isVertical: false };
};