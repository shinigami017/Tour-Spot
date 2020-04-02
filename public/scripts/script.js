let toggle = document.querySelectorAll(".toggle");
toggle.forEach(function(item) {
    item.onclick = showHide;
});


let navBtn = document.getElementById("navBtn");
navBtn.onclick = expandNav;

function expandNav() {
    let navMenu = document.querySelector(".nav-menu");
    navMenu.classList.toggle("toggle-menu");
}

function showHide() {
    let listNumber = this.dataset.list,
        password = document.getElementById("password" + listNumber);
    if (password.value != "") {
        if (password.type === "password") {
            password.setAttribute("type", "text");
            this.classList.add("hide");
        } else {
            password.setAttribute("type", "password");
            this.classList.remove("hide");
        }
    }
}

function myFunction5() {
    document.querySelector(".alert").style.display = "none";
}