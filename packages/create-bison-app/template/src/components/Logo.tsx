import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/">
      <span className="text-2xl font-bold text-gray-900">MyApp</span>
    </Link>
  );
}
