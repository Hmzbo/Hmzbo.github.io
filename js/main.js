document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.body.setAttribute('data-theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
        }
    });

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('nav--visible');
    });

    // Back to Top Button
    const backToTopButton = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    // Active Nav Link Highlighting & Progress Bar
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    const progressBar = document.getElementById('progressBar');

    function updateNavAndProgress() {
        let index = sections.length;

        while(--index && window.scrollY + 50 < sections[index].offsetTop) {}
        
        navLinks.forEach((link) => link.classList.remove('active'));
        navLinks[index].classList.add('active');

        const progress = ((index + 1) / sections.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    updateNavAndProgress();
    window.addEventListener('scroll', updateNavAndProgress);
});
