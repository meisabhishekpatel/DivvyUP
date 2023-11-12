import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import NavBar from './Components/NavBar';
import SignUp from './Components/SignUp';
import LandingPage from './Pages/LandingPage';
import Home from './Pages/Home';
import Dashboard from './Pages/DashBoard';
import Groups from './Pages/Groups';
import AddGroup from './Pages/Groups/Addgroup';
import GroupDetail from './Pages/Groups/GroupDetail';
import AddExpense from './Pages/Groups/AddExpense';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <div>
              <LandingPage />
            </div>
          }

        />
        <Route
          path='/home'
          element={
            <div className=''>
              <Dashboard />
              <Home />
            </div>
          }
        />
        <Route
          path='/groups'
          element={
            <div className=''>
              <Dashboard />
              <Groups />
            </div>
          }
        />
        <Route
          path="/group/detail/:groupId"
          element={<GroupDetail />}
        />
        <Route
          path="/group/:groupId/addexpense"
          element={<AddExpense />}
        />
        <Route
          path='/addgroup'
          element={
            <div className=''>
              <AddGroup />
            </div>
          }
        />
        <Route
          path='/login'
          element={
            <Login />
          }
        />
        <Route
          path='/signup'
          element={
            <SignUp />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
