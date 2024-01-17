import { useEffect, useRef, useState } from 'react';
import { Call } from './Call';
import { usePeer } from './lib/PeerProvider';

export function Users() {
    const [connectCall,setConnectCall] = useState(false);
    const [users,setUsers] = useState([]);
    const {peer, peerId} = usePeer();
    const [remoteUser,setRemoteUser] = useState(null);
    const videoRefRec = useRef();

    useEffect(() => {
        if(peerId) {
            fetch("http://localhost:3000/users/" + peerId)
                .then((res) => res.json())
                .then((data) => setUsers(data.users));
        }
        if(peer){
            let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            peer.on('call', function(call) {
                getUserMedia({video: true, audio: true}, function(stream) {
                    call.answer(stream); // Answer the call with an A/V stream.
                    call.on('stream', function(remoteStream) {
                        console.log("someone is calling");
                        console.log(videoRefRec);
                        addVideo(remoteStream);   
                    });
                }, function(err) {
                    console.log('Failed to get local stream' ,err);
                });
            });
        }
    },[peer, peerId]);

    function addVideo(remoteStream) {
        videoRefRec.current.srcObject = remoteStream;
        videoRefRec.current.addEventListener('loadedmetadata', () => { // Play the video as it loads
        videoRefRec.current.play() });
    }

    function createCall(user) {
        setRemoteUser(user);
        setConnectCall(true);
    }

    function refreshList() {
        if(peerId) {
            fetch("http://localhost:3000/users/" + peerId)
                .then((res) => res.json())
                .then((data) => setUsers(data.users));
        }
    }
    return (
            (
                connectCall ? <Call remoteUser={remoteUser}/>  : (
                    <>
                    <div className='text-3xl font-bold underline'><button onClick={refreshList}>Refresh User List</button></div>
                    <ul>
                        {users && users.map((user) => (
                            <li key={user}><button onClick={() => createCall(user)}>{user}</button></li>
                        ))}
                    </ul>
                    <br/>
                    <div style={{margin: '5px'}}>
                        <video width="700" height="340" controls ref={videoRefRec}></video>
                    </div>
                    </>        
            )
    )
    )
}