import { useEffect, useState } from 'react';
import { Call } from './Call';
import { useSocket } from './lib/SocketProvider';

export function Users() {
    const [connectCall,setConnectCall] = useState(false);
    const [users,setUsers] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        if(socket) {
            socket.on('user_list', (users) => {
                console.log("got users client", users);
                setUsers(users.users);
            });
        }
    },[socket]);

    return (
        <>
            <div className='text-3xl font-bold underline'>User List</div>
            {
                <ul>
                    {users && users.map((user) => (
                        <li>{user}</li>
                    ))}
                </ul>
            }
            {
                connectCall ? <Call/> : <span/>
            }
        </>
    )
}