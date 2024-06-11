const APILINK = "http://localhost:8000/api/v1/contents/user/";
const DELAPILINK = "http://localhost:8000/api/v1/contents/";

addEventListener("DOMContentLoaded", (event) => {
  if (sessionStorage.getItem("user")) {
  } else {
    alert("Uhoh you haven't logged in!");
    location.replace("login.html");
  }

  fetch(APILINK + sessionStorage.getItem("user"))
    .then((res) => res.json())
    .then(function (data) {
      if (data.length == 0) {
        let togglingStatement = document.getElementById("togglingStatement");
        togglingStatement.style.display = "block";
      } else {
        let togglingStatement = document.getElementById("togglingStatement");
        togglingStatement.style.display = "none";

        data.forEach((element) => {
          const newRow = document.createElement("tr");

          newRow.innerHTML = `
                <td>
                ${element.title}
                </td>
                <td>
                <button
                    type="button"
                    class="btn border dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    id="${element._id}"
                    onclick="storeId(this)"
                  >
                    <i class="bi bi-three-dots"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="creator.html">Edit</a></li>
                    <li>
                      <a class="dropdown-item" onclick="deletePage()" style="color: red"
                        >Delete</a
                      >
                    </li>
                  </ul>
              </td>
              <td>
              ${element.url}
              </td>
              <td>
              ${element.createdBy}
              </td>
              <td>${element.createdAt}</td>
              <td>
              ${element.modifiedBy}
              </td>
              <td>
                  ${element.modifiedAt}
                </td>
                <td>
                  <p style="background-color: rgba(255, 178, 51, 0.4); width: fit-content; padding: 5% 10%;">${element.status}</p>
                </td>
                `;

          tableBody.appendChild(newRow);
        });
      }
    });
});

function redirectToCreator() {
  sessionStorage.removeItem("currentlyProcessing");
  location.replace("creator.html");
}

function storeId(button){
  let currentlyProcessingId = button.id;
  sessionStorage.setItem("currentlyProcessing", currentlyProcessingId)
}

function deletePage(){
  fetch(DELAPILINK + sessionStorage.getItem("currentlyProcessing"), {
    method: "DELETE"
  }).then(res => res.json())
  .then( res => {
    console.log(res);
    location.reload();
  })
}

function logout(){
  sessionStorage.removeItem("user");
  location.replace("login.html");
}