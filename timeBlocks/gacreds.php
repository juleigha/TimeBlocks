<link rel='manifest' href='web.manifest'>
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="apple-touch-icon" href="">
<meta name="apple-mobile-web-app-status-bar-style" content="pink">
<meta name="mobile-web-app-capable" content="Organizer">
<meta id="scaleTag" name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<meta property="og:title" content="game">
<meta property="og:description" content="">
<meta property="og:image" content="">
<meta charset="utf-8">
<!-- <script type="text/javascript" src="jquery.js"></script> -->
<script src="https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.6.5/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.6.5/firebase-auth.js"></script>
<script type="text/javascript">
var loggedIn;
// var siteStrg = "http://localhost:1235" ; //location.href.startsWith("https://mattur.org") ? "https://mattur.org":"http://localhost:1235";
var siteStrg = "https://sqedg.com";
var pageNames = window.location.href.replace(siteStrg,"");
pageNames = pageNames.replace("?","");
pageNames = pageNames.split("/");
var pageName = pageNames[1];
console.log(pageName,pageNames);
var gcreds = {
  'clientId': '1043966159415-0kspdv02a2tdfjtj6r5sj7gcgs3t15vk.apps.googleusercontent.com',
  'calScope': 'https://www.googleapis.com/auth/calendar'
};
var firebaseConfig = {
  apiKey: "AIzaSyDR53wNnENbFeOymPE-ghDkgG93F2dwQpA",
  authDomain: "taskorganizer.firebaseapp.com",
  databaseURL: "https://taskorganizer-default-rtdb.firebaseio.com",
  projectId: "taskorganizer",
  storageBucket: "taskorganizer.appspot.com",
  messagingSenderId: "1043966159415",
  appId: "1:1043966159415:web:1c5f3708650d6acbf56db2",
  measurementId: "G-VHZQY1C7P2"
};
firebase.initializeApp(firebaseConfig);
// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
var db = firebase.firestore();
var cal,uid,gp,em,gcredential;
gp = new firebase.auth.GoogleAuthProvider();
gp.addScope('https://www.googleapis.com/auth/calendar');
gp.addScope('https://www.googleapis.com/auth/plus.people.recommended');
// gp.addScope('https://www.googleapis.com/auth/keep');
// gp.addScope('https://www.googleapis.com/auth/plus.me');
var currentReq = {};
function googleSignIn() {
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    firebase.auth().signInWithRedirect(gp).catch(er=>{
      console.log("bad",er);
      $("error").html(er.code);
    });
  })
  .catch((error) => {
    // Handle Errors here.
    console.log(error);
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}
function dbMakeUser(em,pa) {
  // GET VALUES FROM GUI
  firebase.auth().createUserWithEmailAndPassword(em,pa).then(res=>{
    console.log("made db account",res);
  }).catch(er=>{
    console.log("bad",er);
    $("error").html(er.code);
  });
}
function dbSignIn(em,pa) {
  // GET VALUES FROM GUI
  firebase.auth().signInWithEmailAndPassword(em,pa).then(res=>{
    console.log("signed into db",res);
    // location.reload();
  }).catch(er=>{
    console.log("bad",er);
    $("error").html(er.code);
  })
}
function linkDbUser(cb) {
  firebase.auth().currentUser.linkWithPopup(gp).then(res=> {
    console.log("signed into google",res);
    var user = res.user;
    loadGapis(cb);
  }).catch((error) => {
    console.log(error);
    $("error").html(error.code);
  });
}
window.onload = function () {
  var token = localStorage.getItem('tkn');
   if(location.href.indexOf("access_token")>-1){
     token = location.href.slice(location.href.indexOf("#")+14,location.href.indexOf("&"));
     localStorage.setItem('tkn',token);
     // window.history.pushState('', siteStrg, "?"+uid);
   }
   else if (token !== undefined) {
     $(".useWithGoogleBtn").addClass("hidden");
     globalThis["isGoogleUser"] = true;
   }
}
function gapiAuth (url,cb,cb2) {
  var token =  localStorage.getItem('tkn');
  isFbToken = token ? token : false;
  if(!isFbToken) {
     location.href = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${siteStrg}&prompt=consent&response_type=token&client_id=${gcreds.clientId}&scope=https://www.googleapis.com/auth/calendar&access_type=online`;
   }
   currentReq.async = true;
   currentReq.crossDomain = true;
   currentReq.url = url;
   currentReq.method = "GET";
   currentReq.headers = {
     "Content-Type": "application/javascript",
     "Authorization": "Bearer "+token
   };
   console.log(currentReq);
   $.ajax(currentReq).done(function (response) {
     console.log(response);
     // if (response)
     if(cb2)cb(response,cb2);
     else if(cb)cb(response);
     currentReq = {};
   }).catch(()=>{
     // dbSignOut();
   })
 };
function dbSignOut() {
  firebase.auth().signOut();
  // location.href = siteStrg;
  console.log("signed out");
}
console.log("creds @ 102");
gapiMethods = {
  cal: "https://www.googleapis.com/calendar/v3/",
  tasks: "https://tasks.googleapis.com/tasks/v1/",
  notes:"https://keep.googleapis.com/v1/"
}
</script>
