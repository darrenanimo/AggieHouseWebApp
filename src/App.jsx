import React from "react";
import "./App.css";

// import pages
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import ManageUsers from "./pages/ManageUsers";
import Missing from "./pages/Missing";
import Redirecting from "./pages/Redirecting";
import RequireAuth from "./components/RequireAuth";
import Resources from "./pages/Resources";
import ShowCalendar from "./pages/Calendar";
import Todo from "./pages/Todo";
import Unauthorized from "./pages/Unauthorized";
import Lock from "./pages/Locker";
import Alerts from "./pages/Alerts"

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />}></Route>
        <Route path="redirecting" element={<Redirecting />}></Route>
        <Route path="unauthorized" element={<Unauthorized />}></Route>
        {/* private routes */}
        <Route element={<RequireAuth allowedRoles={["admin", "volunteer"]} />}>
          <Route path="" element={<Dashboard />}></Route>
          <Route path="calendar" element={<ShowCalendar />}></Route>
          <Route path="attendance" element={<Attendance />}></Route>
          <Route path="todo" element={<Todo />}></Route>
          <Route path="resources" element={<Resources />}></Route>
          <Route path="account" element={<Account />}></Route>
          <Route path="lock" element={<Lock />}></Route>
          <Route path="alerts" element={<Alerts />}></Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="admin" element={<Admin />}></Route>
          <Route path="manageusers" element={<ManageUsers />}></Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
