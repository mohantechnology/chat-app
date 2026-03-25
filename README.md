# Chat App
Html, Css, Javascript, Nodejs (Express), MongoDb <br>
Front end is built using pure HTML, CSS and JavaScript without using any other external libraries

<details>
<summary><b>Test Account Credentials</b></summary>

1. email: mohansahualbert@gmail.com , password: mohansahualbert@gmail.com
2. email: mohansahulast@gmail.com , password: mohansahulast@gmail.com

<h2><a href="https://myultimateapp-chat-app.onrender.com/" target="_blank"><img src="https://cdn.glitch.com/89f82df8-eb2c-4c0e-883d-494391c85865%2FScreenshot%20(2511).png?v=1607934281911" alt="" width="200px"></a></h2>
</details>

<h1>Configuration</h1> <hr width="800" align="left">

<ul>
  <li>Setup Environment by running the following commands in terminal<br></li>

  1. `git clone git@github.com:mohantechnology/chat-app.git` - clone repository
  2. `npm install` - to install dependencies
  3. `npm start` - to run the server

  <br><a href="https://github.com/mohantechnology/chat-app-socket" target="_blank">Configure Socket server</a><br><br>

  <li>Configure your env variables in <b>.env</b> file<br></li>

  <b>API_URL</b>: Database API domain name <br>
  <b>SELF_URL</b>: Self domain name <br>
  <b>JWT_SECRET_KEY</b>: Any string value for JWT token <br>
  <b>SOCKET_URL</b>: URL of socket server <br>
  <b>SOCKET_FILE</b>: URL of socket file <br><br>

  Detail of Mail service <br>
  <b>EMAIL</b>: email address <br>
  <b>EMAIL_PASS</b>: email password <br>
  <b>SERVICE</b>: email service provider <br><br>

  <li>For Inserting Sample Data<br></li>
</ul>

```console
npm run feed
```

<ul>
  <li>For Testing<br></li>
</ul>

```console
npm run test
```

<ul>
  <li>For Linting files<br></li>
</ul>

```console
npm run lint
```

<br><br>

<h1>Overview</h1> <hr width="800" align="left">

<img src="https://user-images.githubusercontent.com/71864565/179296805-71840ebb-1ee7-4638-8d4b-2854e10a2c6c.png" alt="">

<ul>
  <li>It is a Chat App built using HTML, CSS, JavaScript for frontend and Node, Express as backend with MongoDB as database. It uses socket.io library for real time communication. This chat app has the following features.<br><br>

  1. Register Account
  2. Activate Account
  3. Make New Friends
  4. Real Time chatting
  5. Forgot Password
  6. File Sharing
  7. Video Calling

  </li>
</ul>

<h1>Visual DEMO</h1> <hr width="800" align="left">

<ul>
  <li>User can Create their Account<br>
  <img src="https://github.com/user-attachments/assets/6f7773ae-a582-43f3-8c3e-fb1372ef8943" alt="" width="700px">
  </li><br>

  <li>After creating account an Email verification mail is sent to Activate user Account<br>
  <img src="https://github.com/user-attachments/assets/f0522376-3d73-4368-b021-88f6d8cefb32" alt="" width="700px">
  </li><br>

  <li>Users can update their profile<br>
  <img src="https://github.com/user-attachments/assets/2c2165d7-5d82-4223-bd88-eef77e1d466c" alt="" width="700px">
  </li><br>

  <li>User can find new friends and send friend request<br>
  <img src="https://github.com/user-attachments/assets/02ec9a79-4b6d-44e7-83f2-c11572d28b2c" alt="" width="700px">
  </li><br>

  <li>Incoming Request can be accepted by other users<br>
  <img src="https://github.com/user-attachments/assets/4c4a7e21-b1b8-4244-8c40-f5539f08e8ad" alt="" width="700px">
  </li><br>

  <li>User gets notification if anyone accepted his friend request<br>
  <img src="https://github.com/user-attachments/assets/fa18c6e9-ec3c-4add-aead-fefcd02f289a" alt="" width="700px">
  </li><br>

  <li>Real time chatting can be done between two friends<br>
  <img src="https://github.com/user-attachments/assets/f06e8896-7b91-44c7-b044-18918b1e1685" alt="" width="700px">
  </li><br>

  <li>Messages can also be sent when receiver is offline<br>
  <img src="https://github.com/user-attachments/assets/f6864169-36e3-4aae-a30a-331aee40ffe8" alt="" width="700px">
  </li><br>

  <li>Multiple files can be shared<br>
  <img src="https://github.com/user-attachments/assets/84a1070e-98f6-4e6f-a76f-b94790f5f839" alt="" width="700px">
  </li><br>

  <li>Searching keyword can be done in chat list<br>
  <img src="https://cdn.glitch.com/89f82df8-eb2c-4c0e-883d-494391c85865%2Feasy_search_keyword.gif?v=1612303325613" alt="" width="700px">
  </li><br>

  <li>Friends can have Video Calls<br>


https://github.com/user-attachments/assets/824f4a1b-6dd3-49f2-9b3e-02c0ede5f427


  </li><br>

  <li>Password can be easily reset using Verification Link or OTP<br>
  <img src="https://github.com/user-attachments/assets/809dac85-4d91-4cd5-845e-7c88127a55b8" alt="" width="700px">
  </li><br>
</ul>

<div style="height:60px"></div>
