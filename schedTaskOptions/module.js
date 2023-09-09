function init() {
  $("addToLists").click(()=>{
    $(`tab[data="txtInScreen"]`).addClass("activeTab");
    globalThis["txtInScreen"].makeActive();
  })
  $("viewSchedule").click(()=>{
    $(`tab[data="todayScreen"]`).addClass("activeTab");
    globalThis["todayScreen"].makeActive();
  })
}
////////////////////////////////////////////////////////////////////////
var name = "schedTaskOptions";
var lib = {
  load:init
}

export {name,lib};
