import { ReactNode } from 'react';

interface NewsLayoutProps {
  children: ReactNode;
}

export default function NewsLayout({ children }: NewsLayoutProps) {
  return (
    <div className="container 2xl:px-0 py-8 flex flex-col gap-6">
      {children}
    </div>
  );
} 