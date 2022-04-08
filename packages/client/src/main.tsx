import './index.css';

import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { socket, SocketContext } from './contexts/socket';

ReactDOM.render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </SocketContext.Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
