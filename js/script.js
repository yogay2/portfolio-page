
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
        const wasOpen = navigation.classList.contains("is-open");
        closeMenu();

        if (wasOpen) {
            menuButton.focus();
        }
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
    if (window.innerWidth > 800) {
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
        tags.appendChild(createElement("span", "", technology));
    });

    body.append(title, description, tags);
    card.append(preview, body);

    return card;
}

function getFilteredProjects() {
    const searchTerm = projectSearch.value
        .trim()
        .toLocaleLowerCase("de-CH");

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

        return matchesCategory && searchableText.includes(searchTerm);
    });
}

function renderProjects() {
    const filteredProjects = getFilteredProjects();
    const fragment = document.createDocumentFragment();

    filteredProjects.forEach((project) => {
        const originalIndex = projects.findIndex(
            (item) => item.id === project.id
        );

        fragment.appendChild(
            createProjectCard(project, originalIndex)
        );
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

const githubUsername = "yogay2";
const githubApi = "https://api.github.com";

const githubName = document.querySelector("#github-name");
const githubProfileUsername = document.querySelector("#github-username");
const githubAvatar = document.querySelector("#github-avatar");
const githubRepos = document.querySelector("#github-repos");
const githubFollowers = document.querySelector("#github-followers");
const githubFollowing = document.querySelector("#github-following");
const githubRepositories = document.querySelector("#github-repositories");
const githubStatus = document.querySelector("#github-status");
const githubProfileStatus = document.querySelector("#github-profile-status");
const githubRetry = document.querySelector("#github-retry");

async function fetchGitHubData(url) {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 10000);

    try {
        const response = await fetch(url, {
            headers: {
                Accept: "application/vnd.github+json"
            },
            signal: controller.signal
        });

        if (!response.ok) {
            if (
                response.status === 429 ||
                (
                    response.status === 403 &&
                    response.headers.get("X-RateLimit-Remaining") === "0"
                )
            ) {
                throw new Error(
                    "Das GitHub-API-Limit wurde erreicht. Bitte später erneut versuchen."
                );
            }

            throw new Error(
                `GitHub API: HTTP ${response.status}`
            );
        }

        return await response.json();
    } finally {
        clearTimeout(timeout);
    }
}

function renderGitHubProfile(profile) {
    githubName.textContent = profile.name || profile.login;
    githubProfileUsername.textContent = `@${profile.login}`;
    githubAvatar.src = profile.avatar_url;
    githubAvatar.alt = `Profilbild von ${profile.login}`;

    githubRepos.textContent = profile.public_repos;
    githubFollowers.textContent = profile.followers;
    githubFollowing.textContent = profile.following;

    githubProfileStatus.textContent = "";
}

function createRepositoryCard(repository) {
    const card = createElement(
        "article",
        "github-repository"
    );

    const title = createElement(
        "h4",
        "",
        repository.name
    );

    const description = createElement(
        "p",
        "github-repository-description",
        repository.description || "Keine Beschreibung vorhanden."
    );

    const details = createElement(
        "div",
        "github-repository-details"
    );

    const language = createElement(
        "span",
        "",
        repository.language || "Nicht angegeben"
    );

    const stars = createElement(
        "span",
        "",
        `★ ${repository.stargazers_count}`
    );

    const forks = createElement(
        "span",
        "",
        `Forks: ${repository.forks_count}`
    );

    const updatedDate = new Date(
        repository.updated_at
    ).toLocaleDateString("de-CH");

    const updated = createElement(
        "span",
        "",
        `Aktualisiert: ${updatedDate}`
    );

    const link = createElement(
        "a",
        "github-repository-link",
        "Repository ansehen ↗"
    );

    link.href = repository.html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    details.append(language, stars, forks, updated);
    card.append(title, description, details, link);

    return card;
}

function renderGitHubRepositories(repositories) {
    const fragment = document.createDocumentFragment();

    const sortedRepositories = [...repositories].sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
    });

    sortedRepositories.forEach((repository) => {
        fragment.appendChild(
            createRepositoryCard(repository)
        );
    });

    githubRepositories.replaceChildren(fragment);

    const count = sortedRepositories.length;

    if (count === 0) {
        githubStatus.textContent =
            "Keine öffentlichen Repositories gefunden.";
    } else {
        githubStatus.textContent =
            count === 1
                ? "1 Repository angezeigt"
                : `${count} Repositories angezeigt`;
    }
}

function getGitHubErrorMessage(error) {
    if (error.name === "AbortError") {
        return "Die Anfrage hat zu lange gedauert.";
    }

    if (error.message.includes("API-Limit")) {
        return error.message;
    }

    return "Die GitHub-Daten konnten nicht geladen werden.";
}

async function loadGitHubData() {
    githubRetry.hidden = true;
    githubRetry.disabled = true;

    githubProfileStatus.textContent =
        "Profilinformationen werden geladen ...";

    githubStatus.textContent =
        "Repositories werden geladen ...";

    githubRepositories.replaceChildren();

    githubRepos.textContent = "–";
    githubFollowers.textContent = "–";
    githubFollowing.textContent = "–";

    const profileUrl =
        `${githubApi}/users/${githubUsername}`;

    const repositoriesUrl =
        `${githubApi}/users/${githubUsername}/repos?sort=updated&per_page=100`;

    const [profileResult, repositoriesResult] =
        await Promise.allSettled([
            fetchGitHubData(profileUrl),
            fetchGitHubData(repositoriesUrl)
        ]);

    let hasError = false;

    if (profileResult.status === "fulfilled") {
        renderGitHubProfile(profileResult.value);
    } else {
        githubProfileStatus.textContent =
            getGitHubErrorMessage(profileResult.reason);

        hasError = true;

        console.error(
            "GitHub-Profil:",
            profileResult.reason
        );
    }

    if (repositoriesResult.status === "fulfilled") {
        renderGitHubRepositories(
            repositoriesResult.value
        );
    } else {
        githubStatus.textContent =
            getGitHubErrorMessage(repositoriesResult.reason);

        hasError = true;

        console.error(
            "GitHub-Repositories:",
            repositoriesResult.reason
        );
    }

    githubRetry.hidden = !hasError;
    githubRetry.disabled = false;
}

githubRetry.addEventListener("click", loadGitHubData);

loadGitHubData();
