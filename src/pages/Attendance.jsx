import React from "react";
import NavBar from "../components/NavBar.jsx";
import "./css/Attendance.css";
import { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { db } from "../firebase-config";
import { useEffect } from "react";
import AttendanceTable from "../components/AttendanceTable.jsx";
import AttendanceResidentForm from "../components/AttendanceResidentForm.jsx";

function Attendance() {
  const [isBusy, setBusy] = useState(true);
  const [deleteState, toggleDeleteState] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceSubmittedMsg, setAttendanceSubmittedMsg] = useState("");
  const [date, setDate] = useState("");
  const [newDate, setNewDate] = useState("");

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
    setDate(new Date().toLocaleDateString());
    setNewDate(new Date().toLocaleDateString());
    getAttendanceData();
    setBusy(false);

    // useEffect cleanup function
    return () => {
      unsub(); // disable onSnapshot
      setBusy(true);
    };
  }, []);

  // helper function: returns current date in format yyyy-MM-dd
  const currentDate = () => {
    var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = new Date(Date.now() - tzoffset)
      .toISOString()
      .slice(0, -1)
      .split("T")[0];
    return localISOTime;
  };

  // submit attendance data of currently selected date
  // checks if there's already a submission for current date, then deletes it
  // adds new submission with current date
  const submitAttendanceData = async () => {
    setAttendanceSubmittedMsg("Submitting...");
    const q = query(
      collection(db, "attendanceArchive"),
      where("date", "==", date)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((document) => {
        updateDoc(doc(db, "attendanceArchive", document.id), {
          residents: attendanceData,
          date: date,
        })
          .then(() => {
            console.log("attendance data updated");
          })
          .catch((err) => {
            console.error(err);
          });
      });
    } else {
      addDoc(collection(db, "attendanceArchive"), {
        residents: attendanceData,
        date: date,
      })
        .then(() => {
          console.log("attendance data added!");
        })
        .catch((err) => {
          console.error(err);
        });
    }
    setAttendanceSubmittedMsg("Submitted!");
  };

  // change the attendance table to chosen date
  const changeDate = async (e) => {
    e.preventDefault();
    let submittedDate = new Date(
      newDate.replace(/-/g, "/")
    ).toLocaleDateString();
    setDate(submittedDate);

    // query the database for submittedDate
    if (submittedDate != date) {
      const q = query(
        collection(db, "attendanceArchive"),
        where("date", "==", submittedDate)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((document) => {
          setAttendanceData(document.data().residents);
        });
      } else {
        setAttendanceData([]);
      }
    }
  };

  return (
    <div>
      <NavBar />
      {!isBusy && (
        <>
          <form onSubmit={changeDate}>
            <label htmlFor="date-picker" style={{ margin: "10px" }}>
              View past attendance:{" "}
            </label>
            <input
              className="inputField"
              id="date-picker"
              type="date"
              defaultValue={currentDate()}
              onChange={(e) => setNewDate(e.target.value)}
              min="2022-01-01"
              max="2100-01-01"
            />
            <input className="submitDate" type="submit" />
          </form>
          <div>
            <h2 style={{ marginLeft: "30px", color: "#545454" }}>{date}</h2>
            <AttendanceTable
              attendanceData={attendanceData}
              deleteState={deleteState}
            />
          </div>
          <div className="submission">
            <span style={{ marginRight: "10px" }}>
              {attendanceSubmittedMsg}
            </span>
            <button onClick={submitAttendanceData} id="submit-button">
              Submit
            </button>
          </div>
        </>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "130px",
          marginTop: "10px",
        }}
      >
        <AttendanceResidentForm />
        <button
          className="optionButtons"
          style={{ marginTop: "5px" }}
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
