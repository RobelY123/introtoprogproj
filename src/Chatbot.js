import React, { useState } from 'react';
// import { sendToDialogflow, processDialogflowResponse } from './dialogflowService'; // Assume these functions handle Dialogflow interaction
import { gradesData } from './grades';

const Chatbot = () => {
  const [userQuery, setUserQuery] = useState('');
  const [chatResponses, setChatResponses] = useState([]);

  const handleUserQuerySubmit = async () => {
    // const dialogflowResponse = await sendToDialogflow(userQuery);
    // const responseText = processDialogflowResponse(dialogflowResponse, gradesData);
    // setChatResponses([...chatResponses, responseText]);
  };

  return (
    <div>
      <input 
        type="text" 
        value={userQuery} 
        onChange={(e) => setUserQuery(e.target.value)} 
      />
      <button onClick={handleUserQuerySubmit}>Send</button>
      <div>
        {chatResponses.map((res, index) => (
          <p key={index}>{res}</p>
        ))}
      </div>
    </div>
  );
};

export default Chatbot;