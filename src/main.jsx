/* import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthCtxProvider } from './context/AuthContext'
import { ChatCtxProvider } from './context/ChatContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthCtxProvider>
    <ChatCtxProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ChatCtxProvider>
  </AuthCtxProvider>
);
