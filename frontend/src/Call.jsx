import { useEffect, useRef } from 'react';
import { usePeer } from './lib/PeerProvider';
import Paper from '@mui/material/Paper';

export function Call({remoteUser}) {
    const {peer} = usePeer();
    const videoRef = useRef();
    let callInitiated = false;
    useEffect(() => {
        if(remoteUser && !callInitiated) {
            callInitiated = true;
            fetch("http://localhost:3000/getUserId/" + remoteUser)
                .then((res) => res.json())
                .then((data) => {
                    initiateCall(data.userId)
                });
        }
    },[]);

    function initiateCall(remoteUserId) {
        console.log(remoteUserId);
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        getUserMedia({video: true, audio: true}, function(stream) {
            var call = peer.call(remoteUserId[0], stream);
            console.log(remoteUserId[0]);
            call.on('stream', function(remoteStream) {
                // Show stream in some video/canvas element.
                videoRef.current.srcObject = remoteStream;
                videoRef.current.addEventListener('loadedmetadata', () => { // Play the video as it loads
                    videoRef.current.play()
                })
                console.log('received remotestream');
            });
        }, function(err) {
        console.log('Failed to get local stream' ,err);
        });
     };

    return <div className='mt-10'>
            <Paper elevation={3}>Calling {remoteUser} </Paper>
            <br></br>
            <div style={{margin: '5px'}}>
                <video width="700" height="340" controls ref={videoRef}></video>
            </div>
        </div>
}