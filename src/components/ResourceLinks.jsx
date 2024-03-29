import React, { useState, useEffect } from "react";

import { db } from "../firebase-config";
import {
  collection,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  onSnapshot,
} from "@firebase/firestore";
import { useUser } from "../context/UserProvider";

import "../pages/css/Resources.css";

const ResourceLinks = ({ deleteState }) => {
  // const [edit, toggleEdit] = useState(false);
  const { users, userFirebaseData } = useUser();
  const [resourcesData, setResourcesData] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newResourcesForm, setNewResourcesForm] = useState(false);
  // const [questionSubmittedMsg, setQuestonSubmittedMsg] = useState("");
  // const [answerSubmittedMsg, setAnswerSubmittedMsg] = useState("");

  const resourcesCollectionRef = collection(db, "resourceLinks");

  const isAdmin = () => {
    return userFirebaseData?.role === "admin";
  };

  useEffect(() => {
    let unsub;
    const getResources = async () => {
      // onSnapshot listens to firebase for changes
      unsub = onSnapshot(resourcesCollectionRef, (collection) => {
        setResourcesData(
          collection.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            url: doc.data().url,
          }))
        );
      });
    };
    getResources();
  }, []);

  const addResources = async (e) => {
    e.preventDefault();

    const fields = {
      title: newTitle,
      url: newLink,
    };

    await addDoc(collection(db, "resourceLinks"), fields);

    setNewTitle("");
    setNewLink("");
    setNewResourcesForm(false);
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

  const deleteResources = async (resources) => {
    await deleteDoc(doc(db, "resourceLinks", resources.id));
  };

  // const confirmDelete = () => {
  //   }
  // };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div className="body">
        {resourcesData?.map((resource) => {
          return (
            <div style={{ marginTop: "10px" }}>
                <ul>
                  <li className='list'><u><a className='link' href={resource.url} target='_blank'>{resource.title}</a></u>
                {deleteState && (
                  <button
                    className="deleteButton"
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete this Tutorial?"
                        )
                      )
                        deleteResources(resource);
                    }}
                  >
                    Delete
                  </button>
                )}</li>
              </ul>
            </div>
          );
        })}
        {isAdmin() && !newResourcesForm && (
          <button
            className="addButton"
            onClick={() => {
              setNewResourcesForm(true);
            }}
          >
            Add Resource
          </button>
        )}
        {isAdmin() && newResourcesForm && (
          <form onSubmit={addResources}>
            <input
              autoFocus
              className="inputText"
              type="text"
              placeholder="Title"
              onChange={(e) => {
                setNewTitle(e.target.value);
              }}
            />
            <input
              type="text"
              className="inputText"
              placeholder="Link"
              onChange={(e) => {
                setNewLink(e.target.value);
              }}
            />
            <div style={{ display: "flex" }}>
              <input className="submitButton" type="submit" />
              <button
                className="submitButton"
                onClick={() => {
                  setNewResourcesForm(false);
                  setNewTitle("");
                  setNewLink("");
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

export default ResourceLinks;
