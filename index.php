<?php
if (!(!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')){
  $location = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
  header('Location: ' . $location);
}
?>
<!DOCTYPE html>
 <html lang="en" dir="ltr">
  <head>
    <style id="rootColors" media="screen">
    </style>
    <style class="dyn" media="screen"></style>
    <style media="screen">

    html{
      position: relative;
      left: 0;
      top:0;
      height: 100vh;
      width: 100vw;
    }
    #bgmosaic{
      height: 100vh;
      width: 100vw;
      position: fixed;
      z-index: -1;
      top: 0;
      left: 0;
    }
    .hidden {
      visibility: hidden;
      position: fixed;
      height: 0;
      width:0;
    }
    mainNav {
      background: var(--ltGrey);
        position: fixed;
        top: 0;
        width: 100%;
        left: 0;
        overflow-x: auto;
        z-index: 0;
        white-space: nowrap;
        height: 110vh;
    }
    currentScreen {
        background: var(--ltGrey);
        z-index: 3;
        top: 8vh;
        margin-left: -10px;
        display: block;
        position: fixed;
        padding-right: 16px;
    }
    tab {
        min-width: 93px;
        display: inline-block;
        text-align: center;
        position: relative;
        border: grey 1pt solid;
        line-height: 0;
        font-family: priori-sans, sans-serif;
        font-weight: 400;
        /* font-size: 3.5vh; */
        font-style: normal;
    }
    tab img {
      width:7vh;
      height:7vh;
    }
    .activeTab {
        border-bottom: none;
        background: var(--ltGrey);
    }
      addgoogtoapp {
          position: fixed;
          background: blue;
          width: 100vw;
          height: 20px;
          bottom: 0;
          left: 0;
          cursor: pointer;
          z-index: 20;
      }
      *{
        user-select: none;
        font-family: array-proportional, serif;
        font-weight: 400;
        font-style: normal;
        /* font-weight: 700;
Priori Sans OT Italic
font-family: priori-sans, sans-serif;
font-weight: 400;
font-style: italic;
Priori Sans OT Regular
font-family: priori-sans, sans-serif;
font-weight: 400;
font-style: normal;
Priori Sans OT Bold
font-family: priori-sans, sans-serif;
font-weight: 700;
font-style: normal;
Array Proportional Regular
font-family: array-proportional, serif;
font-weight: 400;
font-style: normal;
Array Proportional Regular Italic
font-family: array-proportional, serif;
font-weight: 400;
font-style: italic;
Array Proportional Bold
font-family: array-proportional, serif;
font-weight: 700;
font-style: normal;
Array Proportional Bold Italic
font-family: array-proportional, serif;
font-weight: 700;
font-style: italic;
*/
        /* font-family: vendetta, serif; */
        /* font-weight: 300; */
      }
    </style>
    <link rel="stylesheet" href="https://use.typekit.net/mpd3quv.css">
    <script type="text/javascript" src="jquery.js"></script>
    <?php
      include "gacreds.php";
      include 'screens.php';
    ?>
    <script type="text/javascript" src="app.js"></script>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <img id="bgmosaic" src="images/mosaic.svg" alt="">
    <!-- <addGoogToApp class="liveEventsBtn">Add Google</addGoogToApp> -->
    <mainNav>
      <tab data="scheduleDesigner"> <img src="images/scheduleTab.svg" alt=""> </tab>
      <tab data="todayScreen"> <img src="images/timeTab.svg" alt=""> </tab>
      <tab data="listScreen"> <img src="images/listTab.svg" alt=""> </tab>
      <tab data="txtInScreen"> <img src="images/plusTab.svg" alt=""> </tab>
      <tab data="UserSettings"> <img src="images/gear.svg" alt=""> </tab>
    </mainNav>
    <currentScreen></currentScreen>
  </body>
  <script  type="module">
  var isUsinggapi;
  var defaultWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var mnthTxt = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  // defaultColors.ltGrey = "#ff00005e";
  // defaultColors.drkGrey = "#e7e0e0";
  // defaultColors.highlight1 = "#ebd083";
  changeRootColors();
  console.log("body starts @ 22");
  import * as authScreen from "./authScreen/module.js";
  import * as scheduleDesigner from "./scheduleDesigner/module.js";
  import * as listScreen from "./listScreen/module.js";
  import * as txtInScreen from "./txtInScreen/module.js";
  import * as todayScreen from "./todayScreen/module.js";
  import * as schedTaskOptions from "./schedTaskOptions/module.js";
  import * as UserSettings from "./UserSettings/module.js";
  console.log(listScreen.name);
  new Page(authScreen);
  globalThis['uid'] = "";
  $("tab").on("click",e=>{
    var t = $(e)[0].currentTarget.attributes.data.nodeValue;
    console.log(t);
    $(`tab`).removeClass("activeTab");
    $(`tab[data="${t}"]`).addClass("activeTab");
    globalThis[t].makeActive();
  })
  firebase.auth().onAuthStateChanged(user=>{
    console.log(user);
    // firebase.auth().reauthenticateWithCredential({
    //   providerId: "google.com",
    //   signInMethod:""
    // })
    if(!user){
      globalThis["authScreen"].makeActive();
    }
    else{
      // screenName
      firebase.auth().getRedirectResult().then(r=>{
        if(r.credential){
          window.history.pushState('', 'Organizer', "?"+globalThis['uid']);
          var tkn = r.credential.accessToken;
          localStorage.setItem('tkn',tkn);
          isUsinggapi = true;
          console.log("SAVED IT********************");// calAuth(firebase.auth().getRedirectResult().i.credential.accessToken);
        }
        else if (localStorage.getItem('tkn')){

        }
      })
      em = (user.email.replace("@","")).replace(".","");
      uid = user.uid;
      // window.history.pushState('', 'Organizer', "?"+uid);
      pageName = uid;
      var screenName = pageNames[pageNames.length-1];
      db.collection("organizers").doc(pageName).get().then(info=>{
        globalThis["settings"] = data;
        new Page(scheduleDesigner);
        new Page(todayScreen);
        new Page(listScreen);
        new Page(txtInScreen);
        new Page(schedTaskOptions);
        new Page(UserSettings);
        var data = info.data();
        // var noScreen = screenName === pageName || screenName === "authScreen";
        if (screenName === pageName || screenName === "authScreen") {
          if(data){
            globalThis["schedTaskOptions"].makeActive();
          }
          else {
            globalThis["scheduleDesigner"].makeActive();
          }
        }
      })
    }
  });
globalThis["signIntoApis"] = {
  makeActive :()=>{
    gapiAuth();
  }
}

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js')
    .then(function(registration) {
      registration.addEventListener('updatefound', function() {
        var installingWorker = registration.installing;
      });
    })
    .catch(function(error) {
    });
  }
  </script>
</html>
