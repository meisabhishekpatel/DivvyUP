import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import NavBar from './Components/NavBar';
import SignUp from './Components/SignUp';
import Home from './Screens/Home';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
      </div>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
