import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthCtxProvider } from './context/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthCtxProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </AuthCtxProvider>
);
