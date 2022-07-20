Chat App<br> Html, Css ,Javascript, Nodejs (Express), MongoDb <br> Front end is build using pure html , css and javascript without using any other external libraries  <br><b> 

 <button> 
  Test Account Credentials
  
1) email: mohansahualbert@gmail.com , password: mohansahualbert@gmail.com <br>
2) email: mohansahulast@gmail.com , password: mohansahulast@gmail.com <br>
<h2> <a href="https://myultimateapp.herokuapp.com/" target="_blank"><img src="https://cdn.glitch.com/89f82df8-eb2c-4c0e-883d-494391c85865%2FScreenshot%20(2511).png?v=1607934281911" alt="" width="200px"></a></h2> </button>
 <h1> Configuration</h1> <hr width="800" align="left"> <ul> <li>Setup Enviornment by running following commands in terminal <br></li> 1) 'git clone 'git@github.com:mohantechnology/chat-app.git' clone repository <br> 2) 'npm install' to install dependencies <br> 3) 'npm start' to run the server <br> <br> <a href="https://github.com/mohantechnology/chat-app-socket" target="_blank">configure Socket server </a><br> <br> <br> <li>Configure your env variables in <b>.env </b> file <br></li>
 <b>API_URL </b>: Database Api domain name <br> <b> SELF_URL </b>: Self domain name <br> <b> JWT_SECRET_KEY </b>: Any string value for jwt token <br> <b> SOCKET_URL</b>: url of socket server <br> <b> SOCKET_FILE </b>: url of socket file <br> <br> Detail of Mail service <br> <b> EMAIL </b>: email address <br> <b> EMAIL_PASS </b>: email password<br> <b> SERVICE </b>: email service provider <br> <br> 
<br>  
<li>For Inserting  Sample Data <br></li> 

```console
npm run feed  
```
 
 
  <li>For Testing   <br></li>  
 
```console
 npm run test
```

  <li>For Linting files  <br></li>   
  
```console
npm run lint 
```

<br> <br>
 </ul>
 
  <h1>Overview </h1> <hr width="800" align="left"><img src="https://cdn.glitch.com/89f82df8-eb2c-4c0e-883d-494391c85865%2FARCHITECHTURE.png?v=1612303305554](https://user-images.githubusercontent.com/71864565/179296805-71840ebb-1ee7-4638-8d4b-2854e10a2c6c.png" alt=""> 
 


 <ul> <p>It is a Chat App build using Html, Css, Javascript for frontend and Node, Express as backend with MongoDb as database.It user socket.io library for real time communication .This chat app has following features. <br><br> 1) Register Account <br> 2) Activate Account <br> 3) Make New Friends<br> 4) Real Time chatting<br> 5) Forgot Password<br> 6) File Sharing <br> 7) Video Calling <br> <br> </ul> <h1>Visual DEMO </h1> <hr width="800" align="left"> <ul> <li> User can Create their Account <br> <img src="https://cdn.glitch.com/89f82df8-eb2c-4c0e-883d-494391c85865%2Freg_final_last.gif?v=1612303314237" alt="" width="700px"> </li> <br> <li> After creating account an Email verification mail is send to Activate user Account <br> <img src="https://cdn.glitch.com/89f82df8-eb2c-4c0e-883d-494391c85865%2Factivate_final_2.gif?v=1612303331586" alt="" width="700px"> </li> <br> <li> Users can update their pofile <br> <img src="https://cdn.glitch.com/89f82df8-eb2c-4c0e-883d-494391c85865%2Fupdate_final_2.gif?v=1612303335752" alt="" width="700px"> </li> <br> <li> User Can find new friends and send friend request <br> <img src="https://cdn.glitch.com/89f82df8-eb2c-4c0e-883d-494391c85865%2Ffriend_req.gif?v=1612303329001" alt="" width="700px"> </li> <br> <li> Incoming Request can be accepted by other users <br> <img src="https://cdn.glitch.com/89f82df8-eb2c-4c0e-883d-494391c85865%2Faccept_req.gif?v=1612269169106" alt="" width="700px"> </li> <br> <li> User get notification if any one accepted his friend request <br> <img src="https://cdn.glitch.com/89f82df8-eb2c-4c0e-883d-494391c85865%2Fnotificat.gif?v=1612303309064" alt="" width="700px"> </li> <br> <li> Real time chatting can be done between two friends <br> <img src="https://cdn.glitch.com/89f82df8-eb2c-4c0e-883d-494391c85865%2Freal_time_chat.gif?v=1612303320736" alt="" width="700px"> </li> <br> <li> But messages can also be sent when reciever is offline <br> <img src="https://cdn.glitch.com/89f82df8-eb2c-4c0e-883d-494391c85865%2Fnon_real_time_chat.gif?v=1612303312805" alt="" width="700px"> </li> 
 

 <br> <li> Multiple files can be shared <br> <img src="https://cdn.glitch.com/89f82df8-eb2c-4c0e-883d-494391c85865%2Fsend_file_final_2.gif?v=1612303332080" alt="" width="700px"> </li> <br> <li> Searching keyword can be done in chat list <br> <img src="https://cdn.glitch.com/89f82df8-eb2c-4c0e-883d-494391c85865%2Feasy_search_keyword.gif?v=1612303325613" alt="" width="700px"> </li> 
  <br> <li> Friend  can have  Video Calls <br> ![Animation](https://user-images.githubusercontent.com/71864565/176000768-950239be-ad79-421c-92d0-47a9e836d4e0.gif) </li>


 <br> <li> Passoword can be easily reset using Verification Link or OTP <br> <img src="https://cdn.glitch.com/89f82df8-eb2c-4c0e-883d-494391c85865%2Fforgot_reset.gif?v=1612303326651" alt="" width="700px"> </li> <br> </ul> <div style="height:60px"></div>


