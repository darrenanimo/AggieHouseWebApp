import React from "react";
import "../pages/css/Attendance.css";

// firestore
import { doc, updateDoc, deleteDoc } from "@firebase/firestore";
import { db } from "../firebase-config";

//components
import { AttendanceNotesForm } from "./AttendanceNotesForm";
import AttendancePresenceButton from "./AttendancePresenceButton";

const AttendanceTable = ({ attendanceData, deleteState }) => {
  const deleteResident = async (resident) => {
    await deleteDoc(doc(db, "attendance", resident.id));
  };

  return (
    <div className="attendance-sheet">
      <table>
        <thead>
          <tr>
            <th>Resident Name</th>
            <th>Present</th>
            <th>Known Absence</th>
            <th>Unknown Absence</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData?.map((val, key) => {
            return (
              <tr key={key}>
                <td>
                  {val.givenName} {val.familyName}
                </td>
                <td>
                  <AttendancePresenceButton
                    resident={val}
                    presence={"present"}
                  />
                </td>
                <td>
                  <AttendancePresenceButton
                    resident={val}
                    presence={"excused"}
                  />
                </td>
                <td>
                  <AttendancePresenceButton
                    resident={val}
                    presence={"unexcused"}
                  />
                </td>
                <td>
                  <AttendanceNotesForm val={val} />
                </td>
                {deleteState && (
                  <td>
                    <button
                      onClick={() => {
                        deleteResident(val);
                      }}
                    >
                      Delete Resident
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
