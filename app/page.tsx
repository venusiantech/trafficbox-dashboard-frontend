import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to the English locale by default
  redirect('/en');
}
