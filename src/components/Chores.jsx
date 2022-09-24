import React, { useState, useEffect } from "react";
import ChoreTable from "./ChoreTable.jsx";

import { db } from "../firebase-config.js";
import { collection, onSnapshot } from "firebase/firestore";
// import 'react-big-calendar/lib/css/react-big-calendar.css';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

function Chores() {
  const [isBusy, setBusy] = useState(true);
  const [choreData, setChoreData] = useState([]);

  const choresCollectionRef = collection(db, "chores");

  useEffect(() => {
    // get all chore data from database
    let unsub;
    const getChoreData = async () => {
      // onSnapshot listens to firebase for changes
      unsub = onSnapshot(choresCollectionRef, (collection) => {
        setChoreData(
          collection.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      });
    };
    getChoreData();
    setBusy(false);

    // useEffect cleanup function
    return () => {
      unsub(); // disable onSnapshot
      setBusy(true);
    };
  }, []);

  // add chore to table
  // const addChore = async (e) => {
  //   e.preventDefault(); // prevent page refresh

  //   // error check for empty first or last name
  //   if (newChore.length == 0) {
  //     alert("Must include chore");
  //     return;
  //   }

  //   // set up fields to add to attendance collection
  //   const fields = {
  //     chore: newChore,
  //     status: "yes",
  //   };

  //   await addDoc(collection(db, "chores"), fields);

  //   // reset values and close form
  //   setNewChore("");
  //   set3ChoreForm(false);
  // };

  const cancelForm = () => {
    setShowChoreForm(false);
    setNewChore("");
  };

  return (
    <div>
      <div>
        <h1 className="chores-header"> Chores </h1>
      </div>
      {!isBusy && (
        <div>
          <ChoreTable choreData={choreData} />
        </div>
      )}
    </div>
  );
}

export default Chores;
