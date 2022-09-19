import React from "react";
import { useEffect, useState } from "react";
import "./css/Dashboard.css";
import moment from "moment";

// components
import NavBar from "../components/NavBar.jsx";
import DashAlerts from "../components/DashAlerts.jsx";
import UpcomingShift from "../components/UpcomingShift";

// database
import { collection, onSnapshot } from "@firebase/firestore";
import { db } from "../firebase-config";

import { useUser } from "../context/UserProvider.jsx";

function Dashboard() {
  const { user } = useUser();
  const [busy, setBusy] = useState(true);
  const [events, setEvents] = useState([]);
  const eventsCollectionRef = collection(db, "events");

  useEffect(() => {
    let unsub;
    const getEvents = async () => {
      unsub = onSnapshot(eventsCollectionRef, (collection) => {
        setEvents(
          collection.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            start: doc.data().start.toDate(),
            end: doc.data().end.toDate(),
            type: doc.data().type,
            shiftVolunteers: doc.data().shiftVolunteers,
            backupVolunteers: doc.data().backupVolunteers,
          }))
        );
      });
    };
    getEvents();
    setBusy(false);

    return () => {
      unsub();
      setBusy(true);
    };
  }, []);

  return (
    <div>
      {!busy && (
        <>
          <NavBar />
          <div id="dash">
            <h2 className="greeting">Hello {user.displayName}</h2>
            <UpcomingShift events={events} />
            <div className="modules">
              <h4>
                Alerts
                <div className="info">
                  <DashAlerts />
                </div>
              </h4>
            </div>
            <div className="modules">
              <h4>
                Available Shifts
                <p className="info">List of Available shifts</p>
              </h4>
            </div>
            <hr />
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
