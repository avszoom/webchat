import './App.css';
import { Users } from './Users';
import { SocketProvider } from './lib/SocketProvider';

function App() {
  return (
    <SocketProvider>
          <div className='container App-header'>
            <Users/>
          </div>
    </SocketProvider>
  );
}

export default App;
