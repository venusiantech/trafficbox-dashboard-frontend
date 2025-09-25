export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

// This is a minimal root layout that simply renders its children
// It's needed because Next.js requires every page to be wrapped in a layout
// The actual layout functionality is handled by the [locale]/layout.tsx file
