import { useState, useRef, useEffect, useCallback } from "react";
import { Announcement } from "./blocks/announcement/announcement";
import { injectLiquid } from "../../util/shopify";
import "./adbar.css";
 
const SPEED = injectLiquid<number>("section.settings.marquee_speed | json | default: 70");

function OneCycle({ blocks }: { blocks: any[] }) {
  return (
    <>
      {blocks.map((block: any, index: number) => {
        if (block.type !== "announcement") return null;
        return (
          <>
            <span key={`${block.id}-${index}`} className="adbar-item"><Announcement settings={block.settings} /></span>
            <span key={`sep-${block.id}-${index}`}><div className="Separador">✧</div></span>
          </>
        );
      })}
    </>
  ); 
}  

export function Adbar(props: any) {
  const rulerRef = useRef<HTMLDivElement>(null);
  const [cycleWidth, setCycleWidth] = useState(0);
  const [copies, setCopies] = useState(0); 

  useEffect(() => {
    const onScroll = () => {
        document.body.classList.toggle('header-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const measure = useCallback(() => {
    if (!rulerRef.current) return;
    const w = rulerRef.current.getBoundingClientRect().width;
    if (w <= 0) return;
    const needed = Math.ceil((window.innerWidth * 2) / w) + 2;
    setCycleWidth(w);
    setCopies(Math.max(needed, 3));
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf); 
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  if (!props.blocks || props.blocks.length === 0) return null; 
 
  const duration = cycleWidth > 0 ? cycleWidth / SPEED : 0;

  return (
    <div className="adbar">
      <div ref={rulerRef} aria-hidden className="adbar-ruler">
        <OneCycle blocks={props.blocks} />  
      </div> 

      {copies > 0 && cycleWidth > 0 && (
        <>
          <style>
            {`@keyframes adbar-ticker { 
                from { transform: translateX(0); } 
                to { transform: translateX(${-cycleWidth}px); } 
              }`}
          </style>
          <div
            className="adbar-track"
            style={{ animation: `adbar-ticker ${duration}s linear infinite` }}
          >
            {Array.from({ length: copies }, (_, i) => (
              <OneCycle key={i} blocks={props.blocks} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}