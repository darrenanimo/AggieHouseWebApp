import React, { useState } from "react";

import { db, storage } from "../firebase-config";
import { deleteDoc, doc, updateDoc } from "@firebase/firestore";

import { deleteObject, ref } from "firebase/storage";

import "./css/UserInfo.css";

// props: user is data from firebase
function UserInfo({ user }) {
  const [edit, toggleEdit] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [numberSubmittedMsg, setNumberSubmittedMsg] = useState("");
  const [roleSubmittedMsg, setRoleSubmittedMsg] = useState("");
  const [userDeletedMsg, setUserDeletedMsg] = useState("");
  const [userData, setUserData] = useState(user);
  const [show, setShow] = useState(true); // after delete user, don't show

  const submitNumber = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "users", userData.id), { phoneNumber: newNumber });
    setUserData((prev) => ({ ...prev, phoneNumber: newNumber }));
    setNumberSubmittedMsg("Number submitted!");
  };

  const submitRole = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "users", userData.id), { role: newRole });
    setUserData((prev) => ({ ...prev, role: newRole }));
    setRoleSubmittedMsg("Role submitted!");
  };

  // deletes user from database, removes pfp from storage
  const deleteUser = async () => {
    await deleteDoc(doc(db, "users", userData.id));
    try {
      const oldImageRef = ref(storage, userData.photoURL);
      deleteObject(oldImageRef)
        .then(() => {
          console.log("image delete success");
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
    // set delete success message
    setUserDeletedMsg("User Deleted!");
  };

  const confirmDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete user " + userData.displayName + "?"
      )
    ) {
      deleteUser();
      setShow(false);
    }
  };

  return (
    <div style={{ display: show ? "flex" : "none", alignItems: "center" }}>
      <img
        src={userData.photoURL}
        className="pfp"
        height="96px"
        width="96px"
        referrerPolicy="no-referrer"
      />
      <div className="user-card" style={{ marginLeft: "10px" }}>
        <p>
          Name: {userData.displayName} {userData.pronouns && "("}
          {userData.pronouns}
          {userData.pronouns && ")"}
        </p>
        <p>Email: {userData.email}</p>
        <p>Number: {userData.phoneNumber}</p>
        <p>Role: {userData.role}</p>
      </div>
      {!edit && (
        <button className="edit-button" onClick={() => toggleEdit(!edit)}>
          Edit
        </button>
      )}
      {edit && (
        <div>
          <div>
            <form onSubmit={submitNumber}>
              <label htmlFor="phone-number">Number: </label>
              <input
                id="phone-number"
                type="text"
                autoComplete="off"
                onChange={(e) => {
                  setNewNumber(e.target.value);
                }}
              />
              <input type="submit" />
              {numberSubmittedMsg && <span> {numberSubmittedMsg}</span>}
            </form>
          </div>
          <div>
            <form onSubmit={submitRole} id="role-form">
              <label htmlFor="role">Select Role: </label>
              <select
                form="role-form"
                name="role"
                id="role"
                onChange={(e) => {
                  setNewRole(e.target.value);
                }}
              >
                <option value="user">user (can't access site)</option>
                <option value="volunteer">volunteer</option>
                <option value="admin">admin</option>
              </select>
              <input type="submit" />
              {roleSubmittedMsg && <span> {roleSubmittedMsg}</span>}
            </form>
          </div>
          <br />
          <button
            onClick={() => {
              toggleEdit(!edit);
            }}
          >
            Close
          </button>
          <button style={{ color: "#FF0000" }} onClick={confirmDelete}>
            Delete User
          </button>
          {userDeletedMsg && <span>{userDeletedMsg}</span>}
        </div>
      )}
    </div>
  );
}

export default UserInfo;
