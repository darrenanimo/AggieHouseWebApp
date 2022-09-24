import React from "react";

import NavBar from "../components/NavBar";
import { Outlet, Link } from "react-router-dom";

import "./css/Admin.css";

function Admin() {
  return (
    <div>
      <NavBar />
      <div style={{ display: "flex", flexDirection: "column", margin: "15px" }}>
        <h2> Admin Management</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "fit-content",
          }}
        >
          <Link to="/manageusers">
            <button className="adminButton">Manage Users</button>
          </Link>
          <Link to="/lock">
            <button className="adminButton">Manage Locker Code</button>
          </Link>
          <Link to="/alerts">
            <button className="adminButton">Manage Alerts</button>
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default Admin;
