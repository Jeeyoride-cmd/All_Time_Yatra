import React, { useState } from 'react';
import Sidebar from './Sidebar';
import 'datatables.net';
import 'datatables.net-responsive';
import { BASE_URL } from './config';

function SendNotification() {
  const [type, setRecipient] =useState('');
  const [message, setMessage] = useState('');
  const [responseMsg, setResponseMsg]= useState('');
  const [title, setTitle] = useState('');
  const [isActive, setIsActive] = useState(true);
  
    const handleToggle = () => {
      setIsActive(!isActive);
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !message) {
      setResponseMsg('Please fill all fields.');
      return;
    }
    const payload = {
      type,
      title,
      message,
    };

    try {
      const res = await fetch(`${BASE_URL}/send_notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setResponseMsg('Notification sent successfully!');
        setTitle('');
        setMessage('');
      } else {
        setResponseMsg(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setResponseMsg('Error: ' + error.message);
    }
    setTimeout(() => setResponseMsg(''), 3000);
  };

  return (
    <>
   <Sidebar isActive={isActive} handleToggle={handleToggle} />

  <div id="page-container" className={isActive ? 'sidebar-open' : 'sidebar-closed'}>
      <div className="driver-card-body cardcitymain">
          <div className="chckout-card cardcity">
              <div className="citycard-wrapper">
                  <div className="citycard">
                      <center><h4 className="text-xl font-bold mb-4 text-white">Send Notification</h4></center>
                      <form onSubmit={handleSubmit} >
                          <label className="inputlabel"> Type</label>
                          <select value={type}   onChange={(e) => setRecipient(e.target.value)}
                            className="w-100">
                            <option value="" disabled>
                              ------Choose Type------
                            </option>
                            <option value="driver">Driver</option>
                            <option value="user">User</option>
                          </select>
                          <label  className="inputlabel">Title</label>
                          <input type="text" value={title}  onChange={(e) => setTitle(e.target.value)} placeholder="Enter title"  />
                           <label className="inputlabel" >Message </label>
                            <textarea value={message} className='w-100' style={{marginTop:"-5px"}}  onChange={(e) => setMessage(e.target.value)}  placeholder="Enter message"/>  
                           <center><button type="submit" style={{maxWidth:"300px"}} className='mt-2'>Send Notification</button></center> 
                              {responseMsg && <p className='text-white'>{responseMsg}</p>}
                      </form>
                     
                  </div>
              </div>
          </div>
      </div>
  </div>




   </> 
  );
}


export default SendNotification;
