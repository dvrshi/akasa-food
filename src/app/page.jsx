import Store from '../components/Store.jsx';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export default async function Home() {
  const session = await getServerSession(authOptions);
  // console.log(session);
  return (
    <div>
      <Store session={session}/>
    </div>
  );
}