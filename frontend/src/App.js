import './App.css';
import { Users } from './Users';
import { PeerProvider } from './lib/PeerProvider';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

function App() {
  return (
    <PeerProvider>
          <Container maxWidth="sm">
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                 
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  VideoChat
                </Typography>
                <Button color="inherit">Settings</Button>
              </Toolbar>
            </AppBar>
          </Box>
            <Users/>
          </Container>
    </PeerProvider>
  );
}

export default App;
