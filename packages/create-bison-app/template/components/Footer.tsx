import { Logo } from './Logo';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex flex-col justify-center items-center mt-auto py-4">
      <Logo />
      <em className="text-center">
        Copyright Ⓒ {year} <a href="https://echobind.com">Echobind LLC.</a> All rights reserved.
      </em>
    </footer>
  );
}
