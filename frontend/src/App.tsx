import React, { useState } from 'react';
import { BrowserRouter } from "react-router-dom";
import AppWrapper from './AppWrapper';
import { UserContext } from './components/UserContext';
import "antd/dist/antd.css";


const App: React.FC = () => {
  const [user, setUser] = useState<{
    userId: string;
    token: string;
  }>({
    userId: '',
    token: ''
  })
  const login = (userId: string | null, token: string | null) => {
    if(userId && token)
    setUser({
      userId: userId,
      token: token
    });
  }
  const logout =() => {
    setUser({
      userId: '',
      token: ''
    });
  }

  return (
    <BrowserRouter>
      <UserContext.Provider value={{
        login,
        logout,
        token: user.token,
        userId: user.userId,
      }}>
        <AppWrapper />
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
