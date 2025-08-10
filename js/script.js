// ==================== APP LOADER ====================
document.addEventListener('DOMContentLoaded', () => {
    const app = {
        // --- App Initializer ---
        init() {
            this.theme.init();
            this.navigation.init();
            this.journey.init();
            this.projects.load();
            this.blog.init();
            this.animations.init();
            this.chatbot.init();
        },

        // --- Theme Manager ---
        theme: {
            init() {
                this.toggleBtn = document.getElementById('theme-toggle');

                this.toggleBtn.addEventListener('click', () => {
                    const newTheme = document.documentElement.classList.contains('dark-mode') ? 'light' : 'dark';
                    this.applyTheme(newTheme);
                    localStorage.setItem('theme', newTheme);
                });
            },
            applyTheme(theme) {
                if (theme === 'dark') {
                    document.documentElement.classList.remove('light-mode');
                    document.documentElement.classList.add('dark-mode');
                } else {
                    document.documentElement.classList.remove('dark-mode');
                    document.documentElement.classList.add('light-mode');
                }
            }
        },

        // --- Navigation Manager ---
        navigation: {
            init() {
                this.header = document.querySelector('.header');
                this.navLinks = document.querySelectorAll('.navbar-link');
                this.progressBar = document.getElementById('progress-bar');
                this.sections = Array.from(document.querySelectorAll('main section'));
                this.menuCheckbox = document.getElementById('menu_checkbox');
                this.navbarMenu = document.getElementById('navbar-menu');
                this.overlay = document.getElementById('overlay');

                window.addEventListener('scroll', this.handleScroll.bind(this));
                this.handleScroll();

                const closeMenu = () => {
                    if (this.menuCheckbox.checked) {
                        this.menuCheckbox.checked = false;
                        this.navbarMenu.classList.remove('active');
                        this.overlay.classList.remove('active');
                    }
                };

                if (this.menuCheckbox) {
                    this.menuCheckbox.addEventListener('change', () => {
                        const isActive = this.menuCheckbox.checked;
                        this.navbarMenu.classList.toggle('active', isActive);
                        this.overlay.classList.toggle('active', isActive);
                    });
                }

                if (this.overlay) {
                    this.overlay.addEventListener('click', closeMenu);
                }

                this.navLinks.forEach(link => {
                    link.addEventListener('click', closeMenu);
                });
            },
            handleScroll() {
                // Header shadow
                if (window.scrollY > 50) {
                    this.header.classList.add('scrolled', 'slim');
                } else {
                    this.header.classList.remove('scrolled', 'slim');
                }

                // Scrollspy for nav links
                let currentSectionId = '';
                const headerOffset = this.header.offsetHeight;
                this.sections.forEach(section => {
                    const sectionTop = section.offsetTop - headerOffset;
                    if (window.scrollY >= sectionTop) {
                        currentSectionId = section.getAttribute('id');
                    }
                });

                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    // The blog section doesn't have a nav link, so we find the link that matches the href
                    if (link.getAttribute('href').substring(1) === currentSectionId) {
                        link.classList.add('active');
                    }
                });

                // Section-based progress bar
                if (this.progressBar) {
                    const currentSectionIndex = this.sections.findIndex(section => section.id === currentSectionId);
                    let progress = 0;

                    if (currentSectionIndex > -1) {
                        // Progress is based on the index of the current section
                        progress = ((currentSectionIndex) / (this.sections.length - 1)) * 100;
                    }
                    
                    // Ensure it's exactly 0 at the top and 100 at the bottom
                    if (window.scrollY === 0) {
                        progress = 0;
                    }
                    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
                    if (window.scrollY >= scrollableHeight - 2) { // 2px buffer
                        progress = 100;
                    }

                    this.progressBar.style.width = `${progress}%`;
                }

                // Chatbot tooltip
                const tooltip = document.getElementById('chatbot-tooltip');
                if (tooltip) {
                    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
                    if (window.scrollY >= scrollableHeight - 5) { // Show tooltip near the bottom
                        tooltip.classList.add('visible');
                    } else {
                        tooltip.classList.remove('visible');
                    }
                }
            },
        },

        // --- Animation Manager ---
        animations: {
            init() {
                this.animatedElements = document.querySelectorAll('[data-animate]');
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const delay = entry.target.dataset.delay || 0;
                            setTimeout(() => {
                                entry.target.classList.add('visible');
                            }, delay * 1000);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });

                this.animatedElements.forEach(el => observer.observe(el));
                this.animateHeroTitle();
            },

            animateHeroTitle() {
                const titleElement = document.querySelector('.hero-title');
                if (!titleElement) return;

                const originalText = "Hi, I’m Hamza Boulahia";
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
                let iteration = 0;
                
                let interval = setInterval(() => {
                    titleElement.textContent = originalText.split('')
                        .map((letter, index) => {
                            if(index < iteration) {
                                return originalText[index];
                            }
                            
                            return chars[Math.floor(Math.random() * chars.length)]
                        })
                        .join('');
                    
                    if(iteration >= originalText.length){ 
                        clearInterval(interval);
                    }
                    
                    iteration += 0.75;
                }, 15);
            }
        },

        // --- Chatbot Manager ---
        chatbot: {
            init() {
                this.bubble = document.getElementById('chatbot-bubble');
                this.window = document.getElementById('chatbot-window');
                this.closeBtn = document.getElementById('close-chatbot');
                this.sendBtn = document.getElementById('chatbot-send');
                this.input = document.getElementById('chatbot-input');
                this.body = document.getElementById('chatbot-body');
                this.typingIndicator = document.getElementById('typing-indicator');
                this.tooltip = document.getElementById('chatbot-tooltip');

                this.bubble.addEventListener('click', () => this.toggleWindow());
                this.closeBtn.addEventListener('click', () => this.toggleWindow());
                this.sendBtn.addEventListener('click', () => this.sendMessage());
                this.input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.sendMessage();
                    }
                });
            },
            toggleWindow() {
                this.window.classList.toggle('active');
                if (this.window.classList.contains('active') && this.body.children.length === 1) {
                    setTimeout(() => {
                        this.addMessage("Hello! I'm a chatbot here to answer questions about Hamza Boulahia. How can I help you?", 'bot');
                    }, 1000);
                }
                if (this.tooltip) {
                    this.tooltip.classList.remove('visible');
                }
            },
            addMessage(message, sender) {
                const messageElement = document.createElement('div');
                messageElement.classList.add('chatbot-message', sender, 'message');
                const icon = sender === 'user' ? '<i class="ph ph-user"></i>' : '<img src="assets/chatbot_icon.svg" alt="Chatbot Icon" class="chatbot-icon">';
                if (sender === 'user') {
                    messageElement.innerHTML = `<div class="message-content">${message}</div>${icon}`;
                } else {
                    messageElement.innerHTML = `${icon}<div class="message-content">${message}</div>`;
                }
                this.body.insertBefore(messageElement, this.typingIndicator);
                this.body.scrollTop = this.body.scrollHeight;
            },
            showTypingIndicator(show) {
                this.typingIndicator.classList.toggle('hidden', !show);
            },
            async sendMessage() {
                const message = this.input.value.trim();
                if (!message) return;

                this.addMessage(message, 'user');
                this.input.value = '';
                this.showTypingIndicator(true);

                try {
                    const response = await fetch('https://personalchatbot-poxv.onrender.com/api/v1/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ message })
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    this.showTypingIndicator(false);
                    this.addMessage(data.reply, 'bot');
                } catch (error) {
                    console.error('Error fetching chatbot response:', error);
                    this.showTypingIndicator(false);
                    this.addMessage('Sorry, I am having trouble connecting to the server.', 'bot');
                }
            }
        },

        // --- Horizontal Timeline ---
        journey: {
            data: {
                events: [
                    { start: '2011-09', end: '2014-06', title: 'Bachelor of Science in Applied Mathematics', org: 'Higher School of Science and Technology of Tunis', desc: 'Relevant courses: Linear Algebra, Calculus, Statistics, Algorithms & Data Structures.', type: 'education' },
                    { start: '2014-09', end: '2016-06', title: "Master's in Mathematical Modeling", org: 'National Engineers School of Tunisia', desc: 'Relevant courses: Statistics, Stochastics, Optimization.', type: 'education' },
                    { start: '2016-10', end: '2018-08', title: 'Math Tutor', org: 'Sigma Training Center', desc: 'Tutored university-level math, using Python visualizations to enhance understanding.', type: 'work' },
                    { start: '2020-10', end: '2022-05', title: 'Data Science Consultant', org: 'Freelance', desc: 'Built and improved ML models for classification/regression and delivered EDA insights for clients.', type: 'work' },
                    { start: '2022-05', end: '2024-05', title: 'Data Scientist', org: 'Aléria Consulting', desc: 'Built a web app for webpage attention heatmap prediction using U-Net and a desktop app for ID OCR.', type: 'work' },
                    { start: '2024-05', end: 'present', title: 'Freelance AI Engineer', org: 'AI Inheritance Chatbot', desc: 'Building and evaluating RAG pipelines for accurate Arabic answers on Islamic inheritance.', type: 'work' },
                ],
                certificates: [
                    { date: '2019-10', name: 'Data Analyst Nanodegree – Udacity', type: 'certificate' },
                    { date: '2020-04', name: 'Machine Learning – Coursera', type: 'certificate' },
                    { date: '2020-10', name: 'Deep Learning Specialization – Deeplearning.ai', type: 'certificate' },
                    { date: '2021-08', name: 'TensorFlow 2 for Deep Learning – Coursera', type: 'certificate' },
                ],
                milestones: [
                    { date: '2019-01', label: 'Career pivot to AI', type: 'milestone' }
                ]
            },

            init() {
                this.wrapper = document.querySelector('.timeline-vertical-wrapper');
                if (!this.wrapper) return;

                this.buildVerticalTimeline();
            },

            buildVerticalTimeline() {
                const parseDate = (dateStr) => {
                    if (!dateStr || dateStr === 'present') return new Date();
                    const [year, month] = dateStr.split('-');
                    return new Date(year, parseInt(month, 10) - 1, 1);
                };

                const allItems = [
                    ...this.data.events.map(e => ({ ...e, date: e.start })),
                    ...this.data.certificates,
                    ...this.data.milestones.map(m => ({ ...m, title: m.label }))
                ];

                const sortedItems = allItems.sort((a, b) => parseDate(a.date) - parseDate(b.date));

                let timelineHTML = '';
                sortedItems.forEach(item => {
                    let iconClass = '';
                    let title = item.title || item.name;
                    let organization = item.org || '';
                    let dateRange = item.start ? `${item.start.replace('-', '/')} - ${item.end.replace('-', '/')}` : new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

                    switch(item.type) {
                        case 'work':
                            iconClass = 'ph-briefcase';
                            break;
                        case 'education':
                            iconClass = 'ph-graduation-cap';
                            break;
                        case 'certificate':
                            iconClass = 'ph-seal-check';
                            dateRange = new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
                            break;
                        case 'milestone':
                            iconClass = 'ph-flag';
                            dateRange = new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
                            break;
                    }

                    if (item.type === 'milestone') {
                        timelineHTML += `
                            <div class="timeline-milestone" data-animate>
                                <div class="timeline-milestone-icon">
                                    <i class="ph ${iconClass}"></i>
                                </div>
                                <div class="timeline-milestone-content">
                                    <h3 class="timeline-milestone-title">${title}</h3>
                                    <p class="timeline-milestone-date">${dateRange}</p>
                                </div>
                            </div>
                        `;
                    } else if (item.type === 'certificate') {
                        timelineHTML += `
                            <div class="timeline-item timeline-item--${item.type}" data-animate>
                                <div class="timeline-icon">
                                    <i class="ph ${iconClass}"></i>
                                </div>
                                <div class="timeline-certificate-content">
                                    <div class="timeline-certificate-text">
                                        <h3 class="timeline-title">${title}</h3>
                                        <p class="timeline-date">${dateRange}</p>
                                    </div>
                                </div>
                            </div>
                        `;
                    } else {
                        timelineHTML += `
                            <div class="timeline-item timeline-item--${item.type}" data-animate>
                                <div class="timeline-icon">
                                    <i class="ph ${iconClass}"></i>
                                </div>
                                <div class="timeline-item-content">
                                    <p class="timeline-date">${dateRange}</p>
                                    <h3 class="timeline-title">${title}</h3>
                                    ${organization ? `<p class="timeline-org">${organization}</p>` : ''}
                                    ${item.desc ? `<p class="timeline-desc">${item.desc}</p>` : ''}
                                </div>
                            </div>
                        `;
                    }
                });

                this.wrapper.innerHTML = timelineHTML + `
                    <div class="timeline-arrow-end"></div>
                `;
                app.animations.init(); // Re-initialize animations for the new timeline items
            }
        },

        // --- Project Loader ---
        projects: {
            data: [
                {
                    title: "AI Inheritance Chatbot",
                    description: "Built a Retrieval-Augmented-Generation (RAG) chatbot to answer complex Islamic inheritance questions in Arabic. The project involved fine-tuning open-source LLMs and benchmarking Arabic embeddings to deliver a reliable conversational AI tool.",
                    tags: ["Work", "Freelance", "RAG", "LLM Fine-Tuning", "Gradio"],
                    image: "assets/project-1.png"
                },
                {
                    title: "Webpage Saliency Heatmap Predictor",
                    description: "Trained a U-Net deep learning model to predict user attention on webpages, achieving over 85% accuracy. The model was wrapped in a Flask API and integrated into a simple web app for one-click heatmap generation.",
                    tags: ["Work", "Computer Vision", "U-Net", "PyTorch", "Flask"],
                    image: "assets/project-2.png"
                },
                {
                    title: "Desktop Application for ID Cards Optical Character Recognition",
                    description: "Designed and built a Windows desktop application for Optical Character Recognition (OCR) on ID cards. The app uses YOLO for object detection to locate the ID and Tesseract for high-accuracy data extraction.",
                    tags: ["Work", "Computer Vision", "YOLO", "OpenCV", "Tesseract"],
                    image: "assets/project-3.png"
                },
                {
                    title: "Football Analytics with Deep Learning and Computer Vision",
                    description: "A real-time web application for automated football match analysis, built with Python and Streamlit. The system performs player detection, ball tracking, team identification, and tactical map visualization using a YOLOv8 model and computer vision techniques.",
                    tags: ["Personal", "Open Source", "Computer Vision", "YOLOv8", "Streamlit"],
                    link: "https://github.com/Hmzbo/Football-Analytics-with-Deep-Learning-and-Computer-Vision",
                    image: "assets/project-4.png"
                },
                {
                    title: "Keep Up With The Trends",
                    description: "A web application that monitors trending topics from Google Trends, scrapes relevant news articles, and generates concise summaries using a Retrieval-Augmented Generation (RAG) pipeline.",
                    tags: ["Personal", "Open Source", "RAG", "LLM", "LangChain"],
                    link: "https://github.com/Hmzbo/Keep-Up-With-The-Trends",
                    image: "assets/project-5.png"
                },
                {
                    title: "Visual Optimization Solver",
                    description: "A web app for solving and visualizing optimization problems. It uses Projected Gradient Descent and a Gemini LLM to generate insightful reports on the solution process.",
                    tags: ["Personal", "Open Source", "Optimization", "LLM", "Streamlit"],
                    link: "https://github.com/Hmzbo/Visual-Solver-Application",
                    image: "assets/project-6.png"
                },
                {
                    title: "DeepSearch Chatbot",
                    description: "An advanced conversational AI with a custom \"Deep Search\" engine for generating in-depth, referenced reports on complex topics. It combines multiple LLMs, web scraping, and OCR to synthesize information.",
                    tags: ["Personal", "Open Source", "LLM", "Web Scraping", "OCR"],
                    link: "https://github.com/Hmzbo/MLWH-Tutos/tree/main/Chatbot%20with%20DeepSearch",
                    image: "assets/project-7.png"
                }
            ],
            load() {
                this.carouselWrapper = document.querySelector('.projects-carousel .swiper-wrapper');
                this.filters = document.querySelector('.project-filters');
                if (!this.carouselWrapper || !this.filters) return;

                this.renderFilters();
                this.renderProjects('All');
            },
            renderProjects(filter) {
                const filteredProjects = filter === 'All' ? this.data : this.data.filter(p => p.tags.includes(filter));
                this.carouselWrapper.innerHTML = '';

                filteredProjects.forEach(project => {
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';
                    slide.innerHTML = `
                        <div class="project-card" data-tilt data-tilt-max="5" data-tilt-speed="400" data-tilt-perspective="1000">
                            <div class="project-image-wrapper">
                                <div class="project-image" style="background-image: url(${project.image})"></div>
                            </div>
                            <div class="project-content">
                                <h3>${project.title}</h3>
                                <p>${project.description}</p>
                                <div class="project-tags">
                                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                                ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link github-link"><i class="ph ph-github-logo"></i></a>` : ''}
                            </div>
                        </div>
                    `;
                    this.carouselWrapper.appendChild(slide);
                });

                this.initCarousel();
                this.initTilt();
            },
            renderFilters() {
                const tags = ['All', 'Work', 'Freelance', 'Personal', 'Open Source'];
                this.filters.innerHTML = tags.map(tag => `<button class="filter-btn" data-filter="${tag}">${tag}</button>`).join('');
                
                const filterButtons = this.filters.querySelectorAll('.filter-btn');
                filterButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        filterButtons.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        this.renderProjects(btn.dataset.filter);
                    });
                });
                this.filters.querySelector('[data-filter="All"]').classList.add('active');
            },
            initCarousel() {
                if (this.carousel) {
                    this.carousel.destroy(true, true);
                }
                this.carousel = new Swiper('.projects-carousel', {
                    rewind: true,
                    centeredSlides: true,
                    slidesPerView: 1,
                    speed: 800,
                    spaceBetween: 20,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    breakpoints: {
                        768: {
                            slidesPerView: 1.5,
                            spaceBetween: 30,
                        },
                        1024: {
                            slidesPerView: 2.5,
                            spaceBetween: 40,
                        },
                    }
                });

                this.carousel.on('click', (swiper, event) => {
                    const clickedSlide = event.target.closest('.swiper-slide');
                    if (clickedSlide && !clickedSlide.classList.contains('swiper-slide-active')) {
                        const clickedIndex = Array.from(swiper.slides).indexOf(clickedSlide);
                        swiper.slideTo(clickedIndex);
                    }
                });
            },
            initTilt() {
                VanillaTilt.init(document.querySelectorAll(".project-card"), {
                    max: 10,
                    speed: 400,
                    glare: true,
                    "max-glare": 0.2
                });
            }
        },

        // --- Blog Loader ---
        blog: {
            init() {
                this.fetchPosts();
            },
            async fetchPosts() {
                const mediumUsername = 'hamzamlwh';
                const rssToJsonApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(`https://medium.com/feed/@${mediumUsername}`)}`;
                const grid = document.getElementById('blog-grid');

                if (!grid) return;

                try {
                    const response = await fetch(rssToJsonApiUrl);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const data = await response.json();

                    if (data.status !== 'ok') {
                        grid.innerHTML = '<p>Error loading Medium feed.</p>';
                        return;
                    }

                    const posts = data.items.slice(0, 3);
                    let html = '';

                    posts.forEach((post, index) => {
                        let imageUrl = 'assets/default-article-image.png'; // Default fallback

                        // 1. Try the direct thumbnail first.
                        if (post.thumbnail && post.thumbnail.length > 0) {
                            imageUrl = post.thumbnail;
                        } else {
                            // 2. If no thumbnail, parse the description string for the first image URL.
                            const desc = post.description;
                            const imgMatch = desc.match(/<img[^>]+src="([^">]+)"/);
                            if (imgMatch && imgMatch[1]) {
                                imageUrl = imgMatch[1];
                            }
                        }

                        const postDate = new Date(post.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                        const excerpt = post.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...';

                        html += `
                            <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="blog-card" data-animate data-delay="${index * 0.1}">
                                <div class="blog-card-image" style="background-image: url(${imageUrl})"></div>
                                <div class="blog-card-content">
                                    <h3>${post.title}</h3>
                                    <p class="date">${postDate}</p>
                                    <p>${excerpt}</p>
                                </div>
                            </a>
                        `;
                    });

                    grid.innerHTML = html;
                    app.animations.init(); // Re-initialize animations to catch the new blog cards

                } catch (error) {
                    grid.innerHTML = '<p>Could not fetch articles at this time.</p>';
                    console.error('Error fetching Medium posts:', error);
                }
            }
        }
    };

    app.init();
});