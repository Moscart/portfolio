'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { IconArrowUpRight, IconX } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NAV_SECTIONS, type SectionId } from '@/lib/navigation';
import { SITE_CONFIG } from '@/lib/site-config';
import { cn } from '@/lib/utils';

interface MobileNavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSection: SectionId | null;
}

export function MobileNavDrawer({ open, onOpenChange, activeSection }: MobileNavDrawerProps) {
  const tNav = useTranslations('nav');
  const tDrawer = useTranslations('drawer');
  const tHero = useTranslations('hero');

  const effectiveActive = activeSection ?? 'work';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full max-w-[375px] gap-0 border-l border-border bg-background p-0 text-foreground"
      >
        <SheetTitle className="sr-only">{tNav('ariaLabel')}</SheetTitle>
        <SheetDescription className="sr-only">{tDrawer('eyebrow')}</SheetDescription>

        {/* Drawer Top Bar */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border-subtle px-5">
          <a
            href="#top"
            onClick={() => onOpenChange(false)}
            className="font-display text-[20px] leading-6 font-bold tracking-[-0.4px] text-foreground"
          >
            {SITE_CONFIG.brandName}
            <span className="text-primary">.</span>
          </a>

          <SheetClose
            render={
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={tNav('closeMenu')}
                className="size-10 rounded-lg border-border bg-card text-foreground"
              />
            }
          >
            <IconX className="size-[18px] stroke-[2]" aria-hidden="true" />
          </SheetClose>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
          <p className="mb-3 font-mono text-xs font-medium tracking-[0.8px] text-muted-foreground uppercase">
            {tDrawer('eyebrow')}
          </p>

          <nav aria-label={tNav('ariaLabel')} className="flex flex-col gap-1">
            {NAV_SECTIONS.map((item) => {
              const isActive = effectiveActive === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    'group flex min-h-14 items-center justify-between rounded-xl px-4 py-3.5 transition-colors duration-150',
                    isActive
                      ? 'border border-border bg-secondary text-foreground'
                      : 'border border-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                  )}
                >
                  <span className="flex items-center gap-3">
                    {isActive && (
                      <span
                        className="h-5 w-[3px] shrink-0 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={cn(
                        'font-display text-lg leading-6 tracking-[-0.2px]',
                        isActive ? 'font-bold text-foreground' : 'font-medium',
                      )}
                    >
                      {tNav(item.id)}
                    </span>
                  </span>

                  <span
                    className={cn(
                      'font-mono text-xs tabular-nums',
                      isActive ? 'font-medium text-accent-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {item.index}
                  </span>
                </a>
              );
            })}
          </nav>

          <Separator className="my-6 bg-border-subtle" />

          {/* Appearance & Language Controls */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">{tDrawer('appearanceLabel')}</span>
            <div className="flex items-center gap-2">
              <LanguageToggle layoutIdPrefix="drawer" />
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Bottom Pinned CTA & Social Grid */}
        <div className="mt-auto flex flex-col gap-3 px-5 pt-4 pb-6">
          <Button
            nativeButton={false}
            render={<a href="#contact" onClick={() => onOpenChange(false)} />}
            className="h-11 w-full rounded-lg text-base font-semibold"
          >
            <span>{tHero('ctaPrimary')}</span>
            <IconArrowUpRight className="size-4 stroke-[2]" aria-hidden="true" />
          </Button>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <a
                  href={SITE_CONFIG.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onOpenChange(false)}
                />
              }
              className="h-10 rounded-lg text-xs font-medium"
            >
              {tHero('github')}
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <a
                  href={SITE_CONFIG.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onOpenChange(false)}
                />
              }
              className="h-10 rounded-lg text-xs font-medium"
            >
              {tHero('linkedin')}
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <a
                  href={SITE_CONFIG.mediumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onOpenChange(false)}
                />
              }
              className="h-10 rounded-lg text-xs font-medium"
            >
              {tHero('medium')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
