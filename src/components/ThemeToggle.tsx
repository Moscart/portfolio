'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { toggleTheme } = useTheme();
  const t = useTranslations('theme');

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        'size-10 rounded-lg border-border bg-card text-foreground hover:border-primary/60 hover:bg-card hover:text-primary md:size-9 dark:hover:border-primary/70 dark:hover:text-accent-foreground',
        className,
      )}
    >
      {/* Render both states via CSS so SSR & pre-hydration icon + AT label never mismatch */}
      <IconMoon className="size-[18px] stroke-[2] dark:hidden" aria-hidden="true" />
      <span className="sr-only dark:hidden">{t('switchToDark')}</span>
      <IconSun className="hidden size-[18px] stroke-[2] dark:block" aria-hidden="true" />
      <span className="sr-only hidden dark:inline">{t('switchToLight')}</span>
    </Button>
  );
}
