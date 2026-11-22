'use client';

import React, { useEffect, useRef } from 'react';
import { ReactLenis, type LenisRef } from 'lenis/react';
import { cancelFrame, frame } from 'motion/react';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }

    frame.update(update, true);

    return () => {
      cancelFrame(update);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        anchors: true,
        allowNestedScroll: true,
        respectReducedMotion: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
