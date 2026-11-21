
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-navigation");
const navigationLinks = document.querySelectorAll(".nav-links a");

function closeMenu() {
    menuButton.classList.remove("is-open");
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Menü öffnen");
}

function toggleMenu() {
    const isOpen = navigation.classList.toggle("is-open");

    menuButton.classList.toggle("is-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Menü schliessen" : "Menü öffnen"
    );
}

menuButton.addEventListener("click", toggleMenu);

navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

document.addEventListener("click", (event) => {
    if (
        !navigation.contains(event.target) &&
        !menuButton.contains(event.target)
    ) {
        closeMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 700) {
        closeMenu();
    }
});
