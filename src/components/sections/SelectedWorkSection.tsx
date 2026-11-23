'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { IconArrowUpRight } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { FEATURED_PROJECT, SECONDARY_PROJECTS } from '@/lib/portfolio-data';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function SelectedWorkSection() {
  const t = useTranslations('work');

  const bettyOutcomes = [
    t('projects.betty.outcome1'),
    t('projects.betty.outcome2'),
    t('projects.betty.outcome3'),
  ];

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="scroll-mt-16 border-y border-border-subtle bg-secondary py-12 md:py-14 lg:py-16 2xl:py-[72px]"
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
              id="work-heading"
              className="font-display text-2xl leading-8 font-bold tracking-[-0.4px] text-foreground md:text-[28px] md:leading-9 lg:text-[32px] lg:leading-10 lg:tracking-[-0.6px]"
            >
              {t('heading')}
            </h2>
          </motion.div>

          {/* Projects Stack */}
          <div className="flex flex-col gap-4">
            {/* Featured Card: Betty Architecture & Enterprise Dashboard */}
            <motion.article
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
              className="flex flex-col justify-between gap-6 rounded-xl border border-border bg-card p-6 lg:flex-row lg:items-stretch lg:gap-8 lg:p-8"
            >
              {/* Left Column */}
              <div className="flex flex-1 flex-col justify-between gap-5">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Badge
                      variant="outline"
                      className="h-6 gap-1.5 rounded-sm border-border bg-secondary px-2 text-xs font-medium text-foreground"
                    >
                      <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                      <span>{t('featuredBadge')}</span>
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">
                      {t('projects.betty.meta')}
                    </span>
                  </div>

                  <h3 className="font-display text-xl leading-7 font-bold tracking-[-0.3px] text-foreground md:text-2xl md:leading-8">
                    {t('projects.betty.title')}
                  </h3>

                  <p className="text-base leading-6 text-text-body">
                    {t('projects.betty.description')}
                  </p>
                </div>

                <p className="font-mono text-xs leading-4 text-muted-foreground">
                  {FEATURED_PROJECT.stack.join(' · ')}
                </p>
              </div>

              {/* Right Column: Key Outcomes Panel */}
              <div className="flex w-full shrink-0 flex-col justify-between gap-4 rounded-xl border border-border bg-secondary p-5 lg:w-[300px]">
                <div className="space-y-3">
                  <p className="font-mono text-[11px] leading-4 font-medium tracking-[0.8px] text-muted-foreground uppercase">
                    {t('outcomesLabel')}
                  </p>
                  <ul className="space-y-2">
                    {bettyOutcomes.map((outcome) => (
                      <li
                        key={outcome}
                        className="flex items-start gap-2 text-xs leading-5 text-text-secondary"
                      >
                        <span
                          className="mt-[7px] size-1.5 shrink-0 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={FEATURED_PROJECT.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-1 rounded-xs text-xs leading-4 font-semibold text-accent-foreground underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span>{t('visitBetty')}</span>
                  <IconArrowUpRight className="size-3.5 stroke-[2.25]" aria-hidden="true" />
                </a>
              </div>
            </motion.article>

            {/* Secondary 3 Project Cards (1-col Mobile & Tablet 768px, 3-col Laptop 1024px+) */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {SECONDARY_PROJECTS.map((project, idx) => (
                <motion.a
                  key={project.id}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.4, delay: idx * 0.05, ease: EASE_OUT_EXPO }}
                  className="group flex flex-col justify-between gap-5 rounded-xl border border-border bg-card p-6 transition-[border-color,box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs leading-4 text-muted-foreground">
                        {t(`projects.${project.id}.category`)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="font-mono text-xs leading-4 text-muted-foreground tabular-nums group-hover:hidden group-focus-visible:hidden [@media(hover:none)]:inline">
                          {t(`projects.${project.id}.year`)}
                        </span>
                        <IconArrowUpRight
                          className="hidden size-4 stroke-[2] text-primary group-hover:inline-block group-focus-visible:inline-block [@media(hover:none)]:inline-block"
                          aria-hidden="true"
                        />
                      </span>
                    </div>

                    <h3 className="font-display text-lg leading-7 font-bold tracking-[-0.2px] text-foreground">
                      {t(`projects.${project.id}.title`)}
                    </h3>

                    <p className="text-sm leading-6 text-text-body">
                      {t(`projects.${project.id}.description`)}
                    </p>
                  </div>

                  <p className="font-mono text-xs leading-4 text-muted-foreground">
                    {project.stack.join(' · ')}
                  </p>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
