import Image from 'next/image';
import { PlusCircleIcon, UserGroupIcon, HeartIcon, PaperAirplaneIcon, MenuIcon } from '@heroicons/react/outline';
import { HomeIcon } from '@heroicons/react/solid';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Search from './Search';

type Props = {
  setOpen?: (value: boolean) => void;
};

export default function Header({ setOpen }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const open = () => {
    if (setOpen) setOpen(true);
  };

  return (
    <div className='shadow-sm border-b bg-white sticky top-0 z-50'>
      <div className='flex justify-between max-w-6xl mx-5 lg:mx-auto'>
        <div onClick={() => router.push('/')} className='relative hidden lg:inline-grid w-24 cursor-pointer'>
          <Image
            alt='logo'
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2880px-Instagram_logo.svg.png'
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div onClick={() => router.push('/')} className='relative lg:hidden w-10 flex-shrink-0 cursor-pointer'>
          <Image
            src='https://1000logos.net/wp-content/uploads/2017/02/insta-logo.png'
            fill
            style={{ objectFit: 'contain' }}
            alt='logo'
          />
        </div>
        <Search />
        <div className='flex items-center justify-end space-x-4'>
          <HomeIcon className='navBtn' onClick={() => router.push('/')} />
          <MenuIcon className='h-6 md:hidden cursor-pointer' />
          {session ? (
            <>
              <div className='relative navBtn'>
                <PaperAirplaneIcon className='navBtn rotate-45' />
                <div className='absolute -top-1 -right-2 text-xs w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse text-white'>
                  1
                </div>
              </div>
              <PlusCircleIcon className='navBtn' onClick={open} />
              <UserGroupIcon className='navBtn' />
              <HeartIcon className='navBtn' />
              <img
                onClick={() => signOut({ redirect: false })}
                src={session?.user?.image as string}
                alt='user image'
                className='h-10 w-10 rounded-full cursor-pointer'
              />
            </>
          ) : (
            <button onClick={() => signIn()}>Sign In</button>
          )}
        </div>
      </div>
    </div>
  );
}
