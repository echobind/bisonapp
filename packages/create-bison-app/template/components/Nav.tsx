import Link from 'next/link';
import { Menu } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/NavigationMenu';

export function Nav() {
  return (
    <>
      <NavigationMenu className="sm:hidden block">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Menu />
              <span className="sr-only">Menu</span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink asChild>
                <Link href="/">Link 1</Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link href="/">Link 2</Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link href="/">Link 3</Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a href="https://github.com/echobind">Link 3</a>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <nav className="hidden sm:flex ml-auto items-center text-base gap-8">
        <Link href="/">Link 1</Link>

        <Link href="/#features">Link 2</Link>
        <Link href="/#tech">Link 3</Link>
        <a href="https://github.com/echobind/">External</a>
      </nav>
    </>
  );
}
