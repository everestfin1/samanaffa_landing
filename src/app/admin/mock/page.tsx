import { redirect } from 'next/navigation';

export default function MockIndexPage() {
  redirect('/admin/mock/canvas');
}
