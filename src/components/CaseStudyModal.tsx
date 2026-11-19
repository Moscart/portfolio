'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { IconArrowUpRight, IconX } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { FEATURED_PROJECT } from '@/lib/portfolio-data';
import { cn } from '@/lib/utils';

interface CaseStudyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CaseStudyModal({ open, onOpenChange }: CaseStudyModalProps) {
  const isMobile = useIsMobile();
  const t = useTranslations('caseStudy');

  const desktopHighlights = [
    t('highlightDesktop1'),
    t('highlightDesktop2'),
    t('highlightDesktop3'),
  ];

  const mobileHighlights = [t('highlightMobile1'), t('highlightMobile2'), t('highlightMobile3')];

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="max-h-[85dvh] gap-5 overflow-y-auto rounded-t-2xl border-t border-border bg-card px-5 pt-3 pb-6 text-foreground shadow-2xl"
        >
          {/* Mobile Drag Handle Pill */}
          <div className="mx-auto h-1 w-9 rounded-full bg-muted-foreground/35" aria-hidden="true" />

          {/* Header Row */}
          <div className="flex items-center justify-between gap-3">
            <Badge
              variant="outline"
              className="h-7 gap-1.5 rounded-sm border-border bg-secondary px-2.5 text-xs font-medium text-foreground"
            >
              <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
              <span>{t('badge')}</span>
            </Badge>

            <SheetClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={t('close')}
                  className="size-10 rounded-lg border-border bg-card text-foreground"
                />
              }
            >
              <IconX className="size-[18px] stroke-[2]" aria-hidden="true" />
            </SheetClose>
          </div>

          {/* Title & Concise Mobile Copy */}
          <div className="space-y-2.5">
            <SheetTitle className="font-display text-xl leading-7 font-bold tracking-[-0.3px] text-foreground">
              {t('titleMobile')}
            </SheetTitle>
            <SheetDescription className="text-base leading-6 text-text-body">
              {t('summaryMobile')}
            </SheetDescription>
          </div>

          {/* Outcomes Inset Box */}
          <div className="rounded-xl border border-border bg-secondary p-4">
            <ul className="space-y-2.5">
              {mobileHighlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-5 text-text-secondary"
                >
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stacked Touch-Friendly Actions */}
          <div className="flex flex-col gap-2.5 pt-1">
            <a
              href={FEATURED_PROJECT.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: 'default' }),
                'h-11 w-full rounded-lg text-base font-semibold',
              )}
            >
              <span>{t('visitCta')}</span>
              <IconArrowUpRight className="size-4 stroke-[2]" aria-hidden="true" />
            </a>
            <SheetClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full rounded-lg text-base font-medium"
                />
              }
            >
              {t('close')}
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] w-full max-w-[560px] gap-5 overflow-y-auto rounded-2xl border border-border bg-card p-8 text-foreground shadow-2xl ring-0 sm:max-w-[560px]"
      >
        {/* Top Meta Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="h-7 gap-1.5 rounded-sm border-border bg-secondary px-2.5 text-xs font-medium text-foreground"
            >
              <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
              <span>{t('badge')}</span>
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">{t('meta')}</span>
          </div>

          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={t('close')}
                className="size-9 rounded-lg border-border bg-card text-foreground"
              />
            }
          >
            <IconX className="size-4 stroke-[2]" aria-hidden="true" />
          </DialogClose>
        </div>

        {/* Title & Extended Summary */}
        <div className="space-y-3">
          <DialogTitle className="font-display text-2xl leading-8 font-bold tracking-[-0.4px] text-foreground">
            {t('titleDesktop')}
          </DialogTitle>
          <DialogDescription className="text-base leading-6 text-text-body">
            {t('summaryDesktop')}
          </DialogDescription>
        </div>

        {/* Architectural Highlights Inset Panel */}
        <div className="space-y-3 rounded-xl border border-border bg-secondary p-5">
          <p className="font-mono text-[11px] font-medium tracking-[0.8px] text-muted-foreground uppercase">
            {t('highlightsLabel')}
          </p>
          <ul className="space-y-2.5">
            {desktopHighlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm leading-5 text-text-secondary"
              >
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stack Line */}
        <p className="font-mono text-xs text-muted-foreground">
          {FEATURED_PROJECT.modalStack.join(' · ')}
        </p>

        <Separator className="bg-border-subtle" />

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-xs text-muted-foreground">{t('escHint')}</span>

          <div className="flex items-center gap-3">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-lg px-4 text-sm font-medium"
                />
              }
            >
              {t('close')}
            </DialogClose>
            <a
              href={FEATURED_PROJECT.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: 'default' }),
                'h-10 rounded-lg px-5 text-sm font-semibold',
              )}
            >
              <span>{t('visitCta')}</span>
              <IconArrowUpRight className="size-4 stroke-[2]" aria-hidden="true" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
