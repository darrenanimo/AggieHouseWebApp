import React from "react";
import { useState } from "react";

// firestore
import { doc, updateDoc } from "@firebase/firestore";
import { db } from "../firebase-config";

// images
import editButton from "../images/pencil-edit-button.svg";

export const AttendanceNotesForm = ({ val }) => {
  const [notes, setNotes] = useState("");
  const [noteForm, toggleNoteForm] = useState(false);

  const submitNote = async () => {
    await updateDoc(doc(db, "attendance", val.id), { notes: notes });
    setNotes("");
    toggleNoteForm(false);
  };

  return (
    <div>
      {!noteForm && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <p
            style={{
              wordBreak: "break-word",
              whiteSpace: "normal",
              marginLeft: "10px",
              textAlign: "left",
            }}
          >
            {val.notes}
          </p>
          <button
            style={{
              width: "30px",
              height: "30px",
              marginLeft: "auto",
              marginRight: "10px",
              border: "none",
              backgroundColor: "#FAF9F8",
            }}
            onClick={() => toggleNoteForm(true)}
          >
            <img src={editButton} height="15px"></img>
          </button>
        </div>
      )}
      {noteForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitNote(val);
          }}
        >
          <input
            autoFocus
            type="text"
            onChange={(e) => {
              setNotes(e.target.value);
            }}
            defaultValue={val.notes}
          />
          <div>
            <input type="submit" />
            <button onClick={() => toggleNoteForm(!noteForm)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};
