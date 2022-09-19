import React, { useState, useCallback, useEffect, useRef } from "react";
import NavBar from "../components/NavBar.jsx";

import { useUser } from "../context/UserProvider";

import { db } from "../firebase-config.js";
import {
  collection,
  doc,
  updateDoc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "./css/Calendar.css";

// components
import CalendarEventInfo from "../components/CalendarEventInfo.jsx";

const localizer = momentLocalizer(moment);
const DragandDropCalendar = withDragAndDrop(Calendar);

function showCalendar() {
  const [modalState, setModalState] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(undefined);
  const [myEvents, setEvents] = useState([]);
  const [busy, setBusy] = useState(true);

  const eventsCollectionRef = collection(db, "events");
  const bottomRef = useRef(null);

  const { userFirebaseData } = useUser();

  const isAdmin = () => {
    return userFirebaseData?.role === "admin";
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [modalState]);

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

  // click on an event
  const eventSelection = (events) => {
    setSelectedEvent(events);
    setModalState(true);
  };

  // creating a new event
  const slotSelection = useCallback(
    ({ start, end }) => {
      if (isAdmin()) {
        const title = window.prompt("New Event Name:");
        if (title) {
          const addEvent = async () => {
            await addDoc(eventsCollectionRef, {
              title: title,
              start: start,
              end: end,
              type: "shift",
              shiftVolunteers: [{}],
              backupVolunteers: [{}],
            });
          };
          addEvent();
        } else {
          //display error
          if (title === "") alert("Error: Empty title!");
        }
      }
    },
    [setEvents]
  );

  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      if (isAdmin()) {
        const { allDay } = event;
        if (!allDay && droppedOnAllDaySlot) {
          event.allday = true;
          setSelectedEvent((prev) => ({ ...prev, allday: true }));
        }

        const updateEvent = async () => {
          await updateDoc(doc(db, "events", event.id), {
            start: start,
            end: end,
          });
          setSelectedEvent((prev) => ({ ...prev, start: start, end: end }));
        };
        updateEvent();
      }
    },
    [setEvents]
  );

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      if (isAdmin()) {
        const updateEvent = async () => {
          await updateDoc(doc(db, "events", event.id), {
            start: start,
            end: end,
          });
          setSelectedEvent((prev) => ({ ...prev, start: start, end: end }));
        };
        updateEvent();
      }
    },
    [setEvents]
  );

  return (
    <div>
      {!busy && (
        <div>
          <NavBar />
          <h1 className="calendar-header"> Calendar </h1>
          <div className="calendar-container">
            <DragandDropCalendar
              style={{ backgroundColor: "#FAF9F9" }}
              localizer={localizer}
              defaultView={Views.WEEK}
              events={myEvents}
              defaultDate={moment().toDate()}
              onSelectEvent={(e) => eventSelection(e)}
              onSelectSlot={slotSelection}
              selectable
              onEventDrop={moveEvent}
              onEventResize={resizeEvent}
              popup
              resizable
              showMultiDayTimes
            />
            {selectedEvent && modalState && (
              <CalendarEventInfo
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                setModalState={setModalState}
              />
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      )}
    </div>
  );
}

export default showCalendar;
