class Page {
  constructor(module) {
    this.name = module.name;
    this.lib = module.lib;
    this.style = screens[module.name].style;
    this.body = screens[module.name].body;
    globalThis[module.name] = this;
    var screenName = pageNames[pageNames.length-1];
    var noScreen = screenName === this.name && screenName !== "authScreen";
    var needSnap = (!this.isLoaded && this.lib.snap);

    if (noScreen && needSnap ) {
      this.lib.snap(true);
    }
    else if (noScreen) {
      window.history.pushState('', 'Organizer', "?"+globalThis['uid']+"/"+this.name);
      $("currentScreen").html(this.body);
      $("style.dyn").html(this.style);
      this.lib.load();
    }
    else if (needSnap) {
      this.lib.snap();
      this.isLoaded = true;
    }
  }
  makeActive() {
    window.history.pushState('', 'Organizer', "?"+globalThis['uid']+"/"+this.name);
    $("currentScreen").html(this.body);
    $("style.dyn").html(this.style);
    this.lib.load();
  }
}
var defaultColors = {
  ltGrey: "#d2daff5e",
  drkGrey: "#e7e0e0",
  highlight1:"#ebd083",
  navy:"#33334a",
  highlight2:"#ffffff91"
}
function changeRootColors() {
  var html = ':root {';
  Object.keys(defaultColors).forEach((color) => {
    html+=`
    --${color}:${defaultColors[color]};`;
  });
  html=html.slice(0,html.length-1);
  html+='}';
  $("#rootColors").html(html);
}
