var defaultWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var mnthTxt = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function display() {
  var date = new Date;
  // date = date.setDate(date.getDate() + 5);
  // date = new Date(date);
  $("liveEventsBtn").off();
  $("changeSched").off();
  $("liveEventsBtn").click(e=>{
    openModal("",getCalId)
  })
  $("changesched").click(()=>{
    var html = `<select id="daySelect">`;
    globalThis["settings"].weekDays.forEach((day, i) => {
      html+=`<option value="${i}">${day}</option>`;
      console.log(day,i);
    });
    html+=`</select><btnChageGo>OK</btnChangeGo>`;
    openModal(html,()=>{
      $("modal btnChageGo").click(()=>{
        globalThis["settings"].thisWeek[`${date.getMonth()}-${date.getDate()}`] = parseInt($("#daySelect").val());
        saveSettings(()=>{globalThis["todayScreen"].makeActive()});
      })
    })
  })
  var activeDay =  parseInt(globalThis["settings"].thisWeek[`${date.getMonth()}-${date.getDate()}`]);
  calcWeek();
  if(!globalThis["settings"].thisWeek[`${date.getMonth()}-${date.getDate()}`]){
    saveSettings();
  }
  // if(!globalThis["todayScreen"].activeDay){
  //   globalThis["todayScreen"].activeDay = date.getDay();
  //   activeDay = globalThis["todayScreen"].activeDay;
  // }
  calcDay(activeDay);
  $("date").text(`${defaultWeek[date.getDay()]}, ${mnthTxt[date.getMonth()]} ${date.getDate()}`);
  var activeHour;
  addGrps();
  if(globalThis["settings"].calendar && !globalThis["calLoaded"]){
    globalThis["calLoaded"] = true;
    getNDrawEvents();
  }
  function addGrps() {
    globalThis["todayScreen"].activeHours = [];
    var grp = globalThis["settings"].allHours[`${activeDay}-${date.getHours()}`].group;
    // if(grp !== "none")grp = globalThis["settings"].groups[grp].categories.toString();
    // $("activeGroup").text(grp);
    globalThis["todayScreen"].groups.forEach((group, i) => {
      var times = globalThis["todayScreen"].times;
      var cats = group==="none" || (group.toString()).startsWith("bappevent")? group:globalThis["settings"].groups[group].categories;
      console.log("FIISISIISISI",cats,globalThis["lists"]);
      var grp = globalThis["settings"].allHours[`${activeDay}-${times[i]}`].group;
      var clss = times[i +1] > date.getHours() && times[i] <= date.getHours() ? "active" : times[i] > date.getHours()? "future": "past";
      var aOp1 = times[i];
      var aOp2 = times[i +1];
      if(!globalThis["settings"].hr24Format){
        aOp1 = aOp1 ===24 ? "12:00 AM": aOp1 > 12 && aOp1 < 24 ? aOp1 -12+":00 PM" :aOp1+":00 AM";
        aOp2 = aOp2 ===24 ? "12:00 AM": aOp2 > 12 && aOp2 < 24 ? aOp2 -12+":00 PM" :aOp2+":00 AM";
      }
      // function getTime() { if() }
      if(!(cats.toString()).startsWith("bappevent")){
        $("todayGroups").append(`<group data="${i}" hr="${times[i]}" class="${clss}">${aOp1} - ${aOp2} ${cats.toString()}</group>`);
        $(`group[data='${i}']`).append(`<bgcover class="${clss}" ></bgcover>`);
      }
      if(globalThis["settings"].groups[group]){
        $(`group[data='${i}'] bgcover`).css("background",globalThis["settings"].groups[group].color);
      }
      if(cats!=="none" && !(cats.toString()).startsWith("bappevent")){
        cats.forEach((list, l) => {
          globalThis["lists"][list].items.forEach((item, t) => {
            $(`group[data = '${i}']`).append(`<li class='${item.completed}'>${item.text}</li>`);
          });
        });
      }
      else if(group.startsWith("bappevent")){
        var tev = globalThis["todayScreen"].events[group.replace("bappevent","")];
        var loc = "";
        if(tev.location)loc = tev.location;
        console.log(tev);
        $("todayGroups").append(`<group data="${i}" hr="${times[i]}" class="${clss}">
        ${(new Date(tev.start.dateTime)).toLocaleTimeString()}
        - ${(new Date(tev.end.dateTime)).toLocaleTimeString()}
        <title>${tev.summary}</title><location>${loc}</location></group>`);
        $(`group[data='${i}']`).append(`<bgcover class="${clss}" ></bgcover>`);
          // $(`group[data = '${i}']`).append(`<event class='event'></event>`);
      }
      // console.log(cats);

    });
  }
}

function addEvents() {
  if(!globalThis["settings"].calendar){
    getCalId(getNDrawEvents);
  }
  else {
    getNDrawEvents();
  }
}
function drawEvs(r) {
  var events = r.items;
  globalThis["todayScreen"].events = {};
  globalThis["todayScreen"].evHours = [];
  if(events.length > 0){
    events.forEach((ev, i) => {
      if(ev.start.date){
        var evDate = new Date(ev.start.date);
        var tdate = new Date();
        var datesMatch = evDate.getDay() === tdate.getDay()
        && evDate.getMonth() === tdate.getMonth()
        && evDate.getDate() === tdate.getDate()
        && evDate.getYear() === tdate.getYear();
        if(datesMatch){
          $("alldayEvents").append(`<event><name>${ev.summary}</name><event>`);
        }
      }
      else if (ev.start.dateTime) {
        var evDate = new Date(ev.start.dateTime);
        var tdate = new Date();
        var datesMatch = evDate.getDay() === tdate.getDay()
        && evDate.getMonth() === tdate.getMonth()
        && evDate.getDate() === tdate.getDate()
        && evDate.getYear() === tdate.getYear();
        if(datesMatch){
          console.log(ev);
          globalThis["todayScreen"].evHours[globalThis["todayScreen"].evHours.length] = evDate.getHours();
          globalThis["todayScreen"].events[evDate.getHours()] = ev;
          // $(`group[hr='${evDate.getHours()}']`).append(ev.summary);
          // if($(`group[hr='${evDate.getHours()}']`).length === 0){
          //   globalThis["todayScreen"].groups.forEach((grp, i) => {
          //     console.log(evDate.getHours(),globalThis["todayScreen"].times[i],grp);
          //     if (globalThis["todayScreen"].times[i] > evDate.getHours()) {
          //       $(`group[hr='${globalThis["todayScreen"].times[i]}']`).append(`<event>`);
          //     }
          //   });
          // }
        }
      }
      // get ev time
      // append details to hour group
    });
  }
  globalThis["todayScreen"].makeActive();
}
function getNDrawEvents() {
  globalThis["gLoaded"] = true;
  var tdate = new Date();
  currentReq.body = {
  };
    gapiAuth(gapiMethods.cal+`calendars/${globalThis["settings"].calendar}/events?timeMin=`+new Date(new Date((new Date()).setHours(0)).setMinutes(0)).toISOString(),drawEvs);
}
function makeCalList(cals,cb) {
  var thisCal;
  cals.items.forEach((calendar, i) => {
    var isActive = "";
    if(!globalThis["settings"].calendar && calendar.primary){
      globalThis["settings"].calendar = calendar.id;
      thisCal = calendar.id;
      isActive = "checked";
    }
    if(calendar.id === globalThis["settings"].calendar){
      thisCal = calendar.id;
      isActive = "checked";
    }
    $("modal").append(`<label><input id='${calendar.id}' class='calIdSelect' ${isActive} name="calIdSelect" type='radio'/>${calendar.summary}</label>`);
  });
  $(".calIdSelect").click(e=>{
    globalThis["settings"].calendar = e.target.id;
    saveSettings();
    getNDrawEvents();
  })
}
function getCalId(cb) {
  gapiAuth(gapiMethods.cal+"users/me/calendarList",makeCalList,cb);
}

function calcDay(wd){
  var groups = [];
  var times = [];
  var grp = 0;
  var lastg;
  for(var h=0;h<24;h++){
    var cg = globalThis["settings"].allHours[`${wd}-${h}`].group;
    if(cg !== lastg || (globalThis["todayScreen"].evHours && globalThis["todayScreen"].evHours.indexOf(h) > -1)){
      times[times.length] = h;
      if(globalThis["todayScreen"].evHours && globalThis["todayScreen"].evHours[globalThis["todayScreen"].evHours.indexOf(h)]){
        cg = "bappevent"+globalThis["todayScreen"].evHours[globalThis["todayScreen"].evHours.indexOf(h)];
      }
      groups[grp] = cg;
      lastg = cg;
      grp++;
    }
  }
  times[times.length] = 24;
  globalThis["todayScreen"].groups = groups;
  globalThis["todayScreen"].times = times;
  $("following").html("Following Schedule:<em>"+globalThis["settings"].weekDays[wd]+"</em>");
}

function calcWeek() {
  var fdate = new Date();
  // fdate = fdate.setDate(fdate.getDate() + 5);
  // fdate = new Date(fdate);
  var day = fdate.getDay();
  var date = fdate.getDate();
  var mnth = fdate.getMonth();
  var sched = getToday();
  var cyclelen = globalThis["settings"].weekDays.length;
  var storedWeek = globalThis["settings"].thisWeek;
  globalThis["settings"].thisWeek = {};
  console.log("SCHED",sched);
  if(!sched)sched = day;
  var schedCounter = sched;
  var i = 0;
  for (var d = day; d < 7 + day ; d++) {
    var wd = d;
    if(wd >= 7) wd -= 7;
    if(sched >= cyclelen) sched -= cyclelen;
    var isFixed = false;
    var fixedDay = globalThis["settings"].fixedDays[wd];
    if(fixedDay){
      switch (fixedDay.type) {
        case "hold":
          schedCounter = sched;
          sched = fixedDay.schedule;
          break;
        case "skip":
          schedCounter = sched;
          schedCounter++;
          sched = fixedDay.schedule
          break;
      }
    }
    else {
      schedCounter = sched;
      schedCounter++;
    }
    var tdate = new Date;
    // tdate = tdate.setDate(tdate.getDate() + 5);
    // tdate = new Date(tdate);
    // console.log(tdate);
    tdate = tdate.setDate(tdate.getDate() + i);
    // console.log(tdate);
    tdate = new Date(tdate);
    globalThis["settings"].thisWeek[`${tdate.getMonth()}-${tdate.getDate()}`] = sched;
    sched = schedCounter;
    i++;
  }

  function getToday() {
    var rday = null;
    if(globalThis["settings"].thisWeek[`${mnth}-${date}`] !== undefined){
      console.log(1);
      // globalThis["todaySched"] =
      rday =  globalThis["settings"].thisWeek[`${mnth}-${date}`];
    }
    if (globalThis["settings"].fixedDays[day] !== undefined){
      console.log(2);
      rday = globalThis["settings"].fixedDays[day].schedule;
    }
    return rday;
  }
}

function listenSettings(cb) {
    db.collection("organizers").doc(pageName).onSnapshot(d=>{
      globalThis["settings"] = {};
      globalThis["settings"] = d.data();
      if(cb && globalThis["todayScreen"].isLoaded !== true){
        globalThis["todayScreen"].isLoaded = true;
        globalThis["todayScreen"].makeActive();
      }
    })
}
function saveSettings(cb) {
  db.collection("organizers").doc(pageName).update(globalThis["settings"]).then(cb);
}
function openModal(txt,cb) {
  if ($("modal").hasClass("hidden")){
    $("modal").html(txt);
    $("modal").removeClass("hidden");
    cb();
  }
  else {
    $("modal").html("");
    $("modal").addClass("hidden");
  }
}
////////////////////////////////////////////////////////////////////////
var name = "todayScreen";
var lib = {
  load:display,
  snap:listenSettings,
  save: saveSettings,
  calOpts:()=>{
    openModal("",getCalId);
  }
}

export {name,lib};
