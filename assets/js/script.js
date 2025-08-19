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

        // scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

    // <!-- emailjs to mail contact form data -->
    $("#contact-form").submit(function (event) {
        emailjs.init("user_TTDmetQLYgWCLzHTDgqxm");

        emailjs.sendForm('contact_service', 'template_contact', '#contact-form')
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                document.getElementById("contact-form").reset();
                alert("Form Submitted Successfully");
            }, function (error) {
                console.log('FAILED...', error);
                alert("Form Submission Failed! Try Again");
            });
        event.preventDefault();
    });
    // <!-- emailjs to mail contact form data -->

});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Portfolio | Maulana Al Baiti";
            $("#favicon").attr("href", "assets/images/favicon.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "assets/images/favhand.png");
        }
    });


// <!-- typed js effect starts -->
var typed = new Typed(".typing-text", {
    strings: ["frontend development", "backend development", "web designing", "android development", "web development"],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});
// <!-- typed js effect ends -->

// FIXED: Improved fetchData function with error handling
async function fetchData(type = "skills") {
    try {
        let response;
        if (type === "skills") {
            response = await fetch("skills.json");
        } else {
            response = await fetch("./projects/projects.json");
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Fetched ${type} data:`, data); // Debug log
        return data;
    } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
        return type === "skills" ? [] : [];
    }
}

function showSkills(skills) {
    let skillsContainer = document.getElementById("skillsContainer");
    if (!skillsContainer) {
        console.error("Skills container not found!");
        return;
    }
    
    let skillHTML = "";
    skills.forEach(skill => {
        skillHTML += `
        <div class="bar">
              <div class="info">
                <img src="${skill.icon}" alt="skill" />
                <span>${skill.name}</span>
              </div>
            </div>`
    });
    skillsContainer.innerHTML = skillHTML;
}

// FIXED: Improved showProjects function
function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    
    if (!projectsContainer) {
        console.error("Projects container '#work .box-container' not found!");
        return;
    }
    
    if (!Array.isArray(projects)) {
        console.error("Projects is not an array:", projects);
        return;
    }
    
    let projectHTML = "";
    
    // Filter and process projects
    const filteredProjects = projects.slice(0, 6).filter(project => project.category != "all");
    console.log("Filtered projects:", filteredProjects);
    
    filteredProjects.forEach(project => {
        // FIXED: Removed leading slash and added proper error handling
        const imagePath = `./assets/images/projects/${project.image}.png`;
        
        projectHTML += `
        <div class="box tilt">
            <img draggable="false" 
                 src="${imagePath}" 
                 alt="${project.name}" 
                 onerror="console.error('Image not found: ${imagePath}'); this.src='assets/images/projects';" />
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
        </div>`
    });
    
    projectsContainer.innerHTML = projectHTML;
    
    // FIXED: Initialize tilt effect after DOM is updated
    setTimeout(() => {
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll(".tilt"), {
                max: 15,
            });
        }
    }, 100);
    
    // FIXED: Initialize scroll reveal for projects
    setTimeout(() => {
        if (typeof ScrollReveal !== 'undefined') {
            const srtop = ScrollReveal({
                origin: 'top',
                distance: '80px',
                duration: 1000,
                reset: true
            });
            srtop.reveal('.work .box', { interval: 200 });
        }
    }, 200);
}

// FIXED: Proper initialization with error handling
async function initializePortfolio() {
    try {
        // Load skills data
        console.log("Loading skills...");
        const skillsData = await fetchData("skills");
        if (Array.isArray(skillsData)) {
            showSkills(skillsData);
        } else {
            console.error("Skills data is not an array:", skillsData);
        }
        
        // Load projects data
        console.log("Loading projects...");
        const projectsData = await fetchData("projects");
        
        // Handle different possible JSON structures
        let projects = [];
        if (Array.isArray(projectsData)) {
            projects = projectsData;
        } else if (projectsData && Array.isArray(projectsData.projects)) {
            projects = projectsData.projects;
        } else if (projectsData && typeof projectsData === 'object') {
            // If it's an object, try to find arrays
            const keys = Object.keys(projectsData);
            for (const key of keys) {
                if (Array.isArray(projectsData[key])) {
                    projects = projectsData[key];
                    break;
                }
            }
        }
        
        console.log("Processing projects:", projects);
        
        if (projects.length > 0) {
            showProjects(projects);
        } else {
            console.error("No projects found or invalid format");
            // Show fallback message
            const projectsContainer = document.querySelector("#work .box-container");
            if (projectsContainer) {
                projectsContainer.innerHTML = '<p>No projects available at the moment.</p>';
            }
        }
        
    } catch (error) {
        console.error("Error initializing portfolio:", error);
    }
}

// FIXED: Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializePortfolio);

// REMOVED: Duplicate VanillaTilt initialization

// pre loader start - FIXED
function loader() {
    const loaderContainer = document.querySelector('.loader-container');
    if (loaderContainer) {
        loaderContainer.classList.add('fade-out');
    }
}

function fadeOut() {
    setTimeout(loader, 500); // FIXED: Use setTimeout instead of setInterval
}

window.addEventListener('load', fadeOut);
// pre loader end

// disable developer mode
document.onkeydown = function (e) {
    if (e.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}

// Start of Tawk.to Live Chat
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/60df10bf7f4b000ac03ab6a8/1f9jlirg6';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
})();
// End of Tawk.to Live Chat

/* ===== SCROLL REVEAL ANIMATION ===== */
// FIXED: Initialize ScrollReveal after libraries are loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for all libraries to load
    setTimeout(() => {
        if (typeof ScrollReveal !== 'undefined') {
            const srtop = ScrollReveal({
                origin: 'top',
                distance: '80px',
                duration: 1000,
                reset: true
            });

            /* SCROLL HOME */
            srtop.reveal('.home .content h3', { delay: 200 });
            srtop.reveal('.home .content p', { delay: 200 });
            srtop.reveal('.home .content .btn', { delay: 200 });

            srtop.reveal('.home .image', { delay: 400 });
            srtop.reveal('.home .linkedin', { interval: 600 });
            srtop.reveal('.home .github', { interval: 800 });
            srtop.reveal('.home .twitter', { interval: 1000 });
            srtop.reveal('.home .telegram', { interval: 600 });
            srtop.reveal('.home .instagram', { interval: 600 });
            srtop.reveal('.home .dev', { interval: 600 });

            /* SCROLL ABOUT */
            srtop.reveal('.about .content h3', { delay: 200 });
            srtop.reveal('.about .content .tag', { delay: 200 });
            srtop.reveal('.about .content p', { delay: 200 });
            srtop.reveal('.about .content .box-container', { delay: 200 });
            srtop.reveal('.about .content .resumebtn', { delay: 200 });

            /* SCROLL SKILLS */
            srtop.reveal('.skills .container', { interval: 200 });
            srtop.reveal('.skills .container .bar', { delay: 400 });

            /* SCROLL EDUCATION */
            srtop.reveal('.education .box', { interval: 200 });

            /* SCROLL EXPERIENCE */
            srtop.reveal('.experience .timeline', { delay: 400 });
            srtop.reveal('.experience .timeline .container', { interval: 400 });

            /* SCROLL CONTACT */
            srtop.reveal('.contact .container', { delay: 400 });
            srtop.reveal('.contact .container .form-group', { delay: 400 });
        }
    }, 1000);
});