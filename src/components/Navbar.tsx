import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { signOut } from 'next-auth/react';
import UserAccount from './UserAccount';

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className='bg-black py-4  w-full mb-12'>
      <div className='container flex items-center justify-between'>
        <Link href='/user'>
          <ShoppingCart color="#ffffff" />
        </Link>

        <Link href='/'>
          <h1 className='text-white size-lg'>
            Akasa Foods
          </h1>
        </Link>
        {session?.user ? (
          <UserAccount />
        ) : (
          <Link className='bg-orange-600 px-2 py-1 text-white rounded-md' href='/sign-in'>
            Sign in
          </Link>
        )}
      </div>
    </div >
  );
};

export default Navbar;
