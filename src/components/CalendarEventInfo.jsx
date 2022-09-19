import React, { useState } from "react";
import editButton from "../images/pencil-edit-button.svg";
import moment from "moment";
import { deleteDoc, doc, updateDoc } from "@firebase/firestore";
import { db } from "../firebase-config";
import { useUser } from "../context/UserProvider";
import CalendarAssignVolunteer from "./CalendarAssignVolunteer";
import CalendarAssignBackup from "./CalendarAssignBackup";

function CalendarEventInfo({ selectedEvent, setSelectedEvent, setModalState }) {
  const [titleForm, setTitleForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [typeForm, setTypeForm] = useState(false);
  const [newType, setNewType] = useState("shift");

  const { userFirebaseData } = useUser();

  const isAdmin = () => {
    return userFirebaseData?.role === "admin";
  };

  const submitTitle = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "events", selectedEvent.id), { title: newTitle });
    setSelectedEvent({ ...selectedEvent, title: newTitle });
    setTitleForm(!titleForm);
  };

  const submitType = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "events", selectedEvent.id), { type: newType });
    setSelectedEvent({ ...selectedEvent, type: newType });
    setTypeForm(!typeForm);
    setNewType("shift");
  };

  const deleteEvent = async (id) => {
    if (isAdmin()) {
      // delete event from 'events'
      const eventDoc = doc(db, "events", id);
      await deleteDoc(eventDoc);
    }
  };

  return (
    <div className="modal">
      <div className="modalTitle">
        {titleForm ? (
          <form onSubmit={submitTitle}>
            <input
              autoFocus
              type="text"
              defaultValue={selectedEvent.title}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input type="submit" />
          </form>
        ) : (
          <div className="modalTitle">
            <span>{selectedEvent.title}</span>
            {isAdmin() && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setTitleForm(!titleForm);
                }}
                className="calendar-edit-button"
              >
                <img src={editButton} height="15px" />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="modalBody">
        <div>
          {typeForm ? (
            <form onSubmit={submitType}>
              <select
                name="type"
                id="type"
                onChange={(e) => {
                  setNewType(e.target.value);
                }}
              >
                <option value="shift">Shift</option>
                <option value="meeting">Meeting</option>
              </select>
              <input type="submit" />
            </form>
          ) : (
            <div>
              <span>Event type: {selectedEvent.type}</span>
              {isAdmin() && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setTypeForm(!typeForm);
                  }}
                  className="calendar-edit-button"
                >
                  <img src={editButton} height="15px" />
                </button>
              )}
            </div>
          )}
        </div>
        {selectedEvent.type === "shift" && (
          <div className="volunteers">
            <CalendarAssignVolunteer
              selectedEvent={selectedEvent}
              setSelectedEvent={setSelectedEvent}
            />
            <CalendarAssignBackup
              selectedEvent={selectedEvent}
              setSelectedEvent={setSelectedEvent}
            />
          </div>
        )}
        <br />

        <div id="display-times">
          <span>
            Start Time: {moment(selectedEvent.start).format("h:mma")} on{" "}
            {moment(selectedEvent.start).format("MMMM Do, YYYY")}
          </span>
          <span>
            End Time: {moment(selectedEvent.end).format("h:mma")} on{" "}
            {moment(selectedEvent.end).format("MMMM Do, YYYY")}
          </span>
        </div>
      </div>
      <br />
      <div className="modalFooter">
        <button
          className="modalButton"
          onClick={() => {
            setModalState(false);
          }}
        >
          Done
        </button>
        {isAdmin() && (
          <button
            className="modalButton"
            onClick={() => {
              deleteEvent(selectedEvent.id);
              setModalState(false);
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default CalendarEventInfo;
