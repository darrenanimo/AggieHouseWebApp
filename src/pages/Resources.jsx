import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useUser } from "../context/UserProvider";

import FAQInfo from "../components/FAQ";
import BoardInfo from "../components/Contact";

import NavBar from "../components/NavBar.jsx";
import "./css/Resources.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

export default function Resources() {
  const [value, setValue] = React.useState(0);
  const [deleteState, toggleDeleteState] = useState(false);
  const { users, userFirebaseData } = useUser();

  const isAdmin = () => {
    return userFirebaseData?.role === "admin";
  };
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <main className="body">
      <NavBar />
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            fullWidth
            allowScrollButtonsMobile
          >
            <Tab label="Contacts" {...a11yProps(0)} />
            <Tab label="Resources" {...a11yProps(1)} />
            <Tab label="FAQs" {...a11yProps(2)} />
            <Tab label="Tutorials" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <h2>Contact Info</h2>
          <BoardInfo deleteState={deleteState} />
          {isAdmin() && (<button
            className="addButton"
            onClick={() => {
              toggleDeleteState(!deleteState);
            }}
          >
            Delete Contact
          </button>)}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <h2>Links to Documents in the Aggie House Drive</h2>
          <ul className="list">
            <li>
              <a
                className="link"
                href="https://docs.google.com/spreadsheets/d/1C7d3nHh5Vp_mPZlKN-Cp2DecNz0HXHlA8MOgs1_bCzo/edit?usp=sharing"
              >
                {" "}
                Board Contact Sheet
              </a>
            </li>
            <li>
              <a
                className="link"
                href="https://docs.google.com/spreadsheets/d/1Sw3h6l79ewC8D9s7eooxWIAeIPyGuLxChWd3qHmsD-E/edit?usp=sharing"
                target="_blank"
              >
                Master Roster{" "}
              </a>
            </li>
            <li>
              <a
                className="link"
                href="https://docs.google.com/document/d/1UgGepZqLtNeteT1KAp5mIkjRnSpaI7ZYDQDe373sTHY/edit?usp=sharing"
                target="_blank"
              >
                Meals Sheet{" "}
              </a>
            </li>
            <li>
              <a
                className="link"
                href="https://docs.google.com/presentation/d/1Na2VB5MG38gW5g7VkvqcPUSZlsfK2kooDZH2wrRs4tc/edit?usp=sharing"
                target="_blank"
              >
                AH Family Introduction Slides{" "}
              </a>
            </li>
            <li>
              <a
                className="link"
                href="https://docs.google.com/document/d/1ZENhsKEKpoeRFlOuH768nXXLn6HWmYyiR1xWJHN-8R8/edit?usp=sharing"
                target="_blank"
              >
                Volunteer Operations Guide{" "}
              </a>
            </li>
            <li>
              <a
                className="link"
                href="https://forms.gle/RKo4wpBzPet5fZFy5"
                target="_blank"
              >
                Incident Report Form{" "}
              </a>
            </li>
            <li>
              <a
                className="link"
                href="https://docs.google.com/forms/d/e/1FAIpQLSeHfaQAC_BwkYkf7RvvvkD5x3lASe4K2kaKvgB0vhc3fiKCsQ/viewform?usp=sf_link"
                target="_blank"
              >
                {" "}
                COVID-19 Report Form{" "}
              </a>
            </li>
          </ul>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <h2>FAQs</h2>
          <FAQInfo deleteState={deleteState} />
          {isAdmin() && (<button
            className="addButton"
            onClick={() => {
              toggleDeleteState(!deleteState);
            }}
          >
            Delete FAQ
          </button>)}
        </TabPanel>
        <TabPanel value={value} index={3}>
          For videos to use the website and other common 'how-to's
        </TabPanel>
      </Box>
    </main>
  );
}
