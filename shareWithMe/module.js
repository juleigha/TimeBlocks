function init() {
  if(!globalThis["settings"].share){
    db.collection("organizers").doc(pageName).collection("lists")
    .doc().set({name:"new"}).then(resp=>{
      console.log(resp);
      $("shareKeyString input").val(`${siteStrg}/shareWithMe/?${pageName}`);
      $("getShareKey").click(e=>{
        $("shareKeyContainer").removeClass("hidden");
      })
    })
  }
}
////////////////////////////////////////////////////////////////////////
var name = "settingsPage";
var lib = {
  load:init
}

export {name,lib};
