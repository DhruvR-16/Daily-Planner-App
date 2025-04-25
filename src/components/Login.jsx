import React from "react";
import { useState } from "react";

function Login({ onLogin }) {
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');

  const Submit = (e) => {
    e.preventDefault();
    if (username === 'user' && password === '1234') {
      onLogin({ username });
    } else {
      alert('Invalid credentials!');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={Submit}
        className="p-8 bg-white rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl mb-6 font-bold text-center">Login</h1>
        <input
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
         className="bg-blue-600 border border-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-800 block mx-auto"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}



export default Login

