'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { EXPERIENCE_ITEMS } from '@/lib/portfolio-data';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ExperienceSection() {
  const t = useTranslations('experience');

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="scroll-mt-16 bg-background py-12 md:py-14 lg:py-16 2xl:py-[72px]"
    >
      <div className="px-5 md:px-8 lg:px-16 2xl:px-0">
        <div className="mx-auto flex w-full max-w-[1008px] flex-col gap-6 md:gap-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-4 rounded-xs bg-primary" aria-hidden="true" />
              <span className="font-mono text-xs leading-4 font-medium tracking-[0.8px] text-muted-foreground uppercase">
                {t('eyebrow')}
              </span>
            </div>
            <h2
              id="experience-heading"
              className="font-display text-2xl leading-8 font-bold tracking-[-0.4px] text-foreground md:text-[28px] md:leading-9 lg:text-[32px] lg:leading-10 lg:tracking-[-0.6px]"
            >
              {t('heading')}
            </h2>
          </motion.div>

          {/* Divided Work History List */}
          <div className="border-t border-border-subtle">
            {EXPERIENCE_ITEMS.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: idx * 0.04, ease: EASE_OUT_EXPO }}
                className="border-b border-border-subtle py-6"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-4">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-display text-lg leading-7 font-bold tracking-[-0.2px] text-foreground">
                      {t(`items.${item.id}.role`)}
                    </h3>
                    <p className="text-xs leading-4 text-muted-foreground">
                      {t(`items.${item.id}.company`)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                    {item.isCurrent && (
                      <Badge
                        variant="outline"
                        className="h-6 gap-1.5 rounded-sm border-border bg-secondary px-2 text-xs font-medium text-foreground"
                      >
                        <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                        <span>{t('currentBadge')}</span>
                      </Badge>
                    )}
                    <span className="font-mono text-xs leading-4 text-muted-foreground tabular-nums">
                      {t(`items.${item.id}.period`)}
                    </span>
                  </div>
                </div>

                <p className="mt-2.5 text-base leading-6 text-text-body">
                  {t(`items.${item.id}.summary`)}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
