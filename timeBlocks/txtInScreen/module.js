var cats = ["Tasks","Chores","Errands","Goals"];
var defaultItem = {
  text:"",
  completed:false
}
var index = 0;
function init() {
    var html = "<select id='selAddToCat'>";
    globalThis["settings"].categories.forEach((cat, i) => {
      html += `<option value='${i}'>${cat}</option>`;
    })
    html += "</select>";
    getCat();
    $("#btnChngGrp").html(html);
    $("#selAddToCat").on("change",(e)=>{
      e.preventDefault();
      globalThis["txtInScreen"].lib.index = $("#selAddToCat").val();
      console.log($("#selAddToCat").val());
      $("#txtIn").focus();
    })
    // $("CntnrInput *").on("touchstart click",e=>{
    //   e.preventDefault();
    //   $("#txtIn").focus();
    // })
    // $("CntnrInput").on("touchend click",e=>{
    //   $("#txtIn").focus();
    //   e.preventDefault();
    //   globalThis["txtInScreen"].lib.index ++;
    //   if(globalThis["txtInScreen"].lib.index === globalThis["txtInScreen"].lib.cats.length){
    //     globalThis["txtInScreen"].lib.index = 0;
    //   }
    //   $("#btnChngGrp").text(getCat());
    // })
    $("input").on("keypress",e=>{
      if (e.key === "Enter" && $("input").val() !== ""){
        var c = getCat();
        console.log(c);
        globalThis["lists"][c].items[globalThis["lists"][c].items.length] = {
          text:$("input").val(),
          completed:false
        };
        if(globalThis["lists"][c].shared){
          var frndId = globalThis["lists"][c].shared.split("/");
          console.log(frndId);
          var list = frndId[1];
          frndId = frndId[0];
          db.collection("organizers").doc(frndId)
          .collection("lists").doc(list).update("items",globalThis["lists"][c].items);
        }
        globalThis["listScreen"].lib.save();
        $("input").val("");
      }
    })
    $("input").click(e=>{
      e.stopPropagation();
    })
}
function getCat() {
  return globalThis["settings"].categories[globalThis["txtInScreen"].lib.index];
}
function saveList(list) {
  db.collection("organizers").doc(pageName).collection("lists").doc("list").set(list);
}
////////////////////////////////////////////////////////////////////////
var name = "txtInScreen";
var lib = {
  load:init,
  cats:cats,
  index:index,
  getCategory:getCat
}

export {name,lib};
