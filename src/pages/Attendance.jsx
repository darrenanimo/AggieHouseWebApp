import React from "react";
import NavBar from "../components/NavBar.jsx";
import "./css/Attendance.css";
import { useState } from "react";
import { addDoc, collection, onSnapshot } from "@firebase/firestore";
import { db } from "../firebase-config";
import { useEffect } from "react";
import AttendanceTable from "../components/AttendanceTable.jsx";

function Attendance() {
  const [isBusy, setBusy] = useState(true);
  const [showResidentForm, setShowResidentForm] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [residentGivenName, setResidentGivenName] = useState("");
  const [residentFamilyName, setResidentFamilyName] = useState("");
  const [deleteState, toggleDeleteState] = useState(false);

  const attendanceCollectionRef = collection(db, "attendance");

  useEffect(() => {
    // get all attendance data from database
    let unsub;
    const getAttendanceData = async () => {
      // onSnapshot listens to firebase for changes
      unsub = onSnapshot(attendanceCollectionRef, (collection) => {
        setAttendanceData(
          collection.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      });
    };
    getAttendanceData();
    setBusy(false);

    // useEffect cleanup function
    return () => {
      unsub(); // disable onSnapshot
      setBusy(true);
    };
  }, []);

  const submitAttendanceData = () => {
    console.log("SUBMITTING DATA");
  };

  // add resident to table
  const addResident = async (e) => {
    e.preventDefault(); // prevent page refresh on form submit

    // error check for empty first or last name
    if (residentFamilyName.length == 0 || residentGivenName.length == 0) {
      alert("Must include first and last name");
      return;
    }

    // set up fields to add to attendance collection
    const fields = {
      familyName: residentFamilyName,
      givenName: residentGivenName,
      notes: "",
      presence: "present",
    };

    await addDoc(collection(db, "attendance"), fields);

    // reset values and close form
    setResidentFamilyName("");
    setResidentGivenName("");
    setShowResidentForm(false);
  };

  const cancelForm = () => {
    setShowResidentForm(false);
    setResidentFamilyName("");
    setResidentGivenName("");
  };

  return (
    <div>
      <NavBar />
      {!isBusy && (
        <>
          <div>
            <AttendanceTable
              attendanceData={attendanceData}
              deleteState={deleteState}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginRight: "30px",
            }}
          >
            <button onClick={submitAttendanceData} id="submit-button">
              Submit
            </button>
          </div>
        </>
      )}
      <div style={{ display: "flex", flexDirection: "column", width: "130px" }}>
        {!showResidentForm && (
          <button
            onClick={() => {
              setShowResidentForm(true);
            }}
          >
            Add Resident
          </button>
        )}
        {showResidentForm && (
          <form onSubmit={addResident}>
            <input
              autoFocus
              type="text"
              placeholder="First Name"
              onChange={(e) => {
                setResidentGivenName(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Last Name"
              onChange={(e) => {
                setResidentFamilyName(e.target.value);
              }}
            />
            <div style={{ display: "flex" }}>
              <input type="submit" />
              <button onClick={cancelForm}>Cancel</button>
            </div>
          </form>
        )}
        <button
          style={{ marginTop: "10px" }}
          onClick={() => {
            toggleDeleteState(!deleteState);
          }}
        >
          Delete Residents
        </button>
      </div>
    </div>
  );
}

export default Attendance;
