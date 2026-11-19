'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { IconArrowUpRight } from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CORE_STACK_ITEMS } from '@/lib/portfolio-data';
import { SITE_CONFIG } from '@/lib/site-config';
import { cn } from '@/lib/utils';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="scroll-mt-16 bg-background py-10 md:py-12 lg:py-14 2xl:pt-16 2xl:pb-14"
    >
      <div className="px-5 md:px-8 lg:px-16 2xl:px-0">
        <div className="mx-auto flex w-full max-w-[1008px] flex-col gap-7 md:gap-8 lg:gap-9 2xl:gap-10">
          {/* Identity Row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-center gap-4">
              <Avatar className="size-16 overflow-hidden rounded-2xl after:rounded-2xl">
                <AvatarImage
                  src={SITE_CONFIG.profileImagePath}
                  alt={t('fullName')}
                  className="scale-[1.08] rounded-2xl object-cover object-[56%_38%]"
                />
                <AvatarFallback className="rounded-2xl font-display text-base font-bold">
                  DT
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1">
                <p className="text-base leading-6 font-semibold text-foreground">{t('fullName')}</p>
                <p className="text-xs leading-4 text-muted-foreground">
                  <span className="md:hidden">{t('roleLocationMobile')}</span>
                  <span className="hidden md:inline">{t('roleLocationDesktop')}</span>
                </p>
              </div>
            </div>

            <div className="inline-flex h-8 w-fit items-center gap-2 rounded-full border border-border bg-secondary px-3 text-xs leading-4 font-medium text-text-secondary">
              <span
                className="size-2 shrink-0 rounded-full bg-status-available"
                aria-hidden="true"
              />
              <span>{t('availability')}</span>
            </div>
          </motion.div>

          {/* Main Copy & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06, ease: EASE_OUT_EXPO }}
            className="flex flex-col gap-4 md:gap-5"
          >
            <h1
              id="hero-heading"
              className="max-w-[800px] font-display text-[32px] leading-10 font-bold tracking-[-0.8px] text-foreground md:text-[40px] md:leading-[48px] md:tracking-[-1px] lg:text-[44px] lg:leading-[52px] 2xl:text-[48px] 2xl:leading-[56px] 2xl:tracking-[-1.2px]"
            >
              {t('h1')}
            </h1>

            <p className="max-w-[688px] text-base leading-6 text-text-body lg:text-xl lg:leading-8">
              {t('bio')}
            </p>

            {/* Responsive Action Bar (native <a> links styled via shadcn buttonVariants) */}
            <div className="grid grid-cols-3 gap-2 pt-2 md:flex md:flex-wrap md:items-center md:gap-3">
              <a
                href="#contact"
                className={cn(
                  buttonVariants({ variant: 'default' }),
                  'col-span-3 h-11 rounded-lg px-5 text-base font-semibold md:w-auto',
                )}
              >
                <span>{t('ctaPrimary')}</span>
                <IconArrowUpRight className="size-4 stroke-[2]" aria-hidden="true" />
              </a>

              <a
                href={SITE_CONFIG.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'h-11 rounded-lg px-4 text-sm font-medium md:text-base',
                )}
              >
                {t('github')}
              </a>

              <a
                href={SITE_CONFIG.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'h-11 rounded-lg px-4 text-sm font-medium md:text-base',
                )}
              >
                {t('linkedin')}
              </a>

              <a
                href={SITE_CONFIG.mediumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'h-11 rounded-lg px-4 text-sm font-medium md:text-base',
                )}
              >
                {t('medium')}
              </a>
            </div>
          </motion.div>

          {/* Core Stack Strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12, ease: EASE_OUT_EXPO }}
            className="flex flex-col gap-6"
          >
            <Separator className="bg-border-subtle" />

            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
              <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-3">
                <span className="shrink-0 font-mono text-xs leading-4 font-medium tracking-[0.8px] text-muted-foreground uppercase">
                  {t('stackLabel')}
                </span>
                <span className="text-xs leading-4 font-medium text-foreground">
                  {CORE_STACK_ITEMS.join(' · ')}
                </span>
              </div>

              <span className="shrink-0 font-mono text-xs leading-4 text-muted-foreground">
                <span className="md:hidden">{t('credibilityMobile')}</span>
                <span className="hidden md:inline">{t('credibilityDesktop')}</span>
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
