function init() {
  $("getShareKey").click(e=>{
    if(!globalThis["settings"].share){
      var fname = firebase.auth().currentUser.displayName ? ((firebase.auth().currentUser.displayName).split(" "))[0] : firebase.auth().currentUser.email;
      db.collection("organizers").doc(pageName).collection("lists")
      .doc("inbox").set({name:fname}).then(resp=>{
        globalThis["settings"].share = true;
        console.log(resp);
        $("shareKeyString input").val(`${siteStrg}/shareWithMe/?${pageName}/inbox`);
        $("shareKeyString a").attr("href",`sms://?&body=${siteStrg}/shareWithMe/?${pageName}/inbox`);
        $("shareKeyContainer").removeClass("hidden");
        globalThis["settings"].share = fname;
      })
    }
    else {
      $("shareKeyString input").val(`${siteStrg}/shareWithMe/?${pageName}/inbox`);
      $("shareKeyContainer").removeClass("hidden");
    }
  })
  $("googleCalOpts").click(e=>{
    var html="";
    globalThis["todayScreen"].lib.calOpts();
  })
  var ems = globalThis["notifications"].data();
  var pth = new firebase.firestore.FieldPath("categories");
  var msg = Object.keys(ems.messages);
  console.log(ems.messages , ems.messages[msg[0]] );
  if(ems.messages , ems.messages[msg[0]]){
    $("notifications").removeClass("hidden");
    var ks = ems.messages;
    var html = `${ks[msg[0]].ownerName} wants to share ${ks[msg[0]].listTitle} with you
    <accept>Accept</accept>
    <decline>Decline</decline>`;
    $("notifications").html(html);
    $("accept").click(e=>{
      var cat =ks[msg[0]].listTitle;
      if(globalThis["settings"].categories.indexOf(cat) > -1)cat+="-Shared";
      if(globalThis["settings"].categories.indexOf(cat) === -1){
        globalThis["settings"].categories[globalThis["settings"].categories.length] = cat;
        // globalThis["listScreen"].lib.addNewList(cat,ks[msg[0]].listLoc);
        $("notifications").append(`${globalThis["lists"]}`,cat,ks[msg[0]].listLoc);
        globalThis["lists"][cat] =  { name:cat, items:[] };
        globalThis["lists"][cat].shared = ks[msg[0]].listLoc;
        db.collection("organizers").doc(pageName).collection("lists").doc("list").set(globalThis["lists"]).then(r=>{
          db.collection("organizers").doc(pageName).update("categories",globalThis["settings"].categories).then(r2=>{
            var nks = {};
            msg.forEach((m, i) => {
              if(i!==0){
                nks[m]=ks[m]
              }
            });
            db.collection("organizers").doc(pageName).collection("lists").doc("inbox").update("messages",nks);
          });
        });
      }
      else {
        console.log("already exists ");
      }
    })
    $("decline").click(e=>{
      var nks = {};
      msg.forEach((m, i) => {
        if(i!==0){
          nks[m]=ks[m]
        }
      });
      db.collection("organizers").doc(pageName).collection("lists").doc("inbox").update("messages",nks);
    })
  }
}
function snap(cb) {
  db.collection("organizers").doc(pageName).collection("lists").doc("inbox").onSnapshot(ems=>{
    globalThis["notifications"] = ems;
    if(cb && globalThis["UserSettings"].isLoaded !== true){
      globalThis["UserSettings"].isLoaded = true;
      globalThis["UserSettings"].makeActive();
    }
  })
}
////////////////////////////////////////////////////////////////////////
var name = "UserSettings";
var lib = {
  load:init,
  snap:snap
}

export {name,lib};
