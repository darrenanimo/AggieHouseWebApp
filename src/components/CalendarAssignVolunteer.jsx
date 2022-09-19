import React, { useState } from "react";
import Select from "react-select";
import { useUser } from "../context/UserProvider";
import { doc, updateDoc } from "@firebase/firestore";
import { db } from "../firebase-config";

function CalendarAssignVolunteer({ selectedEvent, setSelectedEvent }) {
  const { users, userFirebaseData } = useUser();
  const [newAssignment, setNewAssignment] = useState({}); // store whole user
  const [showAddVolunteer, toggleAddVolunteer] = useState(false);

  const isAdmin = () => {
    return userFirebaseData?.role === "admin";
  };

  const isEmpty = (obj) => {
    return (
      obj &&
      Object.keys(obj).length === 0 &&
      Object.getPrototypeOf(obj) === Object.prototype
    );
  };

  // custom styling for react-select
  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      width: state.selectProps.width,
      borderBottom: "1px dotted pink",
      color: state.selectProps.menuColor,
      padding: 20,
    }),
    control: (provided, { selectProps: { width, height, fontSize } }) => ({
      ...provided,
      width: width,
      height: height,
    }),

    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = "opacity 300ms";

      return { ...provided, opacity, transition };
    },
  };

  // submit new assignment to 'events'
  const submitAssignment = async () => {
    if (isEmpty(newAssignment)) {
      alert("No user chosen!");
      return;
    }

    const alreadyExists = () => {
      for (let i = 0; i < selectedEvent.shiftVolunteers.length; i++) {
        if (selectedEvent.shiftVolunteers[i].id === newAssignment.id) {
          return true;
        }
      }

      return false;
    };

    if (alreadyExists()) {
      alert("User " + newAssignment.displayName + " already exists!");
      return;
    }

    const newShiftVolunteers =
      selectedEvent.shiftVolunteers.concat(newAssignment);
    const newFields = { ...selectedEvent, shiftVolunteers: newShiftVolunteers };

    setSelectedEvent((prev) => ({
      ...prev,
      shiftVolunteers: newShiftVolunteers,
    }));

    await updateDoc(doc(db, "events", selectedEvent.id), newFields);
  };

  // removes volunteer assignment
  const deleteVolunteer = async (volunteer) => {
    const newShiftVolunteers = selectedEvent.shiftVolunteers.filter(
      (object) => {
        return object.id !== volunteer.id;
      }
    );

    const newFields = {
      ...selectedEvent,
      shiftVolunteers: newShiftVolunteers,
    };

    await updateDoc(doc(db, "events", selectedEvent.id), newFields);
    setSelectedEvent(newFields);
  };

  const handleSelectChange = (data) => {
    setNewAssignment(data.value);
  };

  return (
    <div className="assigned-volunteers">
      <div className="justify-align-center">
        <span>Volunteers: </span>
      </div>

      {selectedEvent.shiftVolunteers.map((volunteer, key) => {
        return (
          volunteer.displayName && (
            <div key={key} className="justify-align-center">
              <span>{volunteer.displayName}</span>
              {isAdmin() && (
                <button
                  className="delete-add-button"
                  onClick={() => deleteVolunteer(volunteer)}
                >
                  x
                </button>
              )}
            </div>
          )
        );
      })}
      {showAddVolunteer ? (
        <div className="justify-align-center">
          <div>
            <Select
              styles={customStyles}
              width="200px"
              maxMenuHeight={150}
              options={users.map((user) => {
                return {
                  value: user,
                  label: user.displayName,
                };
              })}
              placeholder="Assign"
              onChange={handleSelectChange}
            />
          </div>
          <button onClick={submitAssignment}>Assign</button>
          <button
            onClick={() => {
              toggleAddVolunteer(false);
              setNewAssignment({});
            }}
          >
            Done
          </button>
        </div>
      ) : (
        <>
          {isAdmin() && (
            <button
              className="delete-add-button"
              onClick={() => toggleAddVolunteer(!showAddVolunteer)}
            >
              +
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default CalendarAssignVolunteer;
