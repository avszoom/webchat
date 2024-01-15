import { useEffect, useState } from 'react';
import { usePeer } from './lib/PeerProvider';

export function Call({remoteUser}) {
    const {peer, peerId} = usePeer();
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
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        getUserMedia({video: true, audio: true}, function(stream) {
            var call = peer.call(remoteUserId, stream);
            call.on('stream', function(remoteStream) {
                // Show stream in some video/canvas element.
                console.log('received remotestream');
            });
        }, function(err) {
        console.log('Failed to get local stream' ,err);
        });
    }

    return <div>
            Calling {remoteUser}
        </div>
}