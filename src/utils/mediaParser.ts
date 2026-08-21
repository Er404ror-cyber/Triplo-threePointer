export interface ParsedMedia {
  platform: 'youtube' | 'vimeo' | 'tiktok' | 'instagram' | 'facebook' | 'native' | 'image' | 'generic';
  embedUrl: string;
  isVertical: boolean;
}

export const parseSocialMediaUrl = (url: string, type: string): ParsedMedia => {
  if (!url) return { platform: 'generic', embedUrl: '', isVertical: false };
  
  const lowerUrl = url.toLowerCase();

  // 1. IMAGENS (Fotos Locais ou CDNs)
  if (
    type === 'image' || 
    /\.(jpeg|jpg|gif|png|webp)(?:\?|$)/i.test(lowerUrl) || 
    lowerUrl.includes('fbcdn.net') || 
    lowerUrl.includes('twimg.com')
  ) {
    return { platform: 'image', embedUrl: url, isVertical: false };
  }

  // 2. VÍDEOS NATIVOS (Vídeos Locais .mp4, etc)
  if (/\.(mp4|webm|ogg|mov)(?:\?|$)/i.test(lowerUrl)) {
    return { platform: 'native', embedUrl: url, isVertical: false };
  }

  // 3. FACEBOOK (Com blindagem contra links mobile e trackers)
  if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) {
    let cleanUrl = url;
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.delete('mibextid');
      urlObj.searchParams.delete('eav');
      cleanUrl = urlObj.toString();
    } catch (e) {} // Ignora se falhar ao analisar URL

    const encodedFbUrl = encodeURIComponent(cleanUrl);
    const isFbReel = lowerUrl.includes('/reel/') || lowerUrl.includes('/reels/');
    
    return {
      platform: 'facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodedFbUrl}&show_text=false&width=auto&t=0`,
      isVertical: isFbReel 
    };
  }

  // 4. YOUTUBE
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (ytMatch) {
    const isShort = lowerUrl.includes('/shorts/');
    return {
      platform: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`,
      isVertical: isShort
    };
  }

  // 5. TIKTOK
  const tiktokMatch = url.match(/tiktok\.com\/.*video\/(\d+)/);
  if (tiktokMatch) {
    return {
      platform: 'tiktok',
      embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`,
      isVertical: true
    };
  }

  // 6. INSTAGRAM
  const instaMatch = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
  if (instaMatch) {
    return {
      platform: 'instagram',
      embedUrl: `https://www.instagram.com/p/${instaMatch[1]}/embed/`,
      isVertical: true
    };
  }

  // 7. VIMEO
  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
  if (vimeoMatch) {
    return {
      platform: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}`,
      isVertical: false
    };
  }

  return { platform: 'generic', embedUrl: url, isVertical: false };
};