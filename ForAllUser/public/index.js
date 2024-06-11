const APILINK = "http://localhost:8000/api/v1/contents/published";

addEventListener("DOMContentLoaded", () => {
    fetch(APILINK)
        .then((res) => res.json())
        .then(function(data) {
            const publishedList = document.getElementById("publishedList");
            data.forEach((element) => {
                const listItem = document.createElement("li");
                listItem.setAttribute("id", element.url);
                listItem.setAttribute("class", "listItem");
                listItem.innerHTML = `${element.title}`;
                publishedList.appendChild(listItem);
            });

            // Attach event listener to the parent element after list items are added
            publishedList.addEventListener("click", function(event) {
                if (event.target.classList.contains("listItem")) {
                    redirectToSlug(event);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

function redirectToSlug(event) {
    location.href = event.target.id;
}
