
//import './App.css';
import { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter, Link } from "react-router-dom";

import './App.css';

import Register from './pages/Register'
import Home from './pages/Home'
import Login from './pages/Login'
import CustomRoute from "./routes/CustomRoute";

import Initial from "./pages/Initial";


import { useLoggedIn, useIsAuthInitialized } from './context/AuthContext'

function App() {
  const { isLoggedIn: login } = useLoggedIn();
  const {isInitialized} = useIsAuthInitialized();
  const isLoggedIn = () => {
    return login;
  }

  

  const isNotLoggedIn = () => {
    return !login;
  }

  const isNotInitialized = () => !isInitialized;

  const isReady = () => isInitialized;

  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/"
          exact
          element={
            <CustomRoute condition={isLoggedIn} onFailNavigateTo="/login"
              isReadyCheck={isReady} notReadyComponent={<Initial />}
            >
              <Home />
            </CustomRoute>
          }
        />
        <Route path="/login"
          exact
          element={
            <CustomRoute condition={isNotLoggedIn} onFailNavigateTo="/"
              isReadyCheck={isReady} notReadyComponent={<Initial />}
            >
              <Login />
            </CustomRoute>
          }
        />
        <Route path="/register"
          exact
          element={
            <CustomRoute condition={isNotLoggedIn} onFailNavigateTo="/"
              isReadyCheck={isReady} notReadyComponent={<Initial />}
            >
              <Register />
            </CustomRoute>
          }
        />
      </Routes>
    </BrowserRouter>


  );
}

export default App;
