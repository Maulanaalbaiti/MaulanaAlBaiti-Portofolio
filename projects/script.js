$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Projects | Maulana Al Baiti";
            $("#favicon").attr("href", "../assets/images/favicon.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "../assets/images/favhand.png");
        }
    });

// Global variable to store all projects
let allProjects = [];
let currentFilter = 'all';

// Load and display all projects
async function loadAllProjects() {
    try {
        const response = await fetch("projects.json");
        allProjects = await response.json();
        
        // Show all projects initially
        displayProjects(allProjects);
        
    } catch (error) {
        console.log("Error loading projects:", error);
    }
}

// Display projects based on filter
function displayProjects(projects) {
    const projectsContainer = document.querySelector(".work .box-container");
    
    if (!projectsContainer) {
        console.log("Projects container not found");
        return;
    }
    
    let projectHTML = "";
    
    projects.forEach(project => {
        // Simple image path - just add .PNG to the image name
        const imagePath = `../assets/images/projects/${project.image}.PNG`;
        
        projectHTML += `
        <div class="box tilt" data-category="${project.category}">
            <img draggable="false" src="${imagePath}" alt="${project.name}" />
            <div class="content">
                <div class="tag">
                    <h3>${project.name}</h3>
                </div>
                <div class="desc">
                    <p>${project.desc}</p>
                    <div class="btns">
                        <a href="${project.links.view}" class="btn" target="_blank">
                            <i class="fas fa-eye"></i> View
                        </a>
                        <a href="${project.links.code}" class="btn" target="_blank">
                            Code <i class="fas fa-code"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
    });
    
    projectsContainer.innerHTML = projectHTML;
    
    // Initialize tilt effect
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".tilt"), {
            max: 15,
        });
    }
}

// Filter projects by category
function filterProjects(category) {
    currentFilter = category;
    
    // Update active button - menggunakan class 'is-active' sesuai HTML Anda
    document.querySelectorAll('.btn').forEach(btn => {
        btn.classList.remove('is-active');
    });
    document.querySelector(`[data-filter="${category}"]`).classList.add('is-active');
    
    let filteredProjects = [];
    
    if (category === 'all') {
        filteredProjects = allProjects;
    } else if (category === 'web') {
        filteredProjects = allProjects.filter(project => 
            project.category === 'web' || 
            project.category === 'mern' || 
            project.category === 'lamp' || 
            project.category === 'basic'
        );
    } else if (category === 'android') {
        filteredProjects = allProjects.filter(project => project.category === 'android');
    }
    
    displayProjects(filteredProjects);
}

// Initialize filter buttons
function initializeFilters() {
    // Add event listeners to filter buttons - menggunakan selector yang sesuai dengan HTML Anda
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn') && e.target.hasAttribute('data-filter')) {
            const category = e.target.getAttribute('data-filter');
            filterProjects(category);
        }
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadAllProjects();
    initializeFilters();
});

// Pre loader
function loader() {
    const loaderContainer = document.querySelector('.loader-container');
    if (loaderContainer) {
        loaderContainer.classList.add('fade-out');
    }
}

window.addEventListener('load', function() {
    setTimeout(loader, 500);
});

// Scroll reveal animations
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (typeof ScrollReveal !== 'undefined') {
            const sr = ScrollReveal({
                origin: 'top',
                distance: '80px',
                duration: 1000,
                reset: true
            });

            sr.reveal('.work .box', { interval: 200 });
            sr.reveal('.filter-buttons', { delay: 200 });
        }
    }, 1000);
});