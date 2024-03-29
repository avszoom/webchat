import React, { createContext, useContext, useEffect, useState } from 'react';
import Peer from 'peerjs';

const PeerContext = createContext();

export const usePeer = () => useContext(PeerContext);

export const PeerProvider = ({ children }) => {
    const [peer, setPeer] = useState(null);
    const [peerId,setPeerId] = useState(null);
    let initialConnection = false;
    useEffect(() => {
        if(!initialConnection) {
            const peer = new Peer('acd' + Math.floor(Math.random() * (9 - 1 + 1) + 1),{
                    host: 'localhost',
                    port: 3000,
                    path: '/peerjs',
                });
            peer.on('open', (id) => {
                console.log("my id",id);
                console.log("my id",peer.id);
                setPeerId(id);
            });
            setPeer(peer);
            initialConnection = true;
            // return () => {
            //     // Cleanup code
            //     peer.disconnect();
            // };
        }
    }, []);

    return (
        <PeerContext.Provider value={{peer, peerId}}>
            {children}
        </PeerContext.Provider>
    );
};