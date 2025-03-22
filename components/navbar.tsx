'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';

const Navbar = () => {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Libros', href: '/libros' },
    { name: 'Préstamos', href: '/prestamos' },
    { name: 'Usuarios', href: '/usuarios' },
  ];

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 font-bold text-xl">
            <Link href="/">Sistema Biblioteca</Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-primary-foreground text-primary'
                      : 'hover:bg-primary-foreground/10'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;