'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { IconMenu2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/LanguageToggle';
import { MobileNavDrawer } from '@/components/MobileNavDrawer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NAV_SECTIONS, type SectionId } from '@/lib/navigation';
import { SITE_CONFIG } from '@/lib/site-config';
import { cn } from '@/lib/utils';

interface NavbarProps {
  activeSection: SectionId | null;
}

export function Navbar({ activeSection }: NavbarProps) {
  const t = useTranslations('nav');
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 h-16 w-full border-b border-border-subtle bg-background/90 backdrop-blur-md transition-colors">
        <div className="h-full px-5 md:px-8 lg:px-16 2xl:px-0">
          <div className="mx-auto flex h-full w-full max-w-[1008px] items-center justify-between gap-4">
            {/* Brand Wordmark */}
            <a
              href="#top"
              className="shrink-0 font-display text-[20px] leading-6 font-bold tracking-[-0.4px] whitespace-nowrap text-foreground transition-colors hover:text-foreground/80"
            >
              {SITE_CONFIG.brandName}
              <span className="text-primary">.</span>
            </a>

            {/* Desktop / Tablet Centered Navigation */}
            <nav aria-label={t('ariaLabel')} className="hidden items-center gap-8 md:flex">
              {NAV_SECTIONS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    aria-current={isActive ? 'location' : undefined}
                    className={cn(
                      'relative py-1 text-base leading-6 font-medium whitespace-nowrap transition-colors duration-150',
                      isActive
                        ? 'font-semibold text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {t(item.id)}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-bar"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className="absolute right-0 bottom-[-2px] left-0 mx-auto h-[2px] w-4 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Right Utility Controls */}
            <div className="flex shrink-0 items-center gap-2">
              <LanguageToggle layoutIdPrefix="navbar" />
              <ThemeToggle />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={t('openMenu')}
                aria-expanded={drawerOpen}
                onClick={() => setDrawerOpen(true)}
                className="size-10 rounded-lg border-border bg-card text-foreground md:hidden"
              >
                <IconMenu2 className="size-[18px] stroke-[2]" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <MobileNavDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        activeSection={activeSection}
      />
    </>
  );
}
