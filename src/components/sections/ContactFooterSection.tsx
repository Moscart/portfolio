'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { IconArrowUp, IconArrowUpRight, IconCheck, IconCopy } from '@tabler/icons-react';
import { buttonVariants } from '@/components/ui/button';
import { NAV_SECTIONS } from '@/lib/navigation';
import { SITE_CONFIG } from '@/lib/site-config';
import { cn } from '@/lib/utils';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface ContactFooterSectionProps {
  copied: boolean;
  onCopyEmail: () => void;
}

export function ContactFooterSection({ copied, onCopyEmail }: ContactFooterSectionProps) {
  const t = useTranslations('contact');

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-16 bg-background pt-12 pb-8 md:pt-14 md:pb-10 lg:pt-16 lg:pb-12 2xl:pt-[72px] 2xl:pb-12"
    >
      <div className="px-5 md:px-8 lg:px-16 2xl:px-0">
        <div className="mx-auto w-full max-w-[1008px]">
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
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className={cn(
                  buttonVariants({ variant: 'default' }),
                  'h-11 w-full rounded-lg px-5 text-base font-semibold md:w-auto',
                )}
              >
                <span>{t('emailCta')}</span>
                <IconArrowUpRight className="size-4 stroke-[2]" aria-hidden="true" />
              </a>

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
        </div>
      </div>
    </section>
  );
}

const FOOTER_CONNECT_LINKS = [
  { id: 'github', href: SITE_CONFIG.githubUrl, external: true },
  { id: 'linkedin', href: SITE_CONFIG.linkedinUrl, external: true },
  { id: 'medium', href: SITE_CONFIG.mediumUrl, external: true },
  { id: 'email', href: `mailto:${SITE_CONFIG.email}`, external: false },
] as const;

interface SiteFooterProps {
  basePath?: '' | '/';
}

export function SiteFooter({ basePath = '' }: SiteFooterProps) {
  const tNav = useTranslations('nav');
  const tFooter = useTranslations('footer');
  const homeHref = basePath === '/' ? '/' : '#top';

  return (
    <footer className="bg-background pb-8 lg:pb-9 2xl:pb-10">
      <div className="px-5 md:px-8 lg:px-16 2xl:px-0">
        <div className="mx-auto flex w-full max-w-[1008px] flex-col gap-6 lg:gap-8">
          {/* Structural Top Hairline with Signature Brand Accent Tick */}
          <div className="flex w-full items-center" aria-hidden="true">
            <span className="h-[2px] w-8 shrink-0 rounded-[1px] bg-primary" />
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* Tier 1: Clean 3-Column Editorial Grid (Brand | Navigation | Connect) */}
          <div className="flex flex-col gap-7 md:flex-row md:items-start md:justify-between md:gap-8">
            {/* Brand Identity & Location Pill */}
            <div className="flex w-full flex-col gap-3 md:w-[312px] md:gap-4 lg:w-[352px] 2xl:w-[384px]">
              <a
                href={homeHref}
                className="inline-flex min-h-6 w-fit items-baseline font-display text-[20px] leading-6 font-bold tracking-[-0.4px] whitespace-nowrap text-foreground transition-colors duration-150 hover:text-foreground/80"
              >
                {SITE_CONFIG.brandName}
                <span className="text-primary">.</span>
              </a>

              <p className="text-sm leading-[22px] text-text-body">{tFooter('tagline')}</p>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-secondary px-3 py-2 font-mono text-xs leading-4 text-text-secondary dark:bg-card">
                <span
                  className="size-2 shrink-0 rounded-full bg-status-available"
                  aria-hidden="true"
                />
                <span className="md:hidden">{tFooter('locationMobile')}</span>
                <span className="hidden md:inline">{tFooter('locationDesktop')}</span>
              </div>
            </div>

            {/* Navigation & Connect Columns */}
            <div className="grid grid-cols-2 gap-6 md:flex md:items-start md:gap-12 lg:gap-[72px] 2xl:gap-24">
              {/* Navigation */}
              <nav aria-label={tFooter('navAriaLabel')} className="flex flex-col gap-3">
                <h2 className="font-mono text-[11px] leading-4 font-medium tracking-[0.8px] text-muted-foreground uppercase">
                  {tFooter('navHeading')}
                </h2>
                <ul className="flex flex-col gap-2">
                  {NAV_SECTIONS.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`${basePath}${item.href}`}
                        className="inline-flex min-h-6 items-center text-sm leading-6 font-medium text-secondary-foreground transition-colors duration-150 hover:text-primary dark:text-text-secondary dark:hover:text-primary"
                      >
                        {tNav(item.id)}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Connect */}
              <div className="flex flex-col gap-3">
                <h2 className="font-mono text-[11px] leading-4 font-medium tracking-[0.8px] text-muted-foreground uppercase">
                  {tFooter('connectHeading')}
                </h2>
                <ul role="list" className="flex flex-col gap-2">
                  {FOOTER_CONNECT_LINKS.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        {...(link.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : undefined)}
                        className="group inline-flex min-h-6 items-center gap-1 text-sm leading-6 font-medium text-secondary-foreground transition-colors duration-150 hover:text-primary dark:text-text-secondary dark:hover:text-primary"
                      >
                        <span>{tFooter(link.id)}</span>
                        <IconArrowUpRight
                          className="size-3.5 shrink-0 stroke-[1.75] text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Tier 2: Inner Hairline + Bottom Legal & Utility Bar */}
          <div className="flex flex-col gap-5">
            <div className="h-px w-full bg-border-subtle" aria-hidden="true" />

            <div className="flex flex-col-reverse gap-4 text-xs leading-4 text-muted-foreground md:flex-row md:items-center md:justify-between">
              <p>
                <span className="md:hidden">{tFooter('copyrightMobile')}</span>
                <span className="hidden md:inline">{tFooter('copyright')}</span>
              </p>

              <div className="flex items-center justify-between gap-4 md:justify-end">
                <span className="font-mono text-xs leading-4 text-muted-foreground md:hidden lg:inline">
                  {SITE_CONFIG.domain}
                </span>

                <a
                  href="#top"
                  className="group inline-flex min-h-9 items-center gap-2 rounded-lg border border-border bg-secondary px-3 text-xs leading-4 font-medium text-text-secondary transition-colors duration-150 hover:border-muted-foreground/50 hover:text-foreground md:min-h-8 dark:bg-card"
                >
                  <span>{tFooter('backToTop')}</span>
                  <IconArrowUp
                    className="size-3.5 shrink-0 stroke-[1.75] transition-transform duration-150 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
