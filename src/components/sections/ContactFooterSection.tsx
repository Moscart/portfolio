'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { IconArrowUpRight, IconCheck, IconCopy } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/site-config';
import { cn } from '@/lib/utils';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface ContactFooterSectionProps {
  copied: boolean;
  onCopyEmail: () => void;
}

export function ContactFooterSection({ copied, onCopyEmail }: ContactFooterSectionProps) {
  const t = useTranslations('contact');
  const tFooter = useTranslations('footer');

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-16 bg-background pt-12 pb-8 md:pt-14 md:pb-8 lg:pt-16 lg:pb-9 2xl:pt-[72px] 2xl:pb-10"
    >
      <div className="px-5 md:px-8 lg:px-16 2xl:px-0">
        <div className="mx-auto flex w-full max-w-[1008px] flex-col gap-8 md:gap-10 lg:gap-12">
          {/* Always-Dark Contact Anchor Card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            className="flex flex-col gap-4 rounded-2xl border border-[#27272A] bg-[#18181B] p-6 text-[#FAFAFA] md:p-8 lg:p-10 2xl:p-12 dark:border-[#3F3F46]"
          >
            {/* Top Row: Eyebrow + Availability */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <span className="h-[2px] w-4 rounded-xs bg-primary" aria-hidden="true" />
                <span className="font-mono text-xs leading-4 font-medium tracking-[0.8px] text-[#A1A1AA] uppercase">
                  {t('eyebrow')}
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs leading-4 text-[#A1A1AA]">
                <span className="size-2 shrink-0 rounded-full bg-[#22C55E]" aria-hidden="true" />
                <span className="md:hidden">{t('availabilityMobile')}</span>
                <span className="hidden md:inline">{t('availabilityDesktop')}</span>
              </div>
            </div>

            {/* Heading & Subcopy */}
            <h2
              id="contact-heading"
              className="font-display text-[28px] leading-9 font-bold tracking-[-0.6px] text-[#FAFAFA] md:text-[32px] md:leading-10 lg:text-[36px] lg:leading-[44px] lg:tracking-[-0.8px]"
            >
              {t('heading')}
            </h2>

            <p className="max-w-[640px] text-base leading-6 text-[#A1A1AA]">{t('subcopy')}</p>

            {/* Direct Contact Actions */}
            <div className="flex flex-col gap-3 pt-2 md:flex-row md:items-center">
              <Button
                nativeButton={false}
                render={<a href={`mailto:${SITE_CONFIG.email}`} />}
                className="h-11 w-full rounded-lg px-5 text-base font-semibold md:w-auto"
              >
                <span>{t('emailCta')}</span>
                <IconArrowUpRight className="size-4 stroke-[2]" aria-hidden="true" />
              </Button>

              <button
                type="button"
                onClick={onCopyEmail}
                className={cn(
                  'inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 font-mono text-xs transition-colors duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] md:w-auto',
                  copied
                    ? 'border-[#22C55E]/60 bg-[#14532D]/60 text-[#86EFAC]'
                    : 'border-[#3F3F46] bg-[#27272A]/80 text-[#E4E4E7] hover:border-[#71717A] hover:bg-[#27272A]',
                )}
              >
                {copied ? (
                  <>
                    <IconCheck className="size-4 shrink-0 stroke-[2.25]" aria-hidden="true" />
                    <span className="font-sans text-xs font-medium">{t('copiedInline')}</span>
                  </>
                ) : (
                  <>
                    <IconCopy
                      className="size-4 shrink-0 stroke-[1.75] text-[#A1A1AA]"
                      aria-hidden="true"
                    />
                    <span>{SITE_CONFIG.email}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Footer Bar */}
          <footer className="flex flex-col justify-between gap-3 border-t border-border-subtle pt-6 text-xs leading-4 text-muted-foreground md:flex-row md:items-center">
            <p>{tFooter('copyright')}</p>

            <div className="flex items-center gap-5">
              <a
                href={SITE_CONFIG.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium transition-colors hover:text-foreground"
              >
                {tFooter('linkedin')}
              </a>
              <a
                href={SITE_CONFIG.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium transition-colors hover:text-foreground"
              >
                {tFooter('github')}
              </a>
              <a
                href={SITE_CONFIG.mediumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium transition-colors hover:text-foreground"
              >
                {tFooter('medium')}
              </a>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}
