const APILINK = "http://localhost:8000/api/v1/contents/";

addEventListener("DOMContentLoaded", (event) => {
  // Initialize TinyMCE
  tinymce.init({
    selector: "#contentBody",
    plugins:
      "advlist autolink lists link image imagetools charmap print preview anchor",
    toolbar:
      "bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | formatselect | link image | grid",
    menubar: "file edit view insert format tools table",
    images_upload_url: "/upload-image",
    height: 500,
    setup: function (editor) {
      editor.on('init', function () {
        setContentIfNotSet();
      });
    }
  });

  // Function to set content if not set already
  function setContentIfNotSet() {
    if (!sessionStorage.getItem("currentlyProcessing")) {
      document.getElementById("deletebt").removeAttribute("onclick");
    } else {
      fetch(APILINK + sessionStorage.getItem("currentlyProcessing"))
        .then((res) => res.json())
        .then(function (data) {
          document.getElementById("title").value = data.title;
          document.getElementById("subText").value = data.subText;
          // Check if TinyMCE has initialized
          if (tinymce.get("contentBody")) {
            tinymce.get("contentBody").setContent(data.contentBody);
          } else {
            // If TinyMCE hasn't initialized yet, set the content after a short delay
            setTimeout(function() {
              tinymce.get("contentBody").setContent(data.contentBody);
            }, 100);
          }
          document.getElementById("attachments").disabled = true;
          document.getElementById("url").value = data.url;
          document.getElementById("author").value = data.author;
          document.getElementById("showAuthor").checked = data.showAUthor;
          if (data.publishDate) {
            document.getElementById("publishDate").value = data.publishDate;
          }
          if (data.publishTime) {
            document.getElementById("publishTime").value = data.publishTime;
          }
        });
    }
  }

  // Call the function to set content if not set already
  setContentIfNotSet();
});

let publishDate;
let publishTime;

function savePage() {
  let title = document.getElementById("title").value;
  let subText = document.getElementById("subText").value;
  let contentBody = getTextFromEditor();
  let attachments = document.getElementById("attachments").files[0]; // Select the first file
  let url = document.getElementById("url").value;
  let author = document.getElementById("author").value; // Assuming this is an input field
  let showAuthorCheckBox = document.getElementById("showAuthor");
  let showAuthor = showAuthorCheckBox.checked;
  let createdAt = getCurrentDate();
  let modifiedAt = getCurrentDate();
  let createdBy = sessionStorage.getItem("user");
  let modifiedBy = sessionStorage.getItem("user");
  let status = "Draft";

  const formData = new FormData();
  formData.append("title", title);
  formData.append("subText", subText);
  formData.append("contentBody", contentBody);
  formData.append("url", url);
  formData.append("author", author);
  formData.append("showAuthor", showAuthor);
  formData.append("publishDate", publishDate);
  formData.append("publishTime", publishTime);
  formData.append("createdAt", createdAt);
  formData.append("modifiedAt", modifiedAt);
  formData.append("createdBy", createdBy);
  formData.append("modifiedBy", modifiedBy);
  formData.append("status", status);
  formData.append("attachments", attachments);

  fetch(APILINK + "addblog", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        alert("Congratulations! Your blog is saved.");
        location.replace("content.html");
      } else {
        alert("Uh oh it seems like some error occurred");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while saving your blog.");
    });
}

function cancelProcessing() {
  location.replace("content.html");
}

function getTextFromEditor() {
  var content = tinymce.get("contentBody").getContent();
  return content;
}

function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month starts from 0
  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentTime() {
  const currentDate = new Date();
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function getPublishData() {
  publishDate = document.getElementById("publishDate").value;
  publishTime = document.getElementById("publishTime").value;
  if (!sessionStorage.getItem("currentlyProcessing")) {
    savePage();
  } else {
    whomToCall();
  }
}

function deletePage() {
  alert("deletecalled");
  fetch(APILINK + sessionStorage.getItem("currentlyProcessing"), {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      location.reload();
    });
}

function whomToCall() {
  if (!sessionStorage.getItem("currentlyProcessing")) {
    savePage();
  } else {
    let title = document.getElementById("title").value;
    let subText = document.getElementById("subText").value;
    let contentBody = getTextFromEditor();
    let url = document.getElementById("url").value;
    let author = document.getElementById("author").value;
    let showAuthorCheckBox = document.getElementById("showAuthor");
    let showAuthor = showAuthorCheckBox.checked;
    let modifiedAt = getCurrentDate();
    let modifiedBy = sessionStorage.getItem("user");

    fetch(APILINK + sessionStorage.getItem("currentlyProcessing"), {
      method: "PUT",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "title": title,
        "subText": subText,
        "contentBody": contentBody,
        "url": url,
        "author": author,
        "showAuthor": showAuthor,
        "publishDate": publishDate,
        "publishTime": publishTime,
        "modifiedAt": modifiedAt,
        "modifiedBy": modifiedBy,
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          alert("Congratulations! Your blog is updated.");
          location.replace("content.html");
        } else {
          alert("Uh oh it seems like some error occurred");
        }
      });
  }
}
