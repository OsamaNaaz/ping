import logo from './logo.svg';
import './App.css';
import Home from './Home/Home.js';
import { theme } from './theme.js';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const root = document.documentElement;
    const rootStyle = document.querySelector(':root');
    rootStyle.style.setProperty('height','100%')
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, []);
  return (
    <Home></Home>
  );
}

export default App;
