import React from "react";
import { useState } from "react";

// firestore
import { doc, updateDoc } from "@firebase/firestore";
import { db } from "../firebase-config";

// images
import editButton from "../images/pencil-edit-button.svg";

//context
import { useUser } from "../context/UserProvider";

export const ChoresForm = ({ val }) => {
  const [chore, setChore] = useState("");
  const [choreForm, toggleChoreForm] = useState(false);

  const { userFirebaseData } = useUser();

  const isAdmin = () => {
    return userFirebaseData?.role === "admin";
  };

  const submitNote = async () => {
    await updateDoc(doc(db, "chores", val.id), { chore: chore });
    setChore("");
    toggleChoreForm(false);
  };

  return (
    <div>
      {!choreForm && (
        <>
          <p
            style={{
              wordBreak: "break-word",
              whiteSpace: "normal",
              marginLeft: "10px",
              textAlign: "left",
            }}
          >
            {val.chore}
          </p>
          {isAdmin() && (
            <button
              style={{
                border: "none",
                backgroundColor: "#FAF9F8",
              }}
              onClick={() => toggleChoreForm(true)}
            >
              <img src={editButton} height="15px"></img>
            </button>
          )}
        </>
      )}
      {choreForm && (
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
              setChore(e.target.value);
            }}
            defaultValue={val.chore}
          />
          <div>
            <input type="submit" />
            <button onClick={() => toggleChoreForm(!choreForm)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};
