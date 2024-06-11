const APILINK = "http://localhost:8000/api/v1/contents/published";

addEventListener("DOMContentLoaded", () => {
    fetch(APILINK)
        .then( (res) => res.json() )
        .then( function(data){
            data.forEach((element) => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                <a id="${element._id}">${element.title}</a>
                `;

                publishedList.appendChild(listItem);
            });
        })
});