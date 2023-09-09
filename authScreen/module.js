var name = "authScreen";
var newUser = false;
var lib = {
  showPassLogin:(isNew)=>{
    $("signOption").removeClass("hidden");
    $("passLogin").removeClass("hidden");
    $("passLogin *").removeClass("hidden");
    $("back").removeClass("hidden");
    $("signOption").addClass("hidden");
    $("confirm").removeClass("hidden");
    if(isNew){
      newUser = true;
      $("signOption[opt='1']").removeClass("hidden");
      $("btnLogin").text("Sign Up");
    }
    else {
      newUser = false;
      $("btnLogin").text("Login");
      $("signOption[opt='2']").removeClass("hidden");
      $("#passConfirm").addClass("hidden");
    }
  },
  back:()=>{
    $("signOption").removeClass("hidden");
    $("passLogin").addClass("hidden");
    $("back").addClass("hidden");
    $("confirm").addClass("hidden");
  },
  dbLogin:()=>{
    if(newUser)
    passwordSignIn("Create Account",dbMakeUser,true);
    else
    passwordSignIn("Sign In",dbSignIn);
  },
  load:()=>{}
}

export {name,lib};


function passwordSignIn(bt,cb,nu) {
    if (nu && $("#txtInScrt").val() !== $("#txtInScrt2").val()) {
      $("error").text("passwords do not match");
    }
    else {
      return cb($("#txtInEmail").val(),$("#txtInScrt").val());
    }
}
