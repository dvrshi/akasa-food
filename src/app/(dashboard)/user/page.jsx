
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import LoadCartData from '@/app/(dashboard)/user/LoadCartData.jsx';
import LoadOrderHistory from '@/app/(dashboard)/user/LoadOrderHistory.jsx';
import ResetInventory from '@/app/(dashboard)/user/ResetInventory.jsx';
async function page() {

    const session = await getServerSession(authOptions);
    // console.log(session);
    if (session?.user.username === 'admin')
        return (
            <div>
                <ResetInventory session={session} />
            </div>
        );
    if (session?.user)
        return (
            <div className='w-full text-center'>
                Hey! {session?.user.username}
                <div className='flex justify-between'>
                    <div style={{ marginLeft: '25rem' }}>
                        <LoadOrderHistory session={session} />
                    </div>
                    <div style={{ marginRight: '25rem' }}>
                        <LoadCartData session={session} />
                    </div>
                </div>
            </div>

        )
    return (
        <div>Please login</div>
    );
}

export default page;
