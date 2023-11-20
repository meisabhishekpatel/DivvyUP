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
import Individual from './Pages/Individual/Individual';
import Friends from './Pages/Friends/Friends';
import { QueryClient,QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      staleTime:3600000
    }
  }
})
function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
          element={
            <div className=''>
              <Dashboard />
              <GroupDetail />
            </div>
          }
        />
        <Route
          path='/addgroup'
          element={
            <div className=''>
              <Dashboard />
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
        <Route
          path='/individual'
          element={
            <>
            <Dashboard />
            <Individual />
            </>
          }
        />
        <Route
          path='/friends'
          element={
            <div className=''>
              <Dashboard />
              <Friends />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
