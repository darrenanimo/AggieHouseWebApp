import React from "react";
import "../pages/css/Todo.css";
import editButton from "../images/pencil-edit-button.svg";

// components
import ChoreStatusButton from "./ChoreStatusButton";
import { ChoresForm } from "./ChoresForm";

const ChoreTable = ({ choreData }) => {
  return (
    <div className="chore-sheet">
      <table>
        <tbody>
          <tr>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
            <th>Sunday</th>
          </tr>
          <tr>
            {choreData?.map((val, key) => {
              return (
                <td key={key}>
                  <ChoresForm val={val} />
                </td>
              );
            })}
          </tr>
          <tr>
            {choreData?.map((val, key) => {
              return (
                <td key={key}>
                  <ChoreStatusButton chore={val} />
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ChoreTable;
