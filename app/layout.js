import '../style/style.css';

export const metadata = {
  title: 'Portfolio Nelson Fai',
  description: 'Web development portfolio of Nelson Fai',
  icons: { icon: '/images/favicon.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
