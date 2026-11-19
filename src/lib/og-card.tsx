import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { SITE_CONFIG } from './site-config';

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const OG_IMAGE_CONTENT_TYPE = 'image/png' as const;

const TECH_PILLS = ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn UI'] as const;

async function loadProfileOgDataUri(): Promise<string | null> {
  try {
    const buffer = await readFile(join(process.cwd(), 'public', 'images', 'daniel-profile-og.jpg'));
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
  } catch {
    return null;
  }
}

/**
 * Generates the 1200x630 Open Graph / Twitter social preview card matching
 * the redesigned obsidian dark aesthetic (#09090B) and Brand Orange (#F54900).
 */
export async function createOgCardResponse(): Promise<ImageResponse> {
  const avatarSrc = await loadProfileOgDataUri();

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#09090B',
        backgroundImage:
          'radial-gradient(circle at 88% 18%, rgba(245, 73, 0, 0.22) 0%, rgba(9, 9, 11, 0) 48%)',
        padding: '56px 64px',
        color: '#FAFAFA',
        fontFamily: 'sans-serif',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              backgroundColor: '#18181B',
              border: '2px solid #27272A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
              <path
                d="M15 20H25.5C32.4036 20 37.5 25.0964 37.5 32C37.5 38.9036 32.4036 44 25.5 44H15V20ZM21.5 25.5V38.5H25.2C29.066 38.5 31 35.933 31 32C31 28.067 29.066 25.5 25.2 25.5H21.5Z"
                fill="#FAFAFA"
              />
              <circle cx="45.5" cy="39.5" r="5" fill="#F54900" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '20px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#FAFAFA',
              }}
            >
              {SITE_CONFIG.name}
            </span>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#FF7A3D',
                marginTop: '4px',
              }}
            >
              {SITE_CONFIG.role}
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 18px',
            borderRadius: '999px',
            backgroundColor: '#18181B',
            border: '1px solid #27272A',
            fontSize: '15px',
            fontWeight: 600,
            color: '#E4E4E7',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '999px',
              backgroundColor: '#22C55E',
            }}
          />
          <span>Surakarta, ID (UTC+7)</span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '48px',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: avatarSrc ? '730px' : '980px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: '60px',
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: '#FAFAFA',
            }}
          >
            <span>Clean frontend architecture</span>
            <span>
              for fast, modern web apps<span style={{ color: '#F54900' }}>.</span>
            </span>
          </div>
          <p
            style={{
              marginTop: '20px',
              marginBottom: 0,
              fontSize: '23px',
              lineHeight: 1.45,
              color: '#A1A1AA',
            }}
          >
            {SITE_CONFIG.description}
          </p>
        </div>

        {avatarSrc && (
          <div
            style={{
              display: 'flex',
              padding: '8px',
              borderRadius: '28px',
              backgroundColor: '#18181B',
              border: '2px solid #27272A',
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt={SITE_CONFIG.name}
              width={236}
              height={236}
              style={{
                borderRadius: '20px',
                objectFit: 'cover',
              }}
            />
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingTop: '24px',
          borderTop: '1px solid #27272A',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {TECH_PILLS.map((tech) => (
            <div
              key={tech}
              style={{
                display: 'flex',
                padding: '8px 16px',
                borderRadius: '10px',
                backgroundColor: '#18181B',
                border: '1px solid #27272A',
                fontSize: '16px',
                fontWeight: 600,
                color: '#E4E4E7',
              }}
            >
              {tech}
            </div>
          ))}
        </div>

        <span
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#A1A1AA',
          }}
        >
          PT Daya Rekadigital Indonesia
        </span>
      </div>
    </div>,
    {
      ...OG_IMAGE_SIZE,
    },
  );
}
