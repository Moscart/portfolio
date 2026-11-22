'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { useLocaleSwitch } from '@/components/LocaleProvider';
import { LOCALES, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { locale, setLocale } = useLocaleSwitch();
  const t = useTranslations('language');
  const activeIndex = Math.max(0, LOCALES.indexOf(locale));

  const handleSelect = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    setLocale(nextLocale);
  };

  return (
    <div
      role="group"
      aria-label={t('groupLabel')}
      className={cn(
        'inline-flex h-10 items-center rounded-lg border border-border bg-secondary p-1 md:h-9',
        className,
      )}
    >
      <div className="relative grid h-full grid-cols-2 items-center">
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={{ x: `${activeIndex * 100}%` }}
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          className="pointer-events-none absolute inset-y-0 left-0 w-1/2 rounded-sm border border-border bg-card shadow-2xs"
        />
        {LOCALES.map((item) => {
          const isActive = locale === item;
          return (
            <button
              key={item}
              type="button"
              aria-pressed={isActive}
              onClick={() => handleSelect(item)}
              className={cn(
                'relative inline-flex h-full min-w-8 cursor-pointer items-center justify-center rounded-sm px-2 font-mono text-xs font-medium transition-colors duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span className="relative z-10">{t(item)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
