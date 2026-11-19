'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { setLocaleAction } from '@/i18n/actions';
import { LOCALES, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  layoutIdPrefix?: string;
  className?: string;
}

export function LanguageToggle({ layoutIdPrefix = 'navbar', className }: LanguageToggleProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('language');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSelect = (nextLocale: Locale) => {
    if (nextLocale === locale || isPending) return;
    startTransition(async () => {
      try {
        await setLocaleAction(nextLocale);
        router.refresh();
      } catch {
        // Gracefully keep current locale if offline or Server Action fails
      }
    });
  };

  return (
    <div
      role="group"
      aria-label={t('groupLabel')}
      className={cn(
        'inline-flex h-10 items-center gap-1 rounded-lg border border-border bg-secondary p-1 md:h-9',
        className,
      )}
    >
      {LOCALES.map((item) => {
        const isActive = locale === item;
        return (
          <button
            key={item}
            type="button"
            disabled={isPending}
            aria-pressed={isActive}
            onClick={() => handleSelect(item)}
            className={cn(
              'relative inline-flex h-full min-w-8 cursor-pointer items-center justify-center rounded-sm px-2 font-mono text-xs font-medium transition-colors duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {isActive && (
              <motion.span
                layoutId={`${layoutIdPrefix}-lang-pill`}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-sm border border-border bg-card shadow-2xs"
                aria-hidden="true"
              />
            )}
            <span className="relative z-10">{t(item)}</span>
          </button>
        );
      })}
    </div>
  );
}
