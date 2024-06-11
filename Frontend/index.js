const APILINK = "http://localhost:8000/api/v1/users/";

function register() {
  let email = document.getElementById("email").value.toLowerCase();
  let isEmailValid = checkMail(email);
  let password = document.getElementById("password").value;
  let isPasswordValid = checkPassword(password);

  if (isEmailValid && isPasswordValid) {
    fetch(APILINK + email)
      .then((res) => res.json())
      .then(function (data) {
        if (data.status == "new user") {
          fetch(APILINK + "new", {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email, password: password }),
          })
            .then((res) => res.json())
            .then((res) => {
              console.log(res);
              location.replace("login.html");
            });
        } else {
          alert("You're already part of this system");
          location.replace("login.html");
        }
      });
  }
}

function checkMail(email) {
  let splitByAt = email.split("@");

  if (splitByAt.length != 2) {
    alert("Invalid Email Address.");
    return false;
  }

  let domain = splitByAt[1].split(".");

  if (
    domain[0].length > 4 &&
    (domain[1].length == 2 || domain[1].length == 3) &&
    splitByAt[0].length > 0
  ) {
    return true;
  } else {
    alert("Invalid Email Address.");
    return false;
  }
}

function checkPassword(passwordToCheck) {
  let hasSpecialCharacter = false;
  let hasDigit = false;
  let hasUpperCase = false;
  let hasLowerCase = false;

  if (passwordToCheck.length < 8) {
    alert("Password should be atlease 8 characters long.");
    return false;
  } else {
    for (let char = 0; char < passwordToCheck.length; char++) {
      if (hasDigit && hasLowerCase && hasSpecialCharacter && hasUpperCase) {
        return true;
      }

      if (
        passwordToCheck.charCodeAt(char) >= 33 &&
        passwordToCheck.charCodeAt(char) <= 47
      ) {
        hasSpecialCharacter = true;
      } else if (
        passwordToCheck.charCodeAt(char) >= 48 &&
        passwordToCheck.charCodeAt(char) <= 57
      ) {
        hasDigit = true;
      } else if (
        passwordToCheck.charCodeAt(char) >= 65 &&
        passwordToCheck.charCodeAt(char) <= 90
      ) {
        hasUpperCase = true;
      } else if (
        passwordToCheck.charCodeAt(char) >= 97 &&
        passwordToCheck.charCodeAt(char) <= 122
      ) {
        hasLowerCase = true;
      } else if (!hasSpecialCharacter) {
        if (
          passwordToCheck.charCodeAt(char) >= 58 &&
          passwordToCheck.charCodeAt(char) <= 64
        ) {
          hasSpecialCharacter = true;
        }
      }
    }

    if (!hasDigit || !hasLowerCase || !hasSpecialCharacter || !hasUpperCase) {
      alert(
        "Password must contain atleast one uppercase, one lowercase, one numerical and one special character."
      );
      return false;
    }

    return true;
  }
}
