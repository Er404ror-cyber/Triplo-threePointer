// utils/timeFormat.ts

// Tornamos o 't' opcional (adicionando um ?) e garantimos que é uma função antes de a chamar
export function getRelativeTime(dateString: string, t?: (key: string) => string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Se o 't' não for passado ou não for uma função, usamos o comportamento antigo em português (fallback)
  if (!t || typeof t !== 'function') {
    if (diffInSeconds < 60) return 'há segundos';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `há ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `há ${diffInHours} h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `há ${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'}`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `há ${diffInMonths} ${diffInMonths === 1 ? 'mês' : 'meses'}`;
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `há ${diffInYears} ${diffInYears === 1 ? 'ano' : 'anos'}`;
  }

  // Comportamento novo com traduções (quando o 't' é passado corretamente)
  if (diffInSeconds < 60) return t('timeSeconds' as any);
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return t('timeMin' as any).replace('{n}', diffInMinutes.toString());
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return t('timeHour' as any).replace('{n}', diffInHours.toString());
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    const key = diffInDays === 1 ? 'timeDay' : 'timeDays';
    return t(key as any).replace('{n}', diffInDays.toString());
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    const key = diffInMonths === 1 ? 'timeMonth' : 'timeMonths';
    return t(key as any).replace('{n}', diffInMonths.toString());
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  const key = diffInYears === 1 ? 'timeYear' : 'timeYears';
  return t(key as any).replace('{n}', diffInYears.toString());
}