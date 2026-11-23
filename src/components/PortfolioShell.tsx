'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ClipboardToast } from '@/components/ClipboardToast';
import { Navbar } from '@/components/Navbar';
import { ContactFooterSection, SiteFooter } from '@/components/sections/ContactFooterSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { SelectedWorkSection } from '@/components/sections/SelectedWorkSection';
import { WritingSection } from '@/components/sections/WritingSection';
import { copyTextSafely, createResettableTimer, type ResettableTimer } from '@/lib/clipboard';
import { NAV_SECTIONS, resolveActiveSection, type SectionId } from '@/lib/navigation';
import { SITE_CONFIG } from '@/lib/site-config';

const COPY_FEEDBACK_DURATION_MS = 2000;

export function PortfolioShell() {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const copyTimerRef = useRef<ResettableTimer | null>(null);

  useEffect(() => {
    const timer = createResettableTimer(COPY_FEEDBACK_DURATION_MS, () => {
      setCopiedEmail(false);
    });
    copyTimerRef.current = timer;

    return () => {
      timer.cancel();
      copyTimerRef.current = null;
    };
  }, []);

  useEffect(() => {
    let frameId: number | null = null;

    const updateActive = () => {
      frameId = null;
      const rects = NAV_SECTIONS.flatMap((section) => {
        const el = document.getElementById(section.id);
        if (!el) return [];
        const box = el.getBoundingClientRect();
        return [{ id: section.id, top: box.top, height: box.height }];
      });

      const next = resolveActiveSection(
        rects,
        window.innerHeight,
        window.scrollY,
        document.documentElement.scrollHeight,
      );
      setActiveSection((prev) => (prev === next ? prev : next));
    };

    const scheduleUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateActive);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, []);

  const handleCopyEmail = useCallback(async () => {
    const succeeded = await copyTextSafely(SITE_CONFIG.email);
    if (succeeded) {
      setCopiedEmail(true);
      copyTimerRef.current?.trigger();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar activeSection={activeSection} />

      <main>
        <HeroSection />
        <SelectedWorkSection />
        <ExperienceSection />
        <WritingSection />
        <ContactFooterSection copied={copiedEmail} onCopyEmail={handleCopyEmail} />
      </main>

      <SiteFooter />

      <ClipboardToast open={copiedEmail} />
    </div>
  );
}
