'use client';
import { signOut } from 'next-auth/react';
import { Button} from './ui/button';


function UserAccount() {
    return (
        <div><Button onClick={() => signOut()} variant={'destructive'}>Sign Out</Button></div>
    )
}

export default UserAccount