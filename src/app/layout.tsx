import "./globals.css";

export const metadata = {
  title: "YouBike Locator",
  description: "Quickly find the closest YouBike near you!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
