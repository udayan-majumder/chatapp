import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAeVmydHH6vSMh0TQLW0bMLn840oYokx14",
  authDomain: "chatapi-7fad1.firebaseapp.com",
  databaseURL: "https://chatapi-7fad1-default-rtdb.firebaseio.com",
  projectId: "chatapi-7fad1",
  storageBucket: "chatapi-7fad1.appspot.com",
  messagingSenderId: "924734798365",
  appId: "1:924734798365:web:ecb1078c0cb3ac8b2d64f4",
};

const signin = document.getElementById("btn");
const signout = document.getElementById("btntwo");
const sendbtn = document.getElementById("sendbtn");
const inputfield = document.getElementById("input-field");
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const profilepic = document.getElementById("profile-pic");
const db = getFirestore();
const realdb = collection(db, "messages");
const wholediv = document.getElementById("wholediv")
const messagediv = document.querySelector(".message-div");
const getmsgpics = document.querySelector(".message-div-inside");
const getmessagetext = document.querySelector(".message-text");
const getmessageimage = document.querySelector(".message-image");
const usermessagearea = document.getElementById(".user-message-area");

let storemessage = "";
function showMessage(messages) {
  const messageNodes=[]
 
  messages.forEach((message)=>{
    if(message.message){
      const msgcell = document.createElement("div");
      msgcell.classList.add("msg-cell")
      const msgcontainer = document.createElement("div");
      msgcontainer.classList.add("message-div-inside");
      const msgtext = document.createElement("div");
      msgtext.classList.add("message-text");
      msgtext.textContent = message.message;
      const msgimage = document.createElement("img");
      msgimage.classList.add("message-image");
      msgimage.src = message.image;
      if(message.userid==auth.currentUser.uid){
        msgcontainer.append(msgimage,msgtext);
        msgcontainer.classList.add("left")
      }
      else{
       msgcontainer.append(msgtext,msgimage);
       msgcontainer.classList.add("right")
      }
      
      msgcell.appendChild(msgcontainer)
      messageNodes.push(msgcell);
    }
    else{
      return
    }
    
    
  })
  messagediv.replaceChildren(...messageNodes)
 
}


function setData(user) {
  profilepic.src = user.photoURL;
  signin.classList.add("btn-sign-display");
  signout.classList.remove("btn-sign-display");
  onSnapshot(query(realdb,orderBy("time")),(data)=>{
    const msgfi = data.docs.map((msg) => msg.data());
    showMessage(msgfi);
    
  })
}
function divRemove() {
  const revmessagediv = document.querySelectorAll(".message-div-inside");
  revmessagediv.forEach((element) => {
    element.remove();
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    
    setData(user);
    signout.addEventListener("click", () => {
      signOUT();
    });
    wholediv.classList.remove("blank")
    const finaldb = async () => {
      const fetchdocid = await addDoc(realdb, {
        message: `${inputfield.value}`,
        time:serverTimestamp(),
        image:user.photoURL,
        userid:user.uid,

      });
   
      
    };
     sendbtn.addEventListener("keydown", () => {
       finaldb();
       
     });
    sendbtn.addEventListener("click", () => {
      finaldb();
      inputfield.value="";
    });
    
  } else {
    
    signin.addEventListener("click", () => {
      SignIn();
    });
    wholediv.classList.add("blank");
    divRemove();
  }
});

function SignIn() {
  const provider = new GoogleAuthProvider(app);
  signInWithPopup(auth, provider).then((result) => {
    setData(result.user);
    
  });
}

function signOUT() {
  signOut(auth).then(() => {
    profilepic.src =
      "https://ypqa.yp.ieee.org/wp-content/uploads/2020/12/avatar.jpg";
    signin.classList.remove("btn-sign-display");
    signout.classList.add("btn-sign-display");
  });
}

