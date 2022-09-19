import React, { useState, useEffect } from "react";

import { db } from "../firebase-config";
import { useUser } from "../context/UserProvider";

import {
  collection,
  deleteDoc,
  doc,
  addDoc,
  onSnapshot,
} from "@firebase/firestore";

import "../pages/css/Resources.css";

const BoardInfo = ({ deleteState }) => {
  const { users, userFirebaseData } = useUser();
  const [boardData, setBoardData] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [newContactForm, setNewContactForm] = useState(false);

  const contactCollectionRef = collection(db, "contacts");

  const isAdmin = () => {
    return userFirebaseData?.role === "admin";
  };

  useEffect(() => {
    let unsub;
    const getBoard = async () => {
      // onSnapshot listens to firebase for changes
      unsub = onSnapshot(contactCollectionRef, (collection) => {
        setBoardData(
          collection.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            email: doc.data().email,
            number: doc.data().number,
            position: doc.data().position,
          }))
        );
      });
    };
    getBoard();
  }, []);

  const addContact = async (e) => {
    e.preventDefault();

    const fields = {
      name: newName,
      email: newEmail,
      number: newNumber,
      position: newPosition,
    };

    await addDoc(collection(db, "contacts"), fields);

    setNewName("");
    setNewEmail("");
    setNewNumber("");
    setNewPosition("");
    setNewContactForm(false);
  };

  // const submitQuestion = async (e) => {
  //   e.preventDefault();
  //   await updateDoc(doc(db, "faqs", faqs.id), { Question: newQuestion });
  //   setQuestionSubmittedMsg("Question submitted!");
  // };

  // const submitAnswer = async (e) => {
  //   e.preventDefault();
  //   await updateDoc(doc(db, "faqs", faqs.id), { Answer: newAnswer });
  //   setQuestionSubmittedMsg("Question submitted!");
  // };

  const deleteContact = async (contacts) => {
    await deleteDoc(doc(db, "contacts", contacts.id));
  };

  console.log(boardData);

  return (
    <div className="body">
      <div>
        {boardData?.map((contact, key) => {
          return (
            <div key={key} className="contact">
              <h2>
                {contact.position}
                {deleteState && (
                  <button
                    className="deleteButton"
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete entry " +
                            contact.name +
                            "?"
                        )
                      )
                        deleteContact(contact);
                    }}
                  >
                    Delete
                  </button>
                )}
              </h2>
              <b className="field">Name:</b> {contact.name}{" "}<br />
              <b className="field">Email:</b> {contact.email}{" "}<br />
              <b className="field">Phone Number:</b> {contact.number}<br />
            </div>
          );
        })}
        {isAdmin() && !newContactForm && (
          <button
            className="addButton"
            onClick={() => {
              setNewContactForm(true);
            }}
          >
            Add Contact
          </button>
        )}
        {isAdmin() && newContactForm && (
          <form onSubmit={addContact}>
            <input
              autoFocus
              className="inputText"
              type="text"
              placeholder="Name"
              onChange={(e) => {
                setNewName(e.target.value);
              }}
            />
            <input
              type="text"
              className="inputText"
              placeholder="Email"
              onChange={(e) => {
                setNewEmail(e.target.value);
              }}
            />
            <input
              type="text"
              className="inputText"
              placeholder="Phone Number"
              onChange={(e) => {
                setNewNumber(e.target.value);
              }}
            />
            <input
              type="text"
              className="inputText"
              placeholder="Position"
              onChange={(e) => {
                setNewPosition(e.target.value);
              }}
            />
            <div style={{ display: "flex" }}>
              <input className="submitButton" type="submit" />
              <button
                className="submitButton"
                onClick={() => {
                  setNewContactForm(false);
                  setNewName("");
                  setNewEmail("");
                  setNewPosition("");
                  setNewNumber("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BoardInfo;
