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
const messagearea = document.getElementById("user-message-area");
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const profilepic = document.getElementById("profile-pic");
const db = getFirestore();
const realdb = collection(db, "messages");
const messagediv = document.querySelector(".message-div");

let storedocid = "";

function showMessage(usermesage) {
  const msgcontainer = document.createElement("div");
  msgcontainer.classList.add("message-div-inside");
  messagediv.appendChild(msgcontainer);
  msgcontainer.textContent = usermesage;
}

// function serverMessageSent(docid) {
//   const inputmsg = onSnapshot(doc(db, "messages", docid), (res) => {
//     const getmsg = res.data();
//     const finalmsg = getmsg.message;
//     console.log(finalmsg);
//     showMessage(finalmsg);
//   });
// }

function allMessage() {
  getDocs(realdb).then((alldata) => {
    alldata.docs.forEach((alldatamessage) => {
      const storealldatamessage = alldatamessage.data();
      showMessage(storealldatamessage.message);
    });
  });
}

function setData(user) {
  profilepic.src = user.photoURL;
  signin.classList.add("btn-sign-display");
  signout.classList.remove("btn-sign-display");
  onSnapshot(realdb,(data)=>{
    // data.docs.map((message)=>message.data().forEach((finalmessage)=>showMessage(finalmessage.message)))
    const jatin = data.docs.map((msg) => msg.data());
    jatin.forEach((finalmessage)=>showMessage(finalmessage.message))
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
    allMessage();
    const finaldb = async () => {
      const fetchdocid = await addDoc(realdb, {
        message: `${inputfield.value}`,
      });
   
      storedocid = fetchdocid._key.path.segments[1];
      divRemove()
      allMessage()
    };

    sendbtn.addEventListener("click", () => {
      finaldb();
    });
  } else {
    signin.addEventListener("click", () => {
      SignIn();
    });
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
