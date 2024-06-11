addEventListener("DOMContentLoaded", (event) => {
    if(sessionStorage.getItem("user")){}
    else{
        alert("Uhoh you haven't logged in!");
        location.replace("login.html");
    }
})

function redirect(){
    sessionStorage.removeItem("currentlyProcessing");
    location.replace("creator.html"); 
}

function logout(){
    sessionStorage.removeItem("user");
    location.replace("login.html");
}