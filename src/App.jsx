
import React, { useState } from 'react';
import Login from './components/Login.jsx';
import Sidebar from './components/Dashboard/sidebar.jsx';
import './index.css';

function App() {
  let [isLoggedIn,setLoggedIn] = useState(false)
  return (
    <>
    {!isLoggedIn?(
      <Login onLogin={setLoggedIn}/>
    ):<Sidebar/>}
    {/* <Sidebar/> */}
    </>
  );
}

export default App;

