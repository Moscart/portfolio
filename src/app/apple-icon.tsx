import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

/**
 * Generates the 180x180 PNG Apple Touch Icon matching the "D." white and orange favicon.
 */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0B0C0E',
      }}
    >
      <svg width="144" height="144" viewBox="0 0 64 64" fill="none">
        <path
          d="M15 20H25.5C32.4036 20 37.5 25.0964 37.5 32C37.5 38.9036 32.4036 44 25.5 44H15V20ZM21.5 25.5V38.5H25.2C29.066 38.5 31 35.933 31 32C31 28.067 29.066 25.5 25.2 25.5H21.5Z"
          fill="#FFFFFF"
        />
        <circle cx="45.5" cy="39.5" r="5" fill="#F97316" />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
