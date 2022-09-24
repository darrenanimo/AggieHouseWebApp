import React, { useState, useEffect } from "react";
import "./css/Locker.css";
import NavBar from "../components/NavBar.jsx";

import { db } from "../firebase-config.js";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";

function Lock() {
  const [newCode, setNewCode] = useState(0);
  const [currCode, setCurrCode] = useState({}); // current code with id

  useEffect(() => {
    getDocs(collection(db, "codes")).then((snapShot) => {
      snapShot.docs.forEach((doc) => {
        setCurrCode({ ...doc.data(), id: doc.id });
      });
    });
  }, []);

  const handleRandomNum = () => {
    setNewCode(Math.floor(1000 + Math.random() * 9000));
  };

  const setManualNum = (event) => {
    setNewCode(event.target.value);
  };

  const updateCode = async () => {
    const code = doc(db, "codes", currCode.id);
    const newFields = { combination: newCode };
    await updateDoc(code, newFields);
    setCurrCode((prev) => ({ ...prev, combination: newCode }));
  };

  return (
    <main>
      <NavBar />
      <div style={{ margin: "15px" }}>
        <p>Current locker code: {currCode.combination}</p>
        <label htmlFor="lock-code">Locker Code:</label>
        <input
          className="inputText"
          type="number"
          id="lock-code"
          name="lock-code"
          onChange={setManualNum}
          value={newCode}
          max="9999"
        />
        <div>
          <button onClick={handleRandomNum} className="button">
            Generate New Code
          </button>
          <br />
          <button onClick={updateCode} className="button">
            Save New Code
          </button>
        </div>
      </div>
    </main>
  );
}
export default Lock;
