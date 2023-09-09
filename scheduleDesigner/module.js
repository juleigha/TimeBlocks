var defaultWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var defaultCategories = ["Tasks","Goals","Chores","Errands"];
var btnString = "<btns><ok>OK</ok><cancel>Cancel</cancel></btns>";
var weekSettings = [];
var tdate = new Date();
var writingGoal = 0;
var isEdit = true;
var screenCycle;
var screenNames = ["tabBtn_Tasks","tabBtn_Chores"];
var screenPages = ["tabBtn_Chores"];
var screenNum = 0;
var upcoming = [];
var currentGroup = {};
var cycle = ["Tasks","Goals","Errands"];
var userData;
var categories;
var allTasks={};
var todayGroups = [];
// week view screen
var settings = {
  weekStart : 0,
  cycleType: "weekDays",
  weekDays : defaultWeek,
  groups:[],
  allHours:{},
  categories:defaultCategories,
  thisWeek:{},
  fixedDays:{},
  hr24Format: false
}
var centered = 1;
var selectedGroup = "none";
var today;

var selected ={};
function loadSchedule(){
  $("bottomControls > div").css("background-size","contain")
  $("#svgLeft img").attr("src","'images/left.svg')");
  $("#svgRight img").attr("src","images/right.svg");
  $("html").addClass("hourGroupView");
  calcScrollBar();
  // $.get("../listView.php").then(r=>{
  //   $("listView").html(r);
  //   initListView(groupText);
  //   changeScreen();
  // })
  db.collection("organizers").doc(pageName).get().then((r)=>{
    if((!r.data() ) && pageName === uid){
      db.collection("organizers").doc(pageName).set(settings);
      centered = settings.weekDays.length -1;
    }
    else if(r.data()) {
      settings = r.data();
      centered = settings.weekDays.length -1;
    }
    else {
      dbSignOut();
    }
    //generate drop down
    updateCatSelect();
    // generate current settings
    // generate weekdays
    $("week").append(` <day dayNum="-1" class="padder">      <name></name>      </day>      `);
    settings.weekDays.forEach((day, i) => {
      $("week").append(`
        <day dayNum="${i}">
        <name>${day}</name>
        </day> `);
        for(var j=0;j<24;j++){
          var fhr =j;
          if(!settings.hr24Format) fhr = j > 12 ? j - 12 : j;
          $(`day[daynum ="${i}" ]`).append(`<hour id="${i}-${j}"><checkbox id="${i}-${j}" class="hidden"><img src="images/unchecked.svg"></checkbox><hrNum>${fhr}</hrNum></hour>`);
          if (!settings.allHours[i+"-"+j]){
            settings.allHours[i+"-"+j] = {
              group : "none"
            }
          }
          else if(settings.allHours[i+"-"+j].group !== "none") {
            $("#"+i+"-"+j).addClass("group"+settings.allHours[i+"-"+j].group);
          }
        }

      });
      $("week").append(` <day dayNum="-1" class="padder">      <name></name>      </day>      `);
      updateSettings();
      $("overflow").animate({"left":`${-(($("day").width() + parseInt($("day").css("margin-right")) )*(settings.weekDays.length-centered)) +(window.innerWidth /2) - ($("day").width()/2) - ((parseInt($("day").css("margin-right"))/2) ) }px`})
      updateColor();
  })
  $("#btnDone").click(e=>{
    openModal();
    $("modal").html(`
      <h3>Leave schedule designer?</h3>
      <btns>
        <y>Yes</y>
        <n>No</n>
      <btns>`);
      $("modal y").click(e=>{
        location.href = `${siteStrg}/?${pageName}`;
      })
      $("modal n").click(closeModal);
  })
  $("#btnScrollRight").on("mousedown touchstart",()=>{
    $("#raColor").attr("style","fill:"+defaultColors.ltGrey);
  })
  $("#btnScrollRight").on("mouseup touchend", ()=>{
    $("#raColor").attr("style","fill:"+defaultColors.highlight1);
  })
  $("#btnScrollRight").click(()=>{
    centered --;
    scrollWeek();
  })
  $("#btnScrollLeft").on("mousedown touchstart",()=>{
    $("#laColor").attr("style","fill:"+defaultColors.ltGrey);
  })
  $("#btnScrollLeft").on("mouseup touchend", ()=>{
    $("#laColor").attr("style","fill:"+defaultColors.highlight1);
  })
  $("#btnScrollLeft").click(()=>{
    centered ++;
    scrollWeek();
  })
  function calcScrollBar(){
    var maxScrl = $("topControls")[0].scrollWidth;
    // $("cssScrollBar").css("width",maxScrl+"px");
    var bwth = $("topControls").width();
    console.log(maxScrl,bwth);
    bwth -=  (maxScrl - bwth);
    // 100% = maxScrl
    var scrl = $("topControls").scrollLeft();
    $("cssScrollBar bar").css("width",(bwth)+"px");
    $("cssScrollBar bar").css("left",(scrl+4)+"px");

  }
  $("topControls").on("scroll",calcScrollBar);
  function scrollWeek() {
    $("#dayName").text(settings.weekDays[settings.weekDays.length -1- centered]);
    if(centered <= -1){
      centered = settings.weekDays.length - 1;
    }
    else if (centered >= settings.weekDays.length){
      centered = 0;
    }
    var pdding = (window.innerWidth - $("day").width())/2;
    $("overflow").animate({"left":- $($("day")[settings.weekDays.length-centered]).position().left+ pdding +"px"});
    // $("overflow").animate({"left":`${-(($("day").width() + parseInt($("day").css("margin-right")))    *(settings.weekDays.length-centered)) }px`});
    // $("overflow").animate({"left":`${(-(($("day").width() +(parseInt($("day").css("margin-right"))) +(window.innerWidth /2) - ($("day").width()/2) - ((parseInt($("day").css("margin-right"))/2) ) +20)*(settings.weekDays.length-centered)))-20}px`})
    // $("overflow").animate({"left":`${(-(($("day").width() +(parseInt($("day").css("margin-right"))/2) +25)*(settings.weekDays.length-centered)))}px`})

    // $("overflow").animate({"left":`${-(($("day").width() )*(settings.weekDays.length-centered))}px`})
  }
  // nav btns
  $("#btnSelectHours").click(()=>{
    $(".cntrlCntnr").addClass("hidden");
    $("#ctrlCntnrBackBtns").removeClass("hidden");

    $("#cntrlCntnrHourGroups").removeClass("hidden");
    hourlyBoxes();
  });
  $("#btnSelectGroups").click(()=>{
    $(".cntrlCntnr").addClass("hidden");
    $("#ctrlCntnrBackBtns").removeClass("hidden");

    $("#cntrlCntnrCategories").removeClass("hidden");
    grouplyBoxes();
  });
  $("#btnBckToMain").click(()=>{
    $(".cntrlCntnr").addClass("hidden");
    $("#cntrlCntnrHomeBtns").removeClass("hidden");
    $("checkbox").addClass("hidden");
    $("checkbox").off();
    $("hour").off();
    $(".groupHighlight").removeClass("groupHighlight");
    selected = {};
    selectedGroup  = "none";
  });
  // custom
  $("#btnChangeGrpColor").click(()=>{
    if(selectedGroup === "none"){
      $("#btnChangeGrpColor").val("Please select time group");
    }
    else {
      changeGroupColor();
    }
  })

  $("#btnGroupHours").click(()=>{
    var selectedGroup;
    Object.keys(selected).forEach((hour, i) => {
      if(i===0){
        selectedGroup = settings.allHours[hour].group;
        if (selectedGroup === "none"){
          selectedGroup = settings.groups.length;
          var c1 = Math.floor(1000 - Math.random(600) * 1000);
          c1 = c1 > 745 ? 1000 - c1 :  c1 > 255 - (Math.random(Math.random(8))*10)? c1 - 255 :c1;
          var c2 = Math.floor(1000 - Math.random(1) * 1000);
          c3 = c2 > 745 ? 1000 - c2  :  c1 > 255 -(Math.random(Math.random(56))*10)? c2 - 255:c2;
          var c3 = Math.floor(1000 - Math.random(8) * 1000);
          c3 = c3 > 745 ? 1000 - c3 :  c3 > 255 - (Math.random(Math.random(3))*10)? c3 - 255 :c3;
          if(c1 > 250 && c2 > 250 && c3 > 250){
            c1-=15;
            c2-=15;
            c3-=15;
          }
          settings.groups[selectedGroup] = {
            color:`rgb(${c1},${c2},${c3})`,
            categories:[]
          };
        }
        console.log(selectedGroup);
      }
      if(selectedGroup !== "none"){
        $("#"+hour).removeClass();
        $("#"+hour).addClass("group"+selectedGroup);
      }
      settings.allHours[hour].group = selectedGroup;
    });
    updateColor();
    updateSettings();
  });

  $("#btnUngroupHours").click(()=>{
    var grpname;
    Object.keys(selected).forEach((hour, i) => {
      $("#"+hour).removeClass();
      if (i===0) grpname = settings.allHours[hour].group;
      settings.allHours[hour].group = "none";
      console.log(hour);
    });
    var delGroup = true;
    Object.keys(settings.allHours).forEach((hour, i) => {
      if(settings.allHours[hour].group === grpname ){
        delGroup = false;
      }
    });
    if(delGroup){
      var newgrps = [];
      settings.groups.forEach((group, i) => {
        if (i !== parseInt(grpname)){
          newgrps[newgrps.length] = group;
        }
      });
    }
    updateColor();
    updateSettings();
  })

  $("#btnDeselectAll").click(e=>{
    $(".selected").children("img").attr("src","images/unchecked.svg");
    $(".selected").removeClass("selected");
    selected = {};
  })
  function hourlyBoxes() {
    $("hour > *").removeClass("hidden");
    $("hour").click((e)=>{
      console.log(e);
      if(selected[e.target.id] && selected[e.target.id].hasClass("selected")) {
        selected[e.target.id].children("img").attr("src","images/unchecked.svg");
        selected[e.target.id].removeClass("selected");
        delete selected[e.target.id];
      }
      else {
        selected[e.target.id] = $(e.target).children("checkbox");
        selected[e.target.id].addClass("selected");
        selected[e.target.id].children("img").attr("src","images/checked.svg");
      }
      console.log(e.target.id,selected );
    });
  }

  function grouplyBoxes() {
    $("hour").click((e)=>{
      selectedGroup = settings.allHours[e.target.id].group;
      $("#btnChangeGrpColor").val("Change Color");
      $(".groupHighlight").removeClass("groupHighlight");
      if(selectedGroup !== "none"){
        $(".group"+selectedGroup).addClass("groupHighlight");
        catsList();
        catBtns();
      }
    });
  }
  function catsList() {
    var cats = "";
    settings.groups[selectedGroup].categories.forEach((cat, i) => {
      cats += cat + ", ";
    });
    $("#selectCatDisplay").html((cats.substr(0,cats.length-2)));
  }
  $("select").on("change",()=>{
    catBtns();
  })
  function catBtns() {
    $("#btnRemoveFromCategory").addClass("hidden");
    $("#btnAddToCategory").addClass("hidden");
    if (settings.groups[selectedGroup].categories.indexOf($("select").val()) > -1) {
      $("#btnRemoveFromCategory").removeClass("hidden");
      $("#btnRemoveFromCategory").val(`Remove ${$("select").val()} from time group`);
    }
    else {
      $("#btnAddToCategory").removeClass("hidden");
      $("#btnAddToCategory").val(`Add ${$("select").val()} to time group`);
    }
  }
  $("#btnAddToCategory").click(()=>{
    settings.groups[selectedGroup].categories[settings.groups[selectedGroup].categories.length]=$("select").val();
    catsList();
    catBtns();
    updateSettings();
  });
  $("#btnRemoveFromCategory").click(e=>{
    var newCats = [];
    settings.groups[selectedGroup].categories.forEach((cat, i) => {
      if(cat !== $("select").val()) newCats[newCats.length] = cat;
    });
    settings.groups[selectedGroup].categories = newCats;
    catsList();
    catBtns();
    updateSettings();
  })
  $("#btnEditCatergories").click(e=>{
    appendInput("categories","Category","modal");
    openModal();
  })
  $("#btnEditDays").click(()=>{
    openModal();
    var days = '';
    settings.weekDays.forEach((day, i) => {
      days += `<li listnum='${i}'>${day}<btn class='renameIn' listnum='${i}' data='${day}' >Rename</btn> <btn class='renameIn'>Delete</btn> </li>`;
    });
    $("modal").html(`
        <opts>
          <span>Cycle by:</span>
          <opt><input type='radio' name='dayType' value='weekDays' />Week Days</opt>
          <opt><input type='radio' name='dayType' value='custom'/>Custom Cycle</opt>
        </opts>
        <settingsCntnr class='hidden'></settingsCntnr>
        <btns><ok>OK</ok></btns>
    `);
    if(settings.cycleType !== "weekDays"){
      $("settingsCntnr").removeClass("hidden");
      $("modal input[value='custom']").prop("checked","true");
    }
    else {
      $("modal input[value='weekDays']").prop("checked","true");
    }
    appendInput("weekDays","Day","settingsCntnr");
    // $("settingsCntnr ul").prepend(days);
    $("modal input").on("change",()=>{
      var choice = $("modal input:checked").val();
      if(choice === "custom"){
        $("modal settingsCntnr").removeClass("hidden");
      }
      else {
        $("modal settingsCntnr").addClass("hidden");
      }
    })
    $("modal ok").click(e=>{
      settings.cycleType = $("modal input:checked").val();
      if(settings.cycleType === "weekDays"){
        settings.weekDays = defaultWeek;
        globalThis["scheduleDesigner"].makeActive();
      }
      updateSettings();
    })
  })
  function changeGroupColor() {
    openModal();
    var crnt = settings.groups[selectedGroup].color.replace("rgb(","");
    crnt = crnt.replace(")","");
    crnt = crnt.split(",");
    console.log(crnt);
    $("modal").append(`
      <p>R:<input type="range" value="${crnt[0]}" min="0" max="255"> <spanr></spanr> </p>
      <p>G:<input type="range" value="${crnt[1]}" min="0" max="255"> <spanb></spanb> </p>
      <p>B:<input type="range" value="${crnt[2]}" min="0" max="255"> <spang></spang> </p>
      <example></example>${btnString}
      `);
      upd();
    $("modal input").on("touchmove mousemove change",e=>{
      upd();
    })
    $("modal ok").addClass("color");
    $("modal ok.color").click(()=>{
      $("modal ok").off();
      $("modal ok").removeClass("color");
      settings.groups[selectedGroup].color = `rgb(${$("modal input")[0].value},${$("modal input")[1].value},${$("modal input")[2].value})`;
      updateColor();
      closeModal();
      updateSettings();
    })
    $("modal cancel").click(()=>{
      closeModal();
    })
    function upd() {
      $("spanr").text($("modal input")[0].value);
      $("spanb").text($("modal input")[1].value);
      $("spang").text($("modal input")[2].value);
      $("example").css("background-color",`rgb(${$("modal input")[0].value},${$("modal input")[1].value},${$("modal input")[2].value})`);
    }
  }

}
function openModal() {
  $("modal").removeClass("hidden");
  $("topControls").addClass("hidden");
}
function closeModal() {
  $("topControls").removeClass("hidden");
  $("modal").addClass("hidden");
  $("modal *").off();
  $("modal").html("");
  updateCatSelect();
}
function updateSettings(callback) {
  settings.groups.forEach((grp, i) => {
    var ncats = [];
    grp.categories.forEach((str, i) => {
      if(settings.categories.indexOf(str) > -1 && ncats.indexOf(str)===-1){
        ncats[ncats.length] = str;
      }
    });
    grp.categories = ncats;
  });
  db.collection("organizers").doc(pageName).set(settings).then(r=>{
    if(callback){
      callback();
    }
  });
}
function updateColor() {
  $("hour").css("background-color","");
  settings.groups.forEach((group, i) => {
    $(".group"+i).css("background-color",group.color);
  })
  // Object.keys(settings.allHours).forEach((hour, i) => {
  //   console.log(hour, settings.allHours[hour]);
  //   if (settings.allHours[hour].group !== "none") {
  //     $("#"+hour).css("background-color",settings.groups[settings.allHours[hour].group].color);
  //   }
  // });
}
var renameable = [];
function appendInput(vraystring,thing,div){
  var vray = settings[vraystring];
  var cats = "";
  $(div).append("<ul></ul>");
  div = div +" ul";
  vray.forEach((cat, i) => {
    addItem(cat,i,div);
  });
  appendAdder(div);

  function appendAdder(div) {
    $(div).append(`<li id="btnAddCat">Add ${thing}</li>`);
    $("#btnAddCat").click(e=>{
      $("modal close").addClass("hidden");
      $("#btnAddCat").off();
      $("#btnAddCat *").off();
      $("#btnAddCat input").focus();
      $("#btnAddCat").html(`<input type='text' value=''>${btnString}`);
      $("#btnAddCat ok").click(e=>{
        console.log(vray,div);
        $("modal close").removeClass("hidden");
        $(`#btnAddCat *`).off();
        $(`#btnAddCat`).off();
        var len = vray.length;
        vray[len] = $(`#btnAddCat input`).val();
        addItem(vray[len],len,div);
        if(vraystring === "categories"){
          globalThis["listScreen"].lib.addNewList(vray[len]);
        }
        updateSettings();
        $("#btnAddCat").remove();
        appendAdder(div);
      })
      $("#btnAddCat cancel").click(e=>{
        $("modal close").removeClass("hidden");
        $("#btnAddCat").remove();
        appendAdder(div);
      })
    });
    $("modal").append(`<close>Close</close>`);
    $("modal close").click(closeModal);
  }
  function addItem(cat, i) {
    if($(`li[listnum='${i}']`).text() !== ""){
      $(`li[listnum='${i}']`).html(`${cat}<btn class='renameIn' renameId='${i}' data='${cat}' >Rename</btn> <btn class='renameIn'>Delete</btn>`);
    }
    else {
      $(div).append(`<li listnum='${i}'>${cat}<btn class='renameIn' renameId='${i}' data='${cat}' >Rename</btn> <btn class='renameIn' deleteID=${i}>Delete</btn> </li>`);
    }
    $(`btn[renameId='${i}']`).click(e=>{
      $("modal close").addClass("hidden");
      $(`btn[renameId='${i}']`).off();
      $(`li[listnum='${i}']`).html(`<input type='text' value='${cat}'>${btnString}`);
      $(`li[listnum='${i}'] input`).focus();
      $(`li[listnum='${i}'] ok`).click(e=>{
        $(`li[listnum='${i}'] *`).off();
        $("modal close").removeClass("hidden");
        $(`li[listnum='${i}']`).off();
        vray[i] = $(`li[listnum='${i}'] input`).val();
        if(vraystring === "categories"){
          globalThis["listScreen"].lib.addNewList(vray[len]);
          globalThis["settings"].categories[globalThis["settings"].categories.length] = len;
        }
        addItem(vray[i],i);
        updateSettings();
      })
      $(`li[listnum='${i}'] cancel`).click(e=>{
        $("modal close").removeClass("hidden");
        $(`li[listnum='${i}'] *`).off();
        $(`li[listnum='${i}']`).off();
        addItem(vray[i],i);
      })
    })
    $(`btn[deleteId='${i}']`).click(e=>{
      var nray = [];
      vray.forEach((item, id) => {
        if(i !== id){
          nray[nray.length] = item
          console.log(id,i,item);
        }
        else if(globalThis["lists"][item]) {
          var nlists = {};
          if(confirm(`Do you want to remove ${item} and all of its items from your saved data?`)){
            Object.keys(globalThis["lists"]).forEach((list, l) => {
              if(list !== item)
              nlists[list] = globalThis["lists"][list];
            });
            globalThis["lists"] = nlists;
            globalThis["listScreen"].lib.save();
            globalThis["txtInScreen"].index =0;
          }
          else {
            nray[nray.length] = item
          }

        }
      });
      settings[vraystring] = nray;
      console.log(vray,settings);
      // console.log(vray,settings);
      // $(`li[listnum='${i}']`).remove();
      $(`li[listnum='${i}'] *`).off();
      $(`li[listnum='${i}']`).off();
      $(`li[listnum='${i}']`).remove();
      updateSettings();
    })
  }
}
function updateCatSelect() {
  $("#slctCategory").html("");
  settings.categories.forEach((cat, i) => {
    $("#slctCategory").append(`<option value="${cat}">${cat}</option>`);
  });
}
$("loadingcuz").text("Schedulize, Taskinate, do it all");
// firebase.auth().onAuthStateChanged(user => {
//   if (user) {
//     $("authPage").html("");
//     $("loadingcuz").text("Your schedule is around here somewhere...");
//     em = (user.email.replace("@","")).replace(".","");
//     uid = user.uid;
//   }
//   else if(pageNames[0] !== ''){// && NO COOKIE){
//     $("loadingcuz").text("Your log-in expired. Please re-authorize your session");
//     location.href = siteStrg;
//   }
//   else {
//     $("loadingcuz").text("You can log in or sign up here");
//     $.get("authorize/index.php").then(r=>{
//       $("authPage").html(r);
//     })
//   }
// });

var name = "scheduleDesigner";
var lib = {
  load: loadSchedule
}
export {name,lib};
