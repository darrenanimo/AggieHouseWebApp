import React, { useState } from "react";
import styled from "styled-components";
import { useUser } from "../context/UserProvider";

function SMSAll() {
  const [sms, setSms] = useState("");
  const [number, setNumber] = useState("");
  const { users } = useUser();

  const sendSms = (event) => {
    event.preventDefault();

    let smsObj = {
      mobile_number: number,
      message: sms,
    };

    users.forEach((user) => {
      console.log("sending text");

      if (user.phoneNumber) {
        fetch(
          `https://aggie-house-reminders.herokuapp.com/send-text?recipient=${user.phoneNumber}&textmessage=${smsObj.message}`
        ).catch((err) => console.error(err));
      }
    });
  };

  const handleChange = (event) => {
    if (event.target.name === "number") {
      setNumber(event.target.value);
    } else if (event.target.name === "sms") {
      setSms(event.target.value);
    }
  };

  return (
    <Container>
      <Header>SMS All Volunteers</Header>
      <Form onSubmit={sendSms}>
        <label>Message:</label>
        <TextArea name='sms' onChange={handleChange}></TextArea>
        <Button className="mini-button">Submit </Button>
      </Form>
    </Container>
  );
}

export default SMSAll;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  height: 100vh;
  background-color: #e8e2dc;
`;

const Header = styled.h3`
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: left;
`

const Input = styled.input`
  width: 50%;
  padding: 12px;
  margin: 6px 0 4px;
`;

const TextArea = styled.textarea`
  width: 50%;
  resize: vertical;
  padding: 12px;
  margin: 6px 0 4px;
  height: 100px;
`;

const Button = styled.button`
  &:hover {
    cursor: pointer;
  }
`;
