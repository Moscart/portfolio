import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { CORE_STACK_ITEMS } from './portfolio-data';
import { SITE_CONFIG } from './site-config';

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const OG_IMAGE_CONTENT_TYPE = 'image/png' as const;

export type OgCardTheme = 'light' | 'dark';

interface OgPalette {
  bg: string;
  surface: string;
  pillBg: string;
  border: string;
  divider: string;
  fg: string;
  body: string;
  muted: string;
  pillText: string;
  stackText: string;
  accent: string;
  accentText: string;
  green: string;
  portraitBg: string;
}

const OG_PALETTES: Record<OgCardTheme, OgPalette> = {
  light: {
    bg: '#FFFFFF',
    surface: '#F7F7F8',
    pillBg: '#F7F7F8',
    border: '#E4E4E7',
    divider: '#E4E4E7',
    fg: '#09090B',
    body: '#52525B',
    muted: '#71717A',
    pillText: '#27272A',
    stackText: '#18181B',
    accent: '#F54900',
    accentText: '#C2410C',
    green: '#22C55E',
    portraitBg: '#EFEFF1',
  },
  dark: {
    bg: '#09090B',
    surface: '#111113',
    pillBg: '#18181B',
    border: '#27272A',
    divider: '#27272A',
    fg: '#FAFAFA',
    body: '#A1A1AA',
    muted: '#8B8B95',
    pillText: '#E4E4E7',
    stackText: '#FAFAFA',
    accent: '#F54900',
    accentText: '#FF7A3D',
    green: '#22C55E',
    portraitBg: '#18181B',
  },
};

const OG_FONT_SPECS = [
  { name: 'Bricolage Grotesque', file: 'BricolageGrotesque-Bold.ttf', weight: 700 as const },
  { name: 'Plus Jakarta Sans', file: 'PlusJakartaSans-Regular.ttf', weight: 400 as const },
  { name: 'Plus Jakarta Sans', file: 'PlusJakartaSans-Medium.ttf', weight: 500 as const },
  { name: 'Plus Jakarta Sans', file: 'PlusJakartaSans-SemiBold.ttf', weight: 600 as const },
  { name: 'JetBrains Mono', file: 'JetBrainsMono-Regular.ttf', weight: 400 as const },
  { name: 'JetBrains Mono', file: 'JetBrainsMono-Medium.ttf', weight: 500 as const },
] as const;

type LoadedFont = {
  name: string;
  data: Buffer;
  style: 'normal';
  weight: 400 | 500 | 600 | 700;
};

interface LoadedOgAssets {
  avatarSrc: string | null;
  fonts: LoadedFont[];
}

let cachedAssetsPromise: Promise<LoadedOgAssets> | null = null;

function loadOgAssets(): Promise<LoadedOgAssets> {
  if (!cachedAssetsPromise) {
    cachedAssetsPromise = (async () => {
      const publicDir = join(process.cwd(), 'public');

      const avatarPromise = readFile(join(publicDir, 'images', 'daniel-profile-og.jpg'))
        .then((buf) => `data:image/jpeg;base64,${buf.toString('base64')}`)
        .catch(() => null);

      const fontsPromise = Promise.all(
        OG_FONT_SPECS.map(async (spec): Promise<LoadedFont | null> => {
          try {
            const data = await readFile(join(publicDir, 'fonts', spec.file));
            return {
              name: spec.name,
              data,
              style: 'normal',
              weight: spec.weight,
            };
          } catch {
            return null;
          }
        }),
      ).then((items) => items.filter((item): item is LoadedFont => item !== null));

      const [avatarSrc, fonts] = await Promise.all([avatarPromise, fontsPromise]);
      return { avatarSrc, fonts };
    })();
  }
  return cachedAssetsPromise;
}

/**
 * Generates the 1200x630 Open Graph / Twitter social preview card matching
 * the FigCraft "OpenGraph & Social Previews" Swiss Editorial design.
 */
export async function createOgCardResponse(theme: OgCardTheme = 'light'): Promise<ImageResponse> {
  const { avatarSrc, fonts } = await loadOgAssets();
  const palette = OG_PALETTES[theme];
  const stackLine = CORE_STACK_ITEMS.join(' · ');

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: palette.bg,
        color: palette.fg,
        fontFamily: 'Plus Jakarta Sans, sans-serif',
      }}
    >
      {/* Top 4px Brand Orange Signature Rule */}
      <div
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: palette.accent,
          display: 'flex',
          flexShrink: 0,
        }}
      />

      {/* Safe-Zone Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          width: '100%',
          padding: '40px 56px',
        }}
      >
        {/* Top Bar + Divider */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {/* Brand Wordmark & Domain */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontSize: '24px',
                  fontWeight: 700,
                  lineHeight: '28px',
                  letterSpacing: '-0.5px',
                  color: palette.fg,
                }}
              >
                <span>{SITE_CONFIG.brandName}</span>
                <span style={{ color: palette.accent }}>.</span>
              </div>

              <div
                style={{
                  width: '1px',
                  height: '18px',
                  backgroundColor: palette.divider,
                  display: 'flex',
                }}
              />

              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  color: palette.muted,
                }}
              >
                {SITE_CONFIG.domain}
              </span>
            </div>

            {/* Availability Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 16px 8px 14px',
                borderRadius: '999px',
                backgroundColor: palette.pillBg,
                border: `1px solid ${palette.border}`,
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '999px',
                  backgroundColor: palette.green,
                  display: 'flex',
                }}
              />
              <span
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  color: palette.pillText,
                }}
              >
                Available for remote roles
              </span>
            </div>
          </div>

          <div
            style={{
              width: '100%',
              height: '1px',
              backgroundColor: palette.divider,
              display: 'flex',
            }}
          />
        </div>

        {/* Main Asymmetric Editorial Split */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '48px',
            width: '100%',
          }}
        >
          {/* Left Editorial Column */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
              flex: 1,
            }}
          >
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '24px',
                  height: '3px',
                  borderRadius: '2px',
                  backgroundColor: palette.accent,
                  display: 'flex',
                }}
              />
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '13px',
                  fontWeight: 500,
                  lineHeight: '18px',
                  letterSpacing: '1px',
                  color: palette.accentText,
                }}
              >
                LEAD FRONTEND ENGINEER · SURAKARTA, ID
              </span>
            </div>

            {/* Display Headline */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontSize: '54px',
                fontWeight: 700,
                lineHeight: '60px',
                letterSpacing: '-1.5px',
                color: palette.fg,
              }}
            >
              <span>Clean frontend architecture</span>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span>for fast, modern web apps</span>
                <span style={{ color: palette.accent }}>.</span>
              </div>
            </div>

            {/* Subtitle */}
            <p
              style={{
                margin: 0,
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '20px',
                fontWeight: 400,
                lineHeight: '30px',
                color: palette.body,
                maxWidth: '690px',
              }}
            >
              Specializing in React, Next.js, and TypeScript—turning complex product systems and
              Figma designs into fast, maintainable UI.
            </p>
          </div>

          {/* Right Identity Portrait Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              width: '316px',
              padding: '18px',
              borderRadius: '20px',
              backgroundColor: palette.surface,
              border: `1px solid ${palette.border}`,
              flexShrink: 0,
            }}
          >
            {avatarSrc && (
              <div
                style={{
                  display: 'flex',
                  width: '280px',
                  height: '224px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  backgroundColor: palette.portraitBg,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarSrc}
                  alt={SITE_CONFIG.name}
                  width={280}
                  height={224}
                  style={{
                    width: '280px',
                    height: '224px',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '18px',
                  fontWeight: 600,
                  lineHeight: '24px',
                  letterSpacing: '-0.2px',
                  color: palette.fg,
                }}
              >
                {SITE_CONFIG.name}
              </span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                  fontWeight: 400,
                  lineHeight: '16px',
                  color: palette.muted,
                }}
              >
                Surakarta, Indonesia · UTC+7
              </span>
            </div>

            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: palette.divider,
                display: 'flex',
              }}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                  fontWeight: 500,
                  lineHeight: '16px',
                  color: palette.stackText,
                }}
              >
                3+ yrs exp
              </span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                  fontWeight: 500,
                  lineHeight: '16px',
                  color: palette.accentText,
                }}
              >
                B.Sc. 3.95 GPA
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Metadata Strip */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: '100%',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '1px',
              backgroundColor: palette.divider,
              display: 'flex',
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                  fontWeight: 500,
                  lineHeight: '16px',
                  letterSpacing: '0.9px',
                  color: palette.muted,
                }}
              >
                CORE STACK
              </span>
              <span
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  lineHeight: '20px',
                  color: palette.stackText,
                }}
              >
                {stackLine}
              </span>
            </div>

            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '13px',
                fontWeight: 500,
                lineHeight: '18px',
                color: palette.muted,
              }}
            >
              github.com/Moscart
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      ...OG_IMAGE_SIZE,
      fonts,
    },
  );
}
