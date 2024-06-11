const APILINK = "http://localhost:8000/api/v1/users/";

function login() {
  let email = document.getElementById("email").value.toLowerCase();
  let password = document.getElementById("password").value;

  fetch(APILINK + email)
    .then((res) => res.json())
    .then(function (data) {
      if (data.status == "new user") {
        alert(
          "Aw you're new to Rapid Page Builder. Please Register yourself first."
        );
        location.replace("index.html");
      } else {
        if (data[0].password == password) {
          sessionStorage.setItem("user", email);
          location.replace("home.html");
        } else {
          alert(
            "I think you either forgot your password or you're trying to get into someone else's account."
          );
        }
      }
    });
}
