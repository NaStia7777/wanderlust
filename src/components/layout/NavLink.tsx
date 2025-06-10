import React from 'react';
import { Link } from 'react-router-dom';
import { useActiveRoute } from '../../hooks/useActiveRoute';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

export function NavLink({ to, children }: NavLinkProps) {
  const { isActive } = useActiveRoute();
  
  return (
    <Link
      to={to}
      className={`transition-colors ${
        isActive(to)
          ? 'text-blue-600 font-medium'
          : 'text-gray-600 hover:text-blue-600'
      }`}
    >
      {children}
    </Link>
  );
}