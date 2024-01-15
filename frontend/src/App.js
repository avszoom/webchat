import './App.css';
import { Users } from './Users';
import { PeerProvider } from './lib/PeerProvider';

function App() {
  return (
    <PeerProvider>
          <div className='container App-header'>
            <Users/>
          </div>
    </PeerProvider>
  );
}

export default App;
