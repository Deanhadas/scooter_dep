import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useNavigate  } from 'react-router-dom';

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
}


const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      console.log("WWWOOOOOOWWW front")
      const response = await axios.post('http://localhost:3000/login/', {
      username,
      password,
    });
    if (response.status === 200) {
      // Redirect to the Home page
      navigate('/home');
    }



    } catch (error) {
      console.error(error);
    }

    onSubmit(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;