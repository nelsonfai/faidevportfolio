import './globals.css';

export const metadata = {
  metadataBase: new URL('https://nelsonfai.space'),
  title: 'Nelson Fai',
  description: 'Full-stack engineer who also writes. Selected works, writing and experiments.',
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Nelson Fai',
    description: 'Full-stack engineer who also writes. Selected works, writing and experiments.',
    images: [{ url: '/og-image.png', width: 2236, height: 1606, alt: 'Original Nelson Fai portfolio hero artwork' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nelson Fai',
    description: 'Full-stack engineer who also writes. Selected works, writing and experiments.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
