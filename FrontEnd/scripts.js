// Updates the navbar style (size) on scroll
document.addEventListener("scroll", function () {
    const navbar = document.querySelector("nav");
    if (window.scrollY > 0) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});
// Sets a nav element active upon clicking
document.addEventListener('DOMContentLoaded', function () {
    const navItems = document.querySelectorAll('.nav-item');

    // Function to update active class based on current URL
    function updateActiveNavItem() {
        const currentPath = window.location.pathname.split('/').pop(); // Get the current file name

        navItems.forEach(item => {

            const linkPath = item.getAttribute('href');
            item.classList.toggle('active', currentPath === linkPath);
        });
    }

    // Update active nav item based on current page URL
    updateActiveNavItem();

    // Set active class upon clicking a nav item
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

document.addEventListener("scroll", function () {
    const button = document.getElementById("back-to-top");
    if (window.scrollY > 300) {

        button.classList.add("show");
    } else {
        button.classList.remove("show");
    }
});

