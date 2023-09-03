import "./App.css";
import Home from "./Pages/Home";
import { Routes, Route } from 'react-router'

function App() {
  return (
    <Routes>
      <Route path='/' element={<login/>} />
      <Route path='/home' element={<Home/>} />
    </Routes> 
  );
}

export default App;
