
"use strict";

const mainWraper = document.getElementById("postWraper");
const overlay = document.getElementById("overlay");
const closeIcon = document.getElementById("close");
const content = document.getElementById("content");

function fetchData(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    });
}

fetchData("https://jsonplaceholder.typicode.com/posts")
  .then(data => {
    data.forEach(element => {
      createPost(element);
    });
  })
  .catch(error => console.error('Fetch error:', error));

function createPost(item) {
  const divWraper = document.createElement("div");
  divWraper.classList.add("container");
  divWraper.setAttribute("data-id", item.id);

  const titleh2 = document.createElement("h2");
  titleh2.innerText = item.id;

  const titleh3 = document.createElement("h3");
  titleh3.innerText = item.title;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete This Post";
  deleteBtn.setAttribute("data-delete-id", item.id);

  divWraper.appendChild(titleh2);
  divWraper.appendChild(titleh3);
  divWraper.appendChild(deleteBtn);

  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    const deleteId = e.target.getAttribute("data-delete-id");

    const deleteUrl = `https://jsonplaceholder.typicode.com/posts/${deleteId}`;

    fetch(deleteUrl, {
      method: "DELETE",
    })
    .then(() => divWraper.remove())
    .catch(error => console.error('Delete error:', error));
  });

  divWraper.addEventListener("click", function () {
    const divId = this.getAttribute("data-id");

    overlay.classList.add("activeOverlay");
    const detailUrl = `https://jsonplaceholder.typicode.com/posts/${divId}`;

    fetchData(detailUrl)
      .then(newData => {
        content.innerHTML = ""; // Clear previous content
        const pDescr = document.createElement("p");
        pDescr.textContent = newData.body;
        content.appendChild(pDescr);
      })
      .catch(error => console.error('Detail fetch error:', error));
  });

  mainWraper.appendChild(divWraper);
}

closeIcon.addEventListener("click", function () {
  overlay.classList.remove("activeOverlay");
  content.innerHTML = "";
});