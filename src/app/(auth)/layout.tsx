import { FC, ReactNode } from 'react';
//Sign Up Form
interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return <div className='text-white border p-10 rounded-md bg-zinc-800'>{children}</div>;
};

export default AuthLayout;
