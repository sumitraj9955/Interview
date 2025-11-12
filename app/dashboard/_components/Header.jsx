"use client";
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

function Header() {
  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className='flex p-4 items-center justify-between bg-slate-200 shadow-sm'>
      <Image src={'/logo.svg'} width={50} height={50} alt='logo' />
      <ul className='flex gap-6'>
        <li className={`hover:text-purple-500 hover:font-bold transition-all cursor-pointer
          ${path === '/dashboard' && 'text-purple-400 font-bold'}
        `}>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li className={`hover:text-purple-500 hover:font-bold transition-all cursor-pointer
          ${path === '/dashboard/questions' && 'text-purple-400 font-bold'}
        `}>
          <Link href="/dashboard/questions">Question</Link>
        </li>
        <li className={`hover:text-purple-500 hover:font-bold transition-all cursor-pointer
          ${path === '/dashboard/upgrade' && 'text-purple-400 font-bold'}
        `}>
          <Link href="/dashboard/upgrade">Upgrade</Link>
        </li>
        <li className={`hover:text-purple-500 hover:font-bold transition-all cursor-pointer
          ${path === '/dashboard/learn-more' && 'text-purple-400 font-bold'}
        `}>
          <Link href="/dashboard/learn-more">Learn more</Link>
        </li>
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
