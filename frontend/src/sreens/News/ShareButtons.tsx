import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { TelegramIcon, TelegramShareButton, VKIcon, VKShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import { FiCopy, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaDiscord, FaInstagram } from 'react-icons/fa6';

interface Props {
  url: string;
  onShared: () => void;
  anchor: { x: number; y: number };
}

export default function ShareButtons({ url, onShared, anchor }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<{left: number; top: number}>({left: 0, top: 0});
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    if (!pillRef.current) return;
    const width = pillRef.current.offsetWidth;
    const height = pillRef.current.offsetHeight;
    const left = Math.max(anchor.x - width / 2, 0);
    const top = anchor.y - height - 10;
    setStyle({left, top});
  }, [anchor]);

  useEffect(() => {
    requestAnimationFrame(() => setOpen(true));
  }, []);

  const scroll = (dir: number) => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    containerRef.current.scrollBy({ left: dir * width, behavior: 'smooth' });
  };

  const copy = () => {
    navigator.clipboard.writeText(url).then(onShared);
  };

  return (
    <div
      className={`share-pill${open ? ' open' : ''}`}
      ref={pillRef}
      style={{ left: style.left, top: style.top }}
    >
      <button className="arrow left" onClick={() => scroll(-1)}><FiChevronLeft/></button>
      <div className="icons" ref={containerRef}>
        <button onClick={copy} className="icon copy"><FiCopy/></button>
        <TelegramShareButton url={url} className="icon" onClick={onShared}><TelegramIcon size={32} round/></TelegramShareButton>
        <VKShareButton url={url} className="icon" onClick={onShared}><VKIcon size={32} round/></VKShareButton>
        <WhatsappShareButton url={url} className="icon" onClick={onShared}><WhatsappIcon size={32} round/></WhatsappShareButton>
        <a href="https://discord.com/channels/@me" target="_blank" rel="noreferrer" className="icon" onClick={onShared}><FaDiscord size={32}/></a>
        <a href={`https://www.instagram.com/?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className="icon" onClick={onShared}><FaInstagram size={32}/></a>
      </div>
      <button className="arrow right" onClick={() => scroll(1)}><FiChevronRight/></button>
    </div>
  );
}
