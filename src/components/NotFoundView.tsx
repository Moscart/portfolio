'use client';

import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { IconArrowBackUp, IconArrowLeft, IconArrowUpRight } from '@tabler/icons-react';
import { Navbar } from '@/components/Navbar';
import { SiteFooter } from '@/components/sections/ContactFooterSection';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NAV_SECTIONS } from '@/lib/navigation';
import { SITE_CONFIG } from '@/lib/site-config';
import { cn } from '@/lib/utils';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function NotFoundView() {
  const t = useTranslations('notFound');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const requestedPath = pathname || '/';

  useEffect(() => {
    document.title = `${t('metaTitle')} | ${SITE_CONFIG.name}`;
  }, [locale, t]);

  const handleGoBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push('/');
  }, [router]);

  return (
    <div id="top" className="flex min-h-dvh flex-col bg-background text-foreground">
      <Navbar activeSection={null} basePath="/" />

      <main className="flex flex-1 items-center py-9 md:py-12 lg:py-16 2xl:py-20">
        <div className="w-full px-5 md:px-8 lg:px-16 2xl:px-0">
          <div className="mx-auto flex w-full max-w-[1008px] flex-col gap-7 md:gap-9 lg:gap-10 2xl:gap-12">
            {/* Status Eyebrow Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
              className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span className="h-[2px] w-4 rounded-[1px] bg-primary" aria-hidden="true" />
                <span className="font-mono text-[11px] leading-4 font-medium tracking-[0.8px] text-muted-foreground uppercase md:text-xs">
                  {t('eyebrow')}
                </span>
              </div>

              <div className="inline-flex h-8 w-fit items-center gap-2 rounded-full border border-border bg-secondary px-3 font-mono text-[11px] leading-4 font-medium text-text-secondary md:text-xs">
                <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <span>{t('statusPill')}</span>
              </div>
            </motion.div>

            {/* Editorial Split Hero & Dark Route Inspector */}
            <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_356px] lg:items-center lg:gap-9 2xl:grid-cols-[minmax(0,1fr)_392px] 2xl:gap-12">
              {/* Left Copy & Recovery Actions */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05, ease: EASE_OUT_EXPO }}
                className="flex flex-col gap-3.5 md:gap-4 lg:gap-5"
              >
                <p
                  aria-hidden="true"
                  className="font-display text-[64px] leading-none font-bold tracking-[-2.4px] text-foreground tabular-nums md:text-[72px] md:tracking-[-2.6px] lg:text-[76px] lg:tracking-[-2.8px] 2xl:text-[88px] 2xl:tracking-[-3.2px]"
                >
                  404<span className="text-primary">.</span>
                </p>

                <h1
                  id="not-found-heading"
                  className="font-display text-[28px] leading-[34px] font-bold tracking-[-0.7px] text-foreground md:text-[32px] md:leading-10 md:tracking-[-0.8px] 2xl:text-[36px] 2xl:leading-[44px] 2xl:tracking-[-0.9px]"
                >
                  {t('heading')}
                </h1>

                <p className="max-w-[540px] text-[15px] leading-6 text-text-body md:text-base md:leading-[26px] 2xl:text-lg 2xl:leading-7">
                  {t('description')}
                </p>

                <div className="flex flex-col gap-2.5 pt-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                  <Link
                    href="/"
                    className={cn(
                      buttonVariants({ variant: 'default' }),
                      'h-11 w-full rounded-lg px-5 text-[15px] font-semibold sm:w-auto',
                    )}
                  >
                    <IconArrowLeft className="size-4 stroke-[2]" aria-hidden="true" />
                    <span>{t('backHome')}</span>
                  </Link>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoBack}
                    className="h-11 w-full cursor-pointer rounded-lg border-border bg-card px-[18px] text-[15px] font-medium text-foreground hover:bg-secondary sm:w-auto"
                  >
                    <IconArrowBackUp className="size-4 stroke-[1.75]" aria-hidden="true" />
                    <span>{t('goBack')}</span>
                  </Button>
                </div>
              </motion.div>

              {/* Always-Dark Route Inspector Card (echoes Contact Anchor Card) */}
              <motion.aside
                aria-label={t('inspectorTitle')}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: EASE_OUT_EXPO }}
                className="flex flex-col gap-3.5 rounded-2xl border border-[#27272A] bg-[#18181B] p-5 text-[#FAFAFA] md:gap-4 md:p-6 dark:border-[#3F3F46]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-[2px] w-3 rounded-[1px] bg-primary" aria-hidden="true" />
                    <span className="font-mono text-[11px] leading-4 font-medium tracking-[0.8px] text-[#A1A1AA] uppercase">
                      {t('inspectorTitle')}
                    </span>
                  </div>

                  <span className="inline-flex items-center rounded-md border border-[#3F3F46] bg-[#27272A] px-2 py-0.5 font-mono text-[11px] leading-3.5 font-semibold text-[#FF7A3D] tabular-nums">
                    404
                  </span>
                </div>

                <div className="flex items-center gap-2.5 rounded-[10px] border border-[#27272A] bg-[#111113] px-3.5 py-2.5 font-mono text-xs md:text-[13px]">
                  <span className="shrink-0 font-semibold text-[#FF7A3D]">GET</span>
                  <code title={requestedPath} className="min-w-0 truncate text-[#FAFAFA]">
                    {requestedPath}
                  </code>
                </div>

                <div className="h-px w-full bg-[#27272A]" aria-hidden="true" />

                <dl className="flex flex-col gap-2.5 font-mono text-[11px] leading-4 md:gap-3 md:text-xs">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[#8B8B95]">{t('inspectorStatusKey')}</dt>
                    <dd className="font-medium text-[#FF7A3D]">{t('inspectorStatusValue')}</dd>
                  </div>

                  <div className="hidden items-center justify-between gap-4 md:flex">
                    <dt className="text-[#8B8B95]">{t('inspectorHostKey')}</dt>
                    <dd className="text-[#E4E4E7]">{SITE_CONFIG.domain}</dd>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[#8B8B95]">{t('inspectorFallbackKey')}</dt>
                    <dd>
                      <Link
                        href="/"
                        className="font-medium text-[#22C55E] underline-offset-4 transition-colors hover:text-[#4ADE80] hover:underline"
                      >
                        {t('inspectorFallbackValue')}
                      </Link>
                    </dd>
                  </div>
                </dl>
              </motion.aside>
            </div>

            {/* Quick Destinations Section */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.14, ease: EASE_OUT_EXPO }}
              className="flex flex-col gap-4 lg:gap-5"
            >
              <Separator className="bg-border-subtle" />

              <h2 className="font-mono text-[11px] leading-4 font-medium tracking-[0.8px] text-muted-foreground uppercase">
                {t('quickDestinations')}
              </h2>

              <ul
                role="list"
                className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-3.5 lg:grid-cols-4 lg:gap-4"
              >
                {NAV_SECTIONS.map((item, idx) => (
                  <li key={item.id}>
                    <Link
                      href={`/${item.href}`}
                      className="group flex h-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3.5 transition-colors duration-150 hover:border-primary/40 hover:bg-secondary/60 md:flex-col md:items-start md:justify-start md:gap-2 md:px-[18px] md:py-4"
                    >
                      {/* Mobile compact row vs Tablet/Desktop stacked card header */}
                      <div className="hidden w-full items-center justify-between md:flex">
                        <span
                          className={cn(
                            'font-mono text-[11px] leading-4 font-medium tabular-nums transition-colors',
                            idx === 0
                              ? 'text-primary dark:text-accent-foreground'
                              : 'text-muted-foreground group-hover:text-primary dark:group-hover:text-accent-foreground',
                          )}
                        >
                          {item.index}
                        </span>
                        <IconArrowUpRight
                          className="size-4 shrink-0 stroke-[1.75] text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="flex flex-col gap-0.5 md:gap-1.5">
                        <span className="font-display text-[15px] leading-5 font-bold tracking-[-0.2px] text-foreground md:text-base md:leading-[22px]">
                          <span className="mr-1.5 font-mono text-xs font-medium text-muted-foreground tabular-nums md:hidden">
                            {item.index} ·
                          </span>
                          {tNav(item.id)}
                        </span>
                        <span className="text-[13px] leading-[18px] text-text-body">
                          {t(`destinations.${item.id}`)}
                        </span>
                      </div>

                      <IconArrowUpRight
                        className="size-4 shrink-0 stroke-[1.75] text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary md:hidden"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </main>

      <SiteFooter basePath="/" />
    </div>
  );
}
