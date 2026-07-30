import { useState, useEffect, useRef } from 'react';

export function useGalleryCarousel(row1Length: number, row2Length: number) {
  const [mobileIndex1, setMobileIndex1] = useState(0);
  const [mobileIndex2, setMobileIndex2] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef2.current) {
      scrollRef2.current.scrollLeft = scrollRef2.current.scrollWidth;
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMobileIndex1((prev) => (prev + 1) % row1Length);
      setMobileIndex2((prev) => (prev + 1) % row2Length);

      if (scrollRef1.current) {
        const { scrollLeft, clientWidth, scrollWidth } = scrollRef1.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef1.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef1.current.scrollBy({ left: 240, behavior: 'smooth' });
        }
      }

      if (scrollRef2.current) {
        const { scrollLeft, scrollWidth } = scrollRef2.current;
        if (scrollLeft <= 10) {
          scrollRef2.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          scrollRef2.current.scrollBy({ left: -240, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [row1Length, row2Length]);

  return {
    mobileIndex1,
    setMobileIndex1,
    mobileIndex2,
    setMobileIndex2,
    selectedImage,
    setSelectedImage,
    scrollRef1,
    scrollRef2,
  };
}