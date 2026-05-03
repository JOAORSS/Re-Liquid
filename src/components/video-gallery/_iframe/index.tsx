import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@linaria/react';

export const YouTubeVideoPlayer: React.FC<{ videoId: string }> = ({ videoId }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube-nocookie.com' && event.origin !== 'https://www.youtube.com') return;

      try {
        const data = JSON.parse(event.data);
        if (iframeRef.current && event.source === iframeRef.current.contentWindow) {
          const contentWindow = iframeRef.current.contentWindow;
          if (contentWindow && data.event === 'infoDelivery' && data.info && data.info.playerState === 0) {
            contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }), '*');
            contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
            setIsPlaying(true);
          }
        }
      } catch (e) {
        console.warn(e);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (!iframeRef.current || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!iframeRef.current?.contentWindow) return;
        
        if (entry.isIntersecting) {
          iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
          setIsPlaying(true);
        } else {
          iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const handleIframeLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), '*');
    }
  };

  const togglePlay = () => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    const command = isPlaying ? 'pauseVideo' : 'playVideo';
    iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: command }), '*');
    setIsPlaying(!isPlaying);
  };

  const ytSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;

  return (
    <PlayerWrapper ref={containerRef} onClick={togglePlay}>
      <StyledIframe 
        ref={iframeRef}
        src={ytSrc} 
        onLoad={handleIframeLoad}
        frameBorder="0" 
        allow="encrypted-media" 
      />
      <OverlayControls isPlaying={isPlaying}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </OverlayControls>
    </PlayerWrapper>
  );
};

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="30" height="30" fill="white"><path d="M8 5v14l11-7z"/></svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" width="30" height="30" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
);

const PlayerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  aspect-ratio: 9/16;
  min-width: 210px;

  &:hover > div {
    opacity: 1 !important;
  }
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  pointer-events: none;
`;

const OverlayControls = styled.div<{ isPlaying: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: ${props => (props.isPlaying ? 0 : 1)};
  transition: opacity 0.3s ease;
  pointer-events: none;
`;