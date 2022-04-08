import './App.css';

import { Box, Button, Link } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';

import { SocketContext } from './contexts/socket';

function App() {
  const [name, setName] = useState('No');

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.emit('authenticate');
    socket.on('auth_callback', () => {});
  });

  console.log(location.search);

  return (
    <Box>
      MEHE
      <Link href="http://localhost:3001/auth/spotify">Log In With Spotify</Link>
    </Box>
  );
}

export default App;
