<?php
// if (!(!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')){
//   $location = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
//   header('Location: ' . $location);
// }
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
        z-index: -1;
        white-space: nowrap;
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
    <script type="text/javascript" src="../jquery.js"></script>
    <?php
      include "../gacreds.php";
      include '../screens.php';
    ?>
    <script type="text/javascript" src="../app.js"></script>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <currentScreen></currentScreen>

  </body>
  <script type="module">
  changeRootColors();
firebase.auth().onAuthStateChanged(user=>{
  console.log(pageName,user);
  if (pageName === "shareWithMe" && user){
    console.log(window.location.href);
    globalThis["sharewith"] = pageNames[pageNames.length-2];
    globalThis["folder"] = pageNames[pageNames.length-1];
    console.log(globalThis["sharewith"],globalThis["folder"]);
    db.collection("organizers").doc(globalThis["sharewith"])
    .collection("lists").doc(globalThis["folder"])
    .get().then((resp)=>{
      console.log("00000000000000000",resp);
      var getting = resp.data();
      if(getting){
        globalThis["pageName"] = user.uid;
        db.collection("organizers").doc(pageName).get().then(info=>{
          globalThis["setts"] = info.data();
          db.collection("organizers").doc(globalThis["pageName"])
          .collection("lists").doc("list")
          .get().then(lists=>{
            lists = lists.data();
            globalThis['lsts'] = lists;
            var html = `<p>Choose a list to share with ${getting.name}</p><select>`;
            info.data().categories.forEach((cat, i) => {
              if (globalThis['lsts'][cat] && (!globalThis['lsts'][cat].shared || (globalThis['lsts'][cat].shared && globalThis['lsts'][cat].shared.indexOf(pageName)>-1))) {
                html += `<option value='${i}'>${cat}</option>`;
              }
            });
            html += `</select><sharebtn></sharebtn>`;
            $("currentScreen").append(html);
            $("sharebtn").text(`Share ${info.data().categories[$("select").val()]}`);
            $("select").on("change",()=>{
              $("sharebtn").text(`Share ${info.data().categories[$("select").val()]}`);
            })
            $("sharebtn").click(()=>{

              console.log(lists[info.data().categories[$("select").val()]].shared);
              if(!lists[info.data().categories[$("select").val()]].shared){
                lists[info.data().categories[$("select").val()]].shared = `${globalThis["pageName"]}/${info.data().categories[$("select").val()]}`;
                db.collection("organizers").doc(globalThis["pageName"])
                .collection("lists").doc("list").set(lists);
                var listContents = lists[info.data().categories[$("select").val()]];
                listContents.allowed ={};
                listContents.allowed[globalThis["sharewith"]] = true;
                db.collection("organizers").doc(globalThis["pageName"])
                .collection("lists").doc(info.data().categories[$("select").val()])
                .set(listContents);
                sendList();
              }
              else {
                var pth = new firebase.firestore.FieldPath("allowed",globalThis["sharewith"]);
                db.collection("organizers").doc(globalThis["pageName"])
                .collection("lists").doc(info.data().categories[$("select").val()])
                .update(pth,true).then(lsts=>{
                  sendList();
                })
              }
            })
          })
        })
      }
      else {
        console.log("user does not exist");
      }
    }).catch(e=>{
      console.log(e);
    })
  }
  else {
    window.location.href = siteStrg+"/?"+globalThis['uid'];
  }
})
function sendList() {
  var pth = new firebase.firestore.FieldPath("messages",globalThis["pageName"]);
  var request = {
    ownerName:firebase.auth().currentUser.displayName ? ((firebase.auth().currentUser.displayName).split(" "))[0] : firebase.auth().currentUser.email,
    listLoc: globalThis["lsts"][globalThis["setts"].categories[$("select").val()]].shared,
    listTitle: globalThis["setts"].categories[$("select").val()]
  }
  db.collection("organizers").doc(globalThis["sharewith"])
  .collection("lists").doc(globalThis["folder"]).update(pth,request);
}
  </script>
</html>
