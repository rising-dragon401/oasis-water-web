import { PropsWithChildren } from 'react';
import SubpageLayout from '@/components/home-layout';

export default async function BlogLayout({ children }: PropsWithChildren) {
  return (
    <SubpageLayout>
      <div className="md:px-8 px-3 py-3">{children}</div>
    </SubpageLayout>
  );
}
