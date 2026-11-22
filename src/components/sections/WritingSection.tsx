'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { IconArrowUpRight } from '@tabler/icons-react';
import { Kbd } from '@/components/ui/kbd';
import { WRITING_ARTICLES } from '@/lib/portfolio-data';
import { SITE_CONFIG } from '@/lib/site-config';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function WritingSection() {
  const t = useTranslations('writing');

  return (
    <section
      id="writing"
      aria-labelledby="writing-heading"
      className="scroll-mt-16 border-y border-border-subtle bg-secondary py-12 md:py-14 lg:py-16 2xl:py-[72px]"
    >
      <div className="px-5 md:px-8 lg:px-16 2xl:px-0">
        <div className="mx-auto flex w-full max-w-[1008px] flex-col gap-6 md:gap-8">
          {/* Header Row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="h-[2px] w-4 rounded-xs bg-primary" aria-hidden="true" />
                <span className="font-mono text-xs leading-4 font-medium tracking-[0.8px] text-muted-foreground uppercase">
                  {t('eyebrow')}
                </span>
              </div>
              <h2
                id="writing-heading"
                className="font-display text-2xl leading-8 font-bold tracking-[-0.4px] text-foreground md:text-[28px] md:leading-9 lg:text-[32px] lg:leading-10 lg:tracking-[-0.6px]"
              >
                {t('heading')}
              </h2>
            </div>

            <a
              href={SITE_CONFIG.mediumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1 rounded-xs text-xs leading-4 font-semibold text-accent-foreground underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span>{t('allArticles')}</span>
              <IconArrowUpRight className="size-3.5 stroke-[2.25]" aria-hidden="true" />
            </a>
          </motion.div>

          {/* Grouped Article List Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.05, ease: EASE_OUT_EXPO }}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="divide-y divide-border-subtle">
              {WRITING_ARTICLES.map((article) => (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col justify-between gap-4 p-6 transition-colors duration-150 hover:bg-secondary/60 focus-visible:bg-primary/[0.06] focus-visible:outline-none md:flex-row md:items-center md:gap-6"
                >
                  {/* WCAG Keyboard Focus-Visible 4px Left Orange Bar (FigCraft Interactive States) */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-4 left-0 w-1 rounded-r-full bg-primary opacity-0 transition-opacity duration-150 group-focus-visible:opacity-100"
                  />

                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-xs leading-4 text-muted-foreground transition-colors duration-150 group-hover:text-accent-foreground group-focus-visible:text-accent-foreground">
                      {t(`articles.${article.id}.category`)}
                    </span>

                    <h3 className="font-display text-base leading-6 font-semibold tracking-[-0.2px] text-foreground decoration-foreground/70 underline-offset-4 group-hover:underline md:text-xl md:leading-7">
                      {t(`articles.${article.id}.title`)}
                    </h3>

                    <p className="text-base leading-6 text-text-body">
                      {t(`articles.${article.id}.excerpt`)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2.5">
                    <Kbd className="hidden h-6 border border-border bg-card px-2 font-mono text-[11px] font-medium text-muted-foreground group-focus-visible:inline-flex">
                      {t('enterHint')}
                    </Kbd>
                    <span className="inline-flex items-center gap-1 text-xs leading-4 font-semibold whitespace-nowrap text-accent-foreground underline-offset-4 group-hover:underline">
                      <span>{t('readArticle')}</span>
                      <IconArrowUpRight className="size-3.5 stroke-[2.25]" aria-hidden="true" />
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {/* Progressive Publishing Footer Row */}
            <div className="flex flex-col justify-between gap-2 border-t border-border-subtle bg-secondary/50 px-6 py-4 md:flex-row md:items-center md:gap-4">
              <p className="text-xs leading-4 text-muted-foreground">{t('progressiveNote')}</p>

              <a
                href={SITE_CONFIG.mediumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit shrink-0 items-center gap-1 rounded-xs font-mono text-xs leading-4 font-medium text-foreground underline-offset-4 transition-colors hover:text-accent-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span>{t('followHandle')}</span>
                <IconArrowUpRight
                  className="size-3.5 stroke-[2] text-accent-foreground"
                  aria-hidden="true"
                />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
