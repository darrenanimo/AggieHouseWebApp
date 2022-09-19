import React, { useState, useEffect } from "react";

import { db } from "../firebase-config";
import {
  collection,
  deleteDoc,
  doc,
  addDoc,
  onSnapshot,
} from "@firebase/firestore";

import "../pages/css/Locker.css";

const AdminDashAlerts = ({ deleteState }) => {
  const [alertData, setAlertData] = useState([]);
  const [newAlert, setNewAlert] = useState("");
  const [newAlertForm, setNewAlertForm] = useState(false);

  const AlertsCollectionRef = collection(db, "alerts");

  useEffect(() => {
    let unsub;
    const getAlerts = async () => {
      // onSnapshot listens to firebase for changes
      unsub = onSnapshot(AlertsCollectionRef, (collection) => {
        setAlertData(
          collection.docs.map((doc) => ({
            id: doc.id,
            message: doc.data().message,
          }))
        );
      });
    };
    getAlerts();

    return () => {
      unsub();
    };
  }, []);

  const addAlert = async (e) => {
    e.preventDefault();

    if (!newAlert) {
      alert("Error: empty alert message");
      return;
    }

    const fields = {
      message: newAlert,
    };

    await addDoc(collection(db, "alerts"), fields);

    setNewAlert("");
    setNewAlertForm(false);
  };

  const deleteAlert = async (alerts) => {
    await deleteDoc(doc(db, "alerts", alerts.id));
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div>
        {alertData?.map((alert) => {
          return (
            <div style={{ marginTop: "10px" }}>
              <p>
                Alert Message: {alert.message}{" "}
                {deleteState && (
                  <button
                    style={{ marginBottom: "10px" }}
                    className="mini-button"
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete entry " +
                            alert.message +
                            "?"
                        )
                      )
                        deleteAlert(alert);
                    }}
                  >
                    Delete
                  </button>
                )}
              </p>
            </div>
          );
        })}
        {!newAlertForm && (
          <button
            className="mini-button"
            style={{ marginTop: "7.5px" }}
            onClick={() => {
              setNewAlertForm(true);
            }}
          >
            Add alert
          </button>
        )}
        {newAlertForm && (
          <form onSubmit={addAlert}>
            <input
              className="inputText"
              autoFocus
              type="text"
              placeholder="Message"
              onChange={(e) => {
                setNewAlert(e.target.value);
              }}
            />

            <div style={{ display: "flex" }}>
              <input className="mini-button" type="submit" />
              <button
                className="mini-button"
                onClick={() => {
                  setNewAlertForm(false);
                  setNewAlert("");
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

export default AdminDashAlerts;
