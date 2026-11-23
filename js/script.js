
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

const projects = [
    {
        id: 1,
        title: "Nexa",
        preview: "NEXA",
        category: "webentwicklung",
        description: "Eine Plattform zum Wissensaustausch zwischen Studierenden. Nutzer können Lernangebote erstellen und Unterstützung in verschiedenen Fachbereichen finden.",
        technologies: ["Vue.js", "Strapi", "REST API"],
        previewClass: ""
    },
    {
        id: 2,
        title: "Lost & Found",
        preview: "LOST / FOUND",
        category: "konzeption",
        description: "Ein Konzept zur digitalen Verwaltung von Fundgegenständen. Ziel war es, die Erfassung, Zuordnung und Rückgabe verlorener Gegenstände effizienter zu gestalten.",
        technologies: ["Prozessanalyse", "Konzeption"],
        previewClass: "preview-two"
    },
    {
        id: 3,
        title: "Datenbankprojekte",
        preview: "SQL / DATA",
        category: "datenbanken",
        description: "Übungen und Projekte mit relationalen Datenbanken. Dazu gehören SQL-Abfragen, das Verknüpfen von Tabellen sowie das Auswerten und Bearbeiten strukturierter Daten.",
        technologies: ["SQL", "Datenanalyse", "Datenbanken"],
        previewClass: "preview-three"
    }
];

const projectsGrid = document.querySelector("#projects-grid");
const projectCount = document.querySelector("#project-count");
const projectSearch = document.querySelector("#project-search");
const filterButtons = document.querySelectorAll(".filter-button");
const projectEmpty = document.querySelector("#project-empty");
const resetFiltersButton = document.querySelector("#reset-filters");

let activeFilter = "alle";

function createElement(tag, className, content) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (content !== undefined) {
        element.textContent = content;
    }

    return element;
}

function createProjectCard(project, index) {
    const card = createElement("article", "project-card");
    const preview = createElement(
        "div",
        `project-preview ${project.previewClass}`.trim()
    );

    const previewTitle = createElement(
        "span",
        "preview-title",
        project.preview
    );

    const previewIndex = createElement(
        "span",
        "preview-index",
        `${String(index + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`
    );

    preview.append(previewTitle, previewIndex);

    const body = createElement("div", "project-body");
    const title = createElement("h3", "", project.title);
    const description = createElement("p", "", project.description);
    const tags = createElement("div", "tags");

    project.technologies.forEach((technology) => {
        const tag = createElement("span", "", technology);
        tags.appendChild(tag);
    });

    body.append(title, description, tags);
    card.append(preview, body);

    return card;
}

function getFilteredProjects() {
    const searchTerm = projectSearch.value.trim().toLocaleLowerCase("de-CH");

    return projects.filter((project) => {
        const matchesCategory =
            activeFilter === "alle" ||
            project.category === activeFilter;

        const searchableText = [
            project.title,
            project.description,
            project.category,
            ...project.technologies
        ].join(" ").toLocaleLowerCase("de-CH");

        const matchesSearch = searchableText.includes(searchTerm);

        return matchesCategory && matchesSearch;
    });
}

function renderProjects() {
    const filteredProjects = getFilteredProjects();
    const fragment = document.createDocumentFragment();

    filteredProjects.forEach((project) => {
        const originalIndex = projects.findIndex(
            (item) => item.id === project.id
        );

        const card = createProjectCard(project, originalIndex);
        fragment.appendChild(card);
    });

    projectsGrid.replaceChildren(fragment);

    const count = filteredProjects.length;

    projectCount.textContent =
        count === 1
            ? "1 Projekt gefunden"
            : `${count} Projekte gefunden`;

    projectEmpty.hidden = count !== 0;
}

function setActiveFilter(category) {
    activeFilter = category;

    filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === category;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    renderProjects();
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        setActiveFilter(button.dataset.filter);
    });
});

projectSearch.addEventListener("input", renderProjects);

resetFiltersButton.addEventListener("click", () => {
    projectSearch.value = "";
    setActiveFilter("alle");
    projectSearch.focus();
});

renderProjects();
