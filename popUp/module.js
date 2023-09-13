//list screen gets all the lists in pagename/lists/list

var mList;
var defaultItem = {
  text:"",
  completed:false
}
var defaultList = {
  Tasks:{
    name:"Tasks",
    items:[]
  },
  Chores:{
    name:"Chores",
    items:[]
  },
  Errands:{
    name:"Errands",
    items:[]
  },
  Goals:{
    name:"Goals",
    items:[]
  }
};
var listItem = $("listItem");

function updateDisplay() {
  globalThis["settings"].categories.forEach((list, l) => {
    console.log(globalThis["lists"]);
    $("active").append(`<ul which='${list}'>${list}</ul>`);
    $("completed").append(`<ul which='${list}'>${list}</ul>`);

    console.log(list);
    globalThis["lists"][list].items.forEach((item, id) => {
      var li = `<li id='${l}-${id}'><img src="images/checked.svg" class="checkbox selected" id='${l}-${id}'/>${item.text}</li>`;
      if (item.completed)$(`completed ul[which='${list}']`).append(li);
      else {
        var li = `<li id='${l}-${id}'><img src="images/unchecked.svg" class="checkbox" id='${l}-${id}'/>${item.text}</li>`;
        $(`active ul[which='${list}']`).append(li);
      };
    });
  });
  var date = new Date();
  if (globalThis["todayScreen"].groups) {
    globalThis["todayScreen"].groups.forEach((grp, i)=>{
      var clss = globalThis["todayScreen"].times[i +1] > date.getHours() && globalThis["todayScreen"].times[i] <= date.getHours() ? "active" : globalThis["todayScreen"].times[i] > date.getHours()? "future": "past";
      if(clss === "active" && grp !== "none"){
        globalThis["settings"].groups[grp].categories.forEach((cat, c) => {
          $(`active ul[which='${cat}']`).addClass("working");
        });
      }
    })
  }
  if(globalThis["isGoogleUser"]){
    // gapiAuth(gapiMethods.tasks+"notes",(r)=>{
    //   console.log(r);
    // });
  }
  $("li").click((e)=>{
    console.log(e.target.id);
    var cat = $($("#"+e.target.id).closest("ul")[0]).attr("which");
    if($("#"+e.target.id +".checkbox").attr("src") === "images/unchecked.svg"){
      $("#"+e.target.id +".checkbox").attr("src","images/checked.svg");
      $("#"+e.target.id +".checkbox").addClass("selected");
      globalThis["lists"][cat].items[(e.target.id).split("-")[1]].completed = true;
      console.log(globalThis["lists"][cat].items[(e.target.id).split("-")[1]]);
    }
    else {
      $("#"+e.target.id +".checkbox").attr("src","images/unchecked.svg");
      $("#"+e.target.id +".checkbox").removeClass("selected");
      globalThis["lists"][cat].items[(e.target.id).split("-")[1]].completed = false;
    }
    if(globalThis["lists"][cat].shared){
      var lst = globalThis["lists"][cat].shared.split("/");
      db.collection("organizers").doc(lst[0]).collection("lists").doc(lst[1]).update("items",globalThis["lists"][cat].items);
    }
  })
}
function setSnap(cb) {
  db.collection("organizers").doc(pageName).collection("lists").doc("list").onSnapshot(lists=>{
    mList = lists.data();
    if(!mList)mList = defaultList;
    if(!globalThis["lists"])globalThis["lists"] =mList;
    var m=0;
    var v=0;
    globalThis["settings"].categories.forEach((list,i)=>{
      if (globalThis["lists"][list].shared) {
        m++;
        var lst = globalThis["lists"][list].shared.split("/");
        if(!allSnaps[list]){
          db.collection("organizers").doc(lst[0]).collection("lists").doc(lst[1]).onSnapshot(sharedList=>{
            v++;
            console.log(list, "#########",lst,m,sharedList.data().items);
            globalThis["lists"][list].items = sharedList.data().items;
            // globalThis["listScreen"].makeActive();
            $("lists").html(globalThis["listScreen"].body);
            updateDisplay();
          });
          allSnaps[list] = true;
        }
      }
      else {
        globalThis["lists"][list] = mList[list];
      }
    })
    if(cb && globalThis["listScreen"].isLoaded !== true){
      globalThis["listScreen"].makeActive();
      globalThis["listScreen"].isLoaded = true;
    };
  })
}
function saveList(callback) {
  db.collection("organizers").doc(pageName).collection("lists").doc("list")
  .set(globalThis["lists"]).then(d=>{
    if(callback) callback();
  })
}
function storeList(name,list) {
  globalThis[name] = list;
}
function addList(list,shared) {
  if(globalThis["lists"] !== undefined){
    if(!globalThis["lists"][list]){
      globalThis["lists"][list] = { name:list, items:[] };
      if(shared) globalThis["lists"][list].shared = shared;
      globalThis["listScreen"].lib.save();
      // db.collection("organizers").doc(pageName).collection("lists").doc("list").set(globalThis["lists"]);
    }
  }
}
////////////////////////////////////////////////////////////////////////
var name = "listScreen";
var lib = {
  snap:setSnap,
  load:updateDisplay,
  save:saveList,
  addNewList:addList
}

export {name,lib};
