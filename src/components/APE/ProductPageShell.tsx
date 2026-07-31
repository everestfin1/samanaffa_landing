import { Footer } from '@/components/APE/Footer';
import { Header as ApeHeader } from '@/components/APE/Header';
import PeeHeader from '@/components/PEE/Header';

type ProductPageShellProps = {
  product: 'ape' | 'pee';
  children: React.ReactNode;
};

export default function ProductPageShell({ product, children }: ProductPageShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      {product === 'ape' ? <ApeHeader /> : <PeeHeader />}
      <main className="flex-1">{children}</main>
      <Footer isApe={product === 'ape'} />
    </div>
  );
}
