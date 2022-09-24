import React, {useState} from 'react';
import styled from 'styled-components';
import { useUser } from "../context/UserProvider";

function SMSIndividual() {
  const [sms, setSms] = useState('');
  const [number, setNumber] = useState('');
  const { users } = useUser();


  const sendSms = (event) => {
    event.preventDefault();

    let smsObj = {
        mobile_number: number,
        message: sms,
    }

    fetch(`https://aggie-house-reminders.herokuapp.com/send-text?recipient=${smsObj.mobile_number}&textmessage=${smsObj.message}`)
    .catch(err => console.error(err))
    
    alert("Text Sent")
  }
  
    
              


  const handleChange = (event) => {
    if (event.target.name === 'number') {
      setNumber(event.target.value);
    } else if (event.target.name === 'sms') {
      setSms(event.target.value);
    }
  
  }

  return (
    <Container>
      <Header>Send SMS Message</Header>
      <Form onSubmit={sendSms}>
        <label>Volunteer:</label>
        <Input name='number' onChange={handleChange}></Input>
        <label>Message:</label>
        <TextArea name='sms' onChange={handleChange}></TextArea>
        <Button className="mini-button">Submit</Button>
      </Form>
    </Container>
  );
}

export default SMSIndividual;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  
  background-color: #E8E2DC;
`

const Header = styled.h3`
  text-transform: uppercase;
  letter-spacing: 1px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: left;
`

const Input = styled.input`
  width: 50%;
  padding: 12px;
  margin: 6px 0 4px;
`

const TextArea = styled.textarea`
  width: 50%;
  resize: vertical;
  padding: 12px;
  margin: 6px 0 4px;
  height: 100px;
`

const Button = styled.button`
  
  &:hover {
    cursor: pointer;
  }
`