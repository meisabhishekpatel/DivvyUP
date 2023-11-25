import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import Login from "./Components/Login";
import axios from "axios";
import NavBar from "./Components/NavBar";
import SignUp from "./Components/SignUp";
import LandingPage from "./Pages/LandingPage";
import Home from "./Pages/Home";
import Dashboard from "./Pages/DashBoard";
import Groups from "./Pages/Groups";
import AddGroup from "./Pages/Groups/Addgroup";
import GroupDetail from "./Pages/Groups/GroupDetail";
import Individual from "./Pages/Individual/Individual";
import Friends from "./Pages/Friends/Friends";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ExpenseReport from "./Pages/Individual/ExpenseReport";
import ExpenseGroupReport from "./Pages/Groups/ExpenseReport";
import FriendExpenseGroupReport from "./Pages/Friends/FriendExpenseReport";
import { ContactUs } from "./Components/EmailInput";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "./context/theme";
import ThemeBtn from "./Components/ThemeBtn";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3600000,
    },
  },
});

function App() {
  const [themeMode, setThemeMode] = useState("light");

  const lightTheme = () => {
    setThemeMode("light");
  };

  const darkTheme = () => {
    setThemeMode("dark");
  };

  // actual change in theme

  useEffect(() => {
    document.querySelector("html").classList.remove("light", "dark");
    document.querySelector("html").classList.add(themeMode);
  }, [themeMode]);

  return (
    <GoogleOAuthProvider clientId="979404826140-4kr357pq71slm1j1as2f2j9p4ifmi40r.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={{ themeMode, lightTheme, darkTheme }}>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <LandingPage />
                  </div>
                }
              />
              <Route
                path="/home"
                element={
                  <div className="">
                    <Dashboard />
                    <Home />
                  </div>
                }
              />
              <Route
                path="/groups"
                element={
                  <div className="">
                    <Dashboard />
                    <Groups />
                  </div>
                }
              />
              <Route
                path="/group/detail/:groupId"
                element={
                  <div className="">
                    <Dashboard />
                    <GroupDetail />
                  </div>
                }
              />
              <Route
                path="/addgroup"
                element={
                  <div className="">
                    <Dashboard />
                    <AddGroup />
                  </div>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/individual"
                element={
                  <>
                    <Dashboard />
                    <Individual />
                  </>
                }
              />
              <Route
                path="/expense/report/:id"
                element={
                  <>
                    <Dashboard />
                    <ExpenseReport />
                  </>
                }
              />
              <Route
                path="/groupexpense/report/:id"
                element={
                  <>
                    <Dashboard />
                    <ExpenseGroupReport />
                  </>
                }
              />
              <Route
                path="/friendexpense/report/:id"
                element={
                  <>
                    <Dashboard />
                    <FriendExpenseGroupReport />
                  </>
                }
              />
              <Route
                path="/email/:email/:name"
                element={
                  <>
                    <ContactUs />
                  </>
                }
              />
              <Route
                path="/friends"
                element={
                  <div className="">
                    <Dashboard />
                    <Friends />
                  </div>
                }
              />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
export default App;
