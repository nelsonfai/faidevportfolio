import './globals.css';

export const metadata = {
  title: 'Nelson Fai',
  description: 'Full-stack engineer who also writes. Selected works, writing and experiments.',
  icons: { icon: '/images/favicon.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
