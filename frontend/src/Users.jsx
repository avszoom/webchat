import { useEffect, useRef, useState } from 'react';
import { Call } from './Call';
import { usePeer } from './lib/PeerProvider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

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
                    <div className='mt-20'>
                    <Stack direction="row" spacing={2}>
                        <Item>
                            <div className='text-2xl font-bold mt-6 '>Online Users</div>
                            {users && users.map((user) => (
                                <div className=""> 
                                <List key={user} sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                    <button onClick={() => createCall(user)}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                        </ListItemAvatar>
                                        <ListItemText
                                        primary={user}
                                        secondary={
                                            <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                Call {user}
                                            </Typography>
                                            {" — he is online"}
                                            </React.Fragment>
                                        }
                                        />
                                    </ListItem>
                                    </button>
                                    <Divider variant="inset" component="li" />
                            </List>
                            </div>
                            ))}
                    
                        <div className='text-2xl font-bold underline mt-6 ml-40'>
                            <Button variant="contained" onClick={refreshList}>Refresh</Button>
                            </div>
                    </Item>
                    </Stack>   
                    <div className='mt-20'> 
                        <video width="800" height="340" controls ref={videoRefRec}></video>
                    </div>   
                    </div>       
            )
    )
    )
}