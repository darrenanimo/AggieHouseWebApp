import React from "react";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserProvider";

function UpcomingShift({ events }) {
  const [nextShift, setNextShift] = useState({});
  const { user } = useUser();

  const DATE_OPTIONS = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const isEmpty = (obj) => {
    return (
      obj &&
      Object.keys(obj).length === 0 &&
      Object.getPrototypeOf(obj) === Object.prototype
    );
  };

  useEffect(() => {
    // code to get upcoming shift...
    const getNextShift = () => {
      if (events.length != 0) {
        let comingEvent = {};
        let comingShift = new Date(9999999999999); // in the year 2286...
        events.forEach((event) => {
          let isAssigned = false;
          event.shiftVolunteers.forEach((volunteer) => {
            if (!isEmpty(volunteer)) {
              if (volunteer.id == user.uid) isAssigned = true;
            }
          });
          if (isAssigned) {
            if (event.start < comingShift) {
              comingShift = event.start;
              comingEvent = event;
            }
          }
        });
        setNextShift(comingEvent);
      }
    };

    getNextShift();
  }, [events]);

  return (
    <div className="modules">
      <h4>
        Upcoming Shift
        {!isEmpty(nextShift) ? (
          <p className="info">
            {nextShift.start.toLocaleDateString("en-US", DATE_OPTIONS)}
          </p>
        ) : (
          <p className="info">You have no upcoming shift</p>
        )}
      </h4>
    </div>
  );
}

export default UpcomingShift;
