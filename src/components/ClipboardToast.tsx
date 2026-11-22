'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { IconCheck } from '@tabler/icons-react';

interface ClipboardToastProps {
  open: boolean;
}

export function ClipboardToast({ open }: ClipboardToastProps) {
  const t = useTranslations('toast');

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed top-4 left-1/2 z-50 w-[calc(100%-2.5rem)] max-w-[340px] -translate-x-1/2"
        >
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[#86EFAC] bg-card px-4 py-3.5 shadow-lg dark:border-[#166534] dark:bg-[#111113]">
            <div className="flex items-center gap-2.5">
              <IconCheck
                className="size-4 shrink-0 stroke-[2.25] text-status-available"
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-foreground">{t('emailCopied')}</span>
            </div>
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {t('durationMeta')}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
