import React, { Component } from 'react';
import { useUser } from "../context/UserProvider";

import { db } from "../firebase-config";
import { collection, deleteDoc, doc, updateDoc, addDoc, onSnapshot } from "@firebase/firestore";

class SMSAll extends Component {

  
  
  
  state = {
    text: {
      textmessage: ''
    }
  }

  

  sendText = _ => {
    const { text } = this.state;
    
    fetch(`https://ExpressServer.darrenanimo.repl.co/send-text?recipient=${text.textmessage}&textmessage=${text.textmessage}`)
    .catch(err => console.error(err))

    
  }

  render() {
    const { text } = this.state;
    const spacer = {
      margin: 8
    }
    const textArea = {
      borderRadius: 4
    }
    return (
      <main> 
          <h2> Send Text Message to All Volunteers</h2>
          
          <div style={spacer} />
          <label style={{margin:'10px'}}> Message: </label>
          <br />
          <textarea className='inputText' rows={3} value={text.textmessage} style={textArea}
            onChange={e => this.setState({ text: { ...text, textmessage: e.target.value } })} /><br/>
          <button onClick={this.sendText} className='mini-button'> Send Text </button>

        
        </main>
    );
  }
}

export default SMSAll;