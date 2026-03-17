const fetchBtn = document.getElementById("fetchBtn");
const reloadBtn = document.getElementById("reloadBtn");
const usersContainer = document.getElementById("users");

function fetchUsers(){

usersContainer.innerHTML = "Loading users...";

fetch("https://jsonplaceholder.typicode.com/users")

.then(response => {

if(!response.ok){
throw new Error("Network response was not ok");
}

return response.json();

})

.then(users => {

usersContainer.innerHTML = "";

users.forEach(user => {

const card = document.createElement("div");
card.classList.add("card");

card.innerHTML = `
<h2>${user.name}</h2>
<p><strong>Email:</strong> ${user.email}</p>
<p><strong>Address:</strong> ${user.address.street}, ${user.address.city}</p>
`;

usersContainer.appendChild(card);

});

})

.catch(error => {

usersContainer.innerHTML = "<p>⚠ Failed to load users. Please check your internet connection.</p>";
console.error("Fetch Error:", error);

});

}

fetchBtn.addEventListener("click", fetchUsers);

reloadBtn.addEventListener("click", fetchUsers);