"use client";
import { useRef, useState } from "react";
import Image from "next/image";

export default function BeforeAfterSlider({ beforeSrc, afterSrc, beforeAlt = "Before", afterAlt = "After" }) {
  const frameRef = useRef(null);
  const [pct, setPct] = useState(50);
  const dragging = useRef(false);

  function setFromClientX(clientX) {
    const rect = frameRef.current.getBoundingClientRect();
    let value = ((clientX - rect.left) / rect.width) * 100;
    value = Math.max(4, Math.min(96, value));
    setPct(value);
  }

  return (
    <div
      ref={frameRef}
      className="relative w-full h-full select-none cursor-ew-resize"
      onMouseDown={(e) => { dragging.current = true; setFromClientX(e.clientX); }}
      onMouseMove={(e) => { if (dragging.current) setFromClientX(e.clientX); }}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => setFromClientX(e.touches[0].clientX)}
      onTouchMove={(e) => setFromClientX(e.touches[0].clientX)}
    >
      <Image src={beforeSrc} alt={beforeAlt} fill className="object-cover" priority />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      >
        <Image src={afterSrc} alt={afterAlt} fill className="object-cover" priority />
      </div>
      <div
        className="absolute top-0 bottom-0 w-[3px] bg-white shadow-md"
        style={{ left: `${pct}%`, transform: "translateX(-1.5px)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-[#211F1C] flex items-center justify-center text-lg shadow-lg">
          ⟷
        </div>
      </div>
      <span className="absolute bottom-5 left-5 text-[11px] font-semibold tracking-wide text-white/60">BEFORE</span>
      <span className="absolute bottom-5 right-5 text-[11px] font-semibold tracking-wide text-white/85">AFTER</span>
    </div>
  );
}
