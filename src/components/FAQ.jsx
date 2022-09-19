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

const FAQInfo = ({ deleteState }) => {
  // const [edit, toggleEdit] = useState(false);
  const { users, userFirebaseData } = useUser();
  const [faqData, setFAQData] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newFAQForm, setNewFAQForm] = useState(false);
  // const [questionSubmittedMsg, setQuestonSubmittedMsg] = useState("");
  // const [answerSubmittedMsg, setAnswerSubmittedMsg] = useState("");

  const FAQsCollectionRef = collection(db, "faqs");

  const isAdmin = () => {
    return userFirebaseData?.role === "admin";
  };

  useEffect(() => {
    let unsub;
    const getFAQs = async () => {
      // onSnapshot listens to firebase for changes
      unsub = onSnapshot(FAQsCollectionRef, (collection) => {
        setFAQData(
          collection.docs.map((doc) => ({
            id: doc.id,
            Question: doc.data().Question,
            Answer: doc.data().Answer,
          }))
        );
      });
    };
    getFAQs();
  }, []);

  const addFAQ = async (e) => {
    e.preventDefault();

    const fields = {
      Question: newQuestion,
      Answer: newAnswer,
    };

    await addDoc(collection(db, "faqs"), fields);

    setNewQuestion("");
    setNewAnswer("");
    setNewFAQForm(false);
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

  const deleteFAQ = async (faqs) => {
    await deleteDoc(doc(db, "faqs", faqs.id));
  };

  // const confirmDelete = () => {
  //   }
  // };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div className="body">
        {faqData?.map((faq) => {
          return (
            <div style={{ marginTop: "10px" }}>
              <h3>
                Q: {faq.Question}
                {deleteState && (
                  <button
                    className="deleteButton"
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete entry " +
                            faq.Question +
                            "?"
                        )
                      )
                        deleteFAQ(faq);
                    }}
                  >
                    Delete
                  </button>
                )}
              </h3>
              <p>
                <b>A:</b> {faq.Answer}
              </p>
            </div>
          );
        })}
        {isAdmin() && !newFAQForm && (
          <button
            className="addButton"
            onClick={() => {
              setNewFAQForm(true);
            }}
          >
            Add FAQ
          </button>
        )}
        {isAdmin() && newFAQForm && (
          <form onSubmit={addFAQ}>
            <input
              autoFocus
              className="inputText"
              type="text"
              placeholder="Question"
              onChange={(e) => {
                setNewQuestion(e.target.value);
              }}
            />
            <input
              type="text"
              className="inputText"
              placeholder="Answer"
              onChange={(e) => {
                setNewAnswer(e.target.value);
              }}
            />
            <div style={{ display: "flex" }}>
              <input className="submitButton" type="submit" />
              <button
                className="submitButton"
                onClick={() => {
                  setNewFAQForm(false);
                  setNewQuestion("");
                  setNewAnswer("");
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

export default FAQInfo;
