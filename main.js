/**
 * Allyssa's Life in Progress - Main JavaScript
 * Handles site interactivity, animations, and user experience features
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - with null checks to prevent errors on pages without these elements
    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");
    const menuBtnIcon = menuBtn ? menuBtn.querySelector("i") : null;
    const accountBtn = document.getElementById('account-btn');
    const accountDropdown = document.getElementById('account-dropdown');
    const faqItems = document.querySelectorAll('.faq-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const forms = document.querySelectorAll('form');
    
    // ===== Mobile Menu Enhanced Accessibility =====
    if (menuBtn && navLinks) {
        // Toggle menu with improved transitions
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = navLinks.classList.contains('open');
            menuBtn.setAttribute("aria-expanded", !isOpen);
            
            if (menuBtnIcon) {
                menuBtnIcon.setAttribute("class", isOpen ? "ri-menu-line" : "ri-close-line");
            }
            
            if (isOpen) {
                // Add closing animation
                navLinks.classList.add('closing');
                // Wait for animation to complete before removing the open class
                setTimeout(() => {
                    navLinks.classList.remove('open', 'closing');
                }, 300); // Match this timing with your CSS transition
            } else {
                navLinks.classList.add('open');
                
                // Focus the first link for keyboard users when menu opens
                setTimeout(() => {
                    const firstLink = navLinks.querySelector('a');
                    if (firstLink) firstLink.focus();
                }, 100);
            }
        });
        
        // Handle Escape key to close menu
        navLinks.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                navLinks.classList.add('closing');
                menuBtn.setAttribute("aria-expanded", "false");
                if (menuBtnIcon) {
                    menuBtnIcon.setAttribute("class", "ri-menu-line");
                }
                setTimeout(() => {
                    navLinks.classList.remove('open', 'closing');
                }, 300);
                menuBtn.focus(); // Return focus to the menu button
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navLinks.classList.contains('open') && 
                !navLinks.contains(e.target) && 
                !menuBtn.contains(e.target)) {
                navLinks.classList.add('closing');
                menuBtn.setAttribute("aria-expanded", "false");
                if (menuBtnIcon) {
                    menuBtnIcon.setAttribute("class", "ri-menu-line");
                }
                setTimeout(() => {
                    navLinks.classList.remove('open', 'closing');
                }, 300);
            }
        });
    }
    
    // ===== Account Dropdown Enhanced Accessibility =====
    if (accountBtn && accountDropdown) {
        accountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = accountDropdown.classList.contains('open');
            
            accountBtn.setAttribute('aria-expanded', !isOpen);
            accountDropdown.classList.toggle('open');
            
            // If opening, focus the first link for keyboard users
            if (!isOpen) {
                setTimeout(() => {
                    const firstLink = accountDropdown.querySelector('a');
                    if (firstLink) firstLink.focus();
                }, 100);
            }
        });
        
        // Handle Escape key to close dropdown
        accountDropdown.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                accountDropdown.classList.remove('open');
                accountBtn.setAttribute('aria-expanded', 'false');
                accountBtn.focus(); // Return focus to button
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (accountDropdown.classList.contains('open') && 
                !accountDropdown.contains(e.target) && 
                !accountBtn.contains(e.target)) {
                accountDropdown.classList.remove('open');
                accountBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // ===== FAQ Accordion Enhanced Accessibility =====
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                // Initialize ARIA attributes if not present
                if (!question.hasAttribute('aria-expanded')) {
                    question.setAttribute('aria-expanded', 'false');
                }
                
                if (!answer.hasAttribute('hidden') && !question.getAttribute('aria-expanded') === 'true') {
                    answer.setAttribute('hidden', '');
                }
                
                question.addEventListener('click', () => {
                    const isExpanded = question.getAttribute('aria-expanded') === 'true';
                    
                    // Close other open FAQs
                    faqItems.forEach(otherItem => {
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        
                        if (otherItem !== item && otherQuestion && otherAnswer && 
                            otherQuestion.getAttribute('aria-expanded') === 'true') {
                            otherQuestion.setAttribute('aria-expanded', 'false');
                            otherAnswer.setAttribute('hidden', '');
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Toggle current FAQ
                    question.setAttribute('aria-expanded', !isExpanded);
                    
                    if (isExpanded) {
                        answer.setAttribute('hidden', '');
                        item.classList.remove('active');
                    } else {
                        answer.removeAttribute('hidden');
                        item.classList.add('active');
                    }
                });
                
                // Add keyboard support for the FAQ accordion
                question.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        question.click();
                    }
                });
            }
        });
    }
    
    // ===== Gallery Filtering Enhanced Accessibility =====
    if (filterButtons.length > 0 && galleryItems.length > 0) {
        // Initialize first button as active
        if (!Array.from(filterButtons).some(btn => btn.classList.contains('active'))) {
            filterButtons[0].classList.add('active');
            filterButtons[0].setAttribute('aria-pressed', 'true');
        }
        
        // Announce filter changes to screen readers
        const createFilterAnnouncement = () => {
            let announcement = document.getElementById('filter-announcement');
            if (!announcement) {
                announcement = document.createElement('div');
                announcement.id = 'filter-announcement';
                announcement.className = 'sr-only';
                announcement.setAttribute('aria-live', 'polite');
                document.body.appendChild(announcement);
            }
            return announcement;
        };
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
                
                // Get filter category
                const filterValue = button.getAttribute('data-filter');
                
                // Count visible items for announcement
                let visibleCount = 0;
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category') || '';
                    
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.style.display = 'block';
                        item.removeAttribute('aria-hidden');
                        visibleCount++;
                        
                        setTimeout(() => {
                            item.classList.add('appear');
                            item.style.opacity = '1';
                        }, 50);
                    } else {
                        item.classList.remove('appear');
                        item.style.opacity = '0';
                        item.setAttribute('aria-hidden', 'true');
                        
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
                
                // Announce to screen readers
                const announcement = createFilterAnnouncement();
                const categoryName = filterValue === 'all' ? 'all destinations' : filterValue;
                announcement.textContent = `Showing ${visibleCount} items from ${categoryName} category`;
            });
            
            // Add keyboard support
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }
    
    // ===== Form Validation =====
    if (forms.length > 0) {
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                let isValid = true;
                
                // Clear previous errors
                const errorMessages = form.querySelectorAll('.form-error');
                errorMessages.forEach(el => el.remove());
                
                // Check required fields
                const requiredInputs = form.querySelectorAll('[required]');
                let firstInvalidInput = null;
                
                requiredInputs.forEach(input => {
                    // Mark as invalid if empty
                    if (!input.value.trim()) {
                        isValid = false;
                        showError(input, 'This field is required');
                        
                        if (!firstInvalidInput) {
                            firstInvalidInput = input;
                        }
                    }
                    
                    // Email validation
                    if (input.type === 'email' && input.value.trim()) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(input.value.trim())) {
                            isValid = false;
                            showError(input, 'Please enter a valid email address');
                            
                            if (!firstInvalidInput) {
                                firstInvalidInput = input;
                            }
                        }
                    }
                });
                
                // Focus first invalid field
                if (firstInvalidInput) {
                    firstInvalidInput.focus();
                } else if (isValid) {
                    // For demonstration - in real site this would submit the form
                    const submitFeedback = document.createElement('div');
                    submitFeedback.className = 'form-success';
                    submitFeedback.setAttribute('role', 'alert');
                    submitFeedback.textContent = 'Form submitted successfully!';
                    
                    // Clear previous success messages
                    const previousSuccess = form.querySelector('.form-success');
                    if (previousSuccess) {
                        previousSuccess.remove();
                    }
                    
                    // Find submit button and insert before it
                    const submitBtn = form.querySelector('[type="submit"]');
                    form.insertBefore(submitFeedback, submitBtn);
                    
                    // Scroll to feedback
                    submitFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    // Optionally reset form
                    // form.reset();
                }
            });
            
            function showError(input, message) {
                // Create error message
                const error = document.createElement('div');
                error.className = 'form-error';
                error.setAttribute('role', 'alert');
                error.textContent = message;
                
                // Add error class to input
                input.classList.add('error');
                
                // Find parent container
                const formGroup = input.closest('.form-group');
                if (formGroup) {
                    formGroup.appendChild(error);
                } else {
                    input.insertAdjacentElement('afterend', error);
                }
            }
        });
    }
    
    // ===== Lightbox Image Gallery =====
    const galleryImages = document.querySelectorAll('.gallery-item img');
    
    if (galleryImages.length > 0) {
        // Store focused element for accessibility
        let focusedElementBeforeLightbox;
        
        galleryImages.forEach(img => {
            img.addEventListener('click', function() {
                // Store the element that had focus
                focusedElementBeforeLightbox = document.activeElement;
                
                const galleryItem = this.closest('.gallery-item');
                
                // Create lightbox elements
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                lightbox.setAttribute('role', 'dialog');
                lightbox.setAttribute('aria-modal', 'true');
                
                const lightboxContent = document.createElement('div');
                lightboxContent.className = 'lightbox-content';
                
                const lightboxImg = document.createElement('img');
                lightboxImg.src = this.src;
                lightboxImg.alt = this.alt || 'Image';
                
                const caption = document.createElement('div');
                caption.className = 'lightbox-caption';
                
                // Get image details
                let title = 'Image';
                let location = '';
                
                const titleEl = galleryItem.querySelector('.gallery-item-title');
                const locationEl = galleryItem.querySelector('.gallery-item-location');
                
                if (titleEl) title = titleEl.textContent;
                if (locationEl) location = locationEl.textContent;
                
                caption.innerHTML = `<h3>${title}</h3><p>${location}</p>`;
                
                // Close button
                const closeBtn = document.createElement('button');
                closeBtn.className = 'lightbox-close';
                closeBtn.innerHTML = '&times;';
                closeBtn.setAttribute('aria-label', 'Close lightbox');
                
                // Append elements
                lightboxContent.appendChild(lightboxImg);
                lightboxContent.appendChild(caption);
                lightboxContent.appendChild(closeBtn);
                lightbox.appendChild(lightboxContent);
                document.body.appendChild(lightbox);
                
                // Prevent background scrolling
                document.body.style.overflow = 'hidden';
                
                // Animation
                setTimeout(() => {
                    lightbox.classList.add('active');
                    closeBtn.focus();
                }, 10);
                
                // Close function
                function closeLightbox() {
                    lightbox.classList.remove('active');
                    setTimeout(() => {
                        document.body.removeChild(lightbox);
                        document.body.style.overflow = 'auto';
                        
                        // Restore focus
                        if (focusedElementBeforeLightbox) {
                            focusedElementBeforeLightbox.focus();
                        }
                    }, 300);
                }
                
                // Close events
                closeBtn.addEventListener('click', closeLightbox);
                lightbox.addEventListener('click', e => {
                    if (e.target === lightbox) closeLightbox();
                });
                
                // Keyboard navigation
                lightbox.addEventListener('keydown', e => {
                    if (e.key === 'Escape') closeLightbox();
                    if (e.key === 'Tab') e.preventDefault(); // Keep focus in lightbox
                });
            });
            
            // Keyboard accessibility for gallery items
            const galleryItem = img.closest('.gallery-item');
            if (galleryItem) {
                galleryItem.setAttribute('tabindex', '0');
                galleryItem.setAttribute('role', 'button');
                galleryItem.setAttribute('aria-label', `View ${img.alt || 'image'} in lightbox`);
                
                galleryItem.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        img.click();
                    }
                });
            }
        });
    }
    
    // ===== Skip Link Enhancement =====
    const skipLink = document.querySelector('.skip-link');
    
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                
                targetElement.addEventListener('blur', function() {
                    this.removeAttribute('tabindex');
                }, { once: true });
            }
        });
    }
    
    // ===== Lazy Loading Images =====
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (lazyImages.length > 0) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        
                        // Handle load event
                        img.addEventListener('load', () => {
                            img.classList.add('loaded');
                        });
                        
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => {
                // Ensure all images have alt text
                if (!img.hasAttribute('alt')) {
                    img.alt = 'Image';
                }
                
                imageObserver.observe(img);
            });
        }
    }
    
    // ===== Community Map Functionality =====
    // This section is added for the interactive map feature
    const communityMap = document.getElementById('community-map');
    
    if (communityMap) {
        // Initialize the map (assuming Leaflet library is loaded)
        if (typeof L !== 'undefined') {
            const map = L.map('community-map').setView([20, 0], 2);
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // Sample data for community experiences
            const communityExperiences = [
                {
                    name: "Sagrada Familia",
                    lat: 41.4036,
                    lng: 2.1744,
                    category: "attraction",
                    description: "A must-visit in Barcelona. Book tickets online in advance to avoid long queues!",
                    author: "Allyssa"
                },
                {
                    name: "Cliffs of Moher",
                    lat: 52.9715,
                    lng: -9.4309,
                    category: "attraction",
                    description: "Breathtaking views of the Atlantic. Go early morning to avoid crowds.",
                    author: "Emma T."
                },
                {
                    name: "Hidden Beach in El Nido",
                    lat: 11.1956,
                    lng: 119.3765,
                    category: "hidden-gem",
                    description: "Take a boat tour to reach this secluded paradise. Crystal clear waters!",
                    author: "Miguel L."
                }
            ];
            
            // Create marker groups for filtering
            const markerGroups = {
                all: L.layerGroup().addTo(map),
                food: L.layerGroup(),
                accommodation: L.layerGroup(),
                attraction: L.layerGroup(),
                'hidden-gem': L.layerGroup()
            };
            
            // Add sample markers to the map
            communityExperiences.forEach(exp => {
                const marker = L.marker([exp.lat, exp.lng])
                    .bindPopup(`
                        <h4>${exp.name}</h4>
                        <p class="category">${exp.category.replace('-', ' ')}</p>
                        <p>${exp.description}</p>
                        <p class="author">Shared by: ${exp.author}</p>
                    `);
                
                markerGroups.all.addLayer(marker);
                markerGroups[exp.category].addLayer(marker.clone());
            });
            
            // Handle filter buttons
            const mapFilterButtons = document.querySelectorAll('.map-filters .filter-btn');
            if (mapFilterButtons.length > 0) {
                mapFilterButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        // Update active button
                        mapFilterButtons.forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');
                        
                        // Get filter value
                        const filter = button.getAttribute('data-filter');
                        
                        // Update map layers
                        Object.keys(markerGroups).forEach(key => {
                            map.removeLayer(markerGroups[key]);
                        });
                        
                        map.addLayer(markerGroups[filter]);
                    });
                });
            }
            
            // Handle add experience form
            const addMarkerBtn = document.getElementById('add-marker-btn');
            const formContainer = document.getElementById('add-experience-form');
            const experienceForm = document.getElementById('experience-form');
            const cancelBtn = document.getElementById('cancel-experience');
            
            if (addMarkerBtn && formContainer && experienceForm && cancelBtn) {
                let tempMarker = null;
                
                // Show form when button is clicked
                addMarkerBtn.addEventListener('click', () => {
                    formContainer.style.display = 'block';
                    addMarkerBtn.disabled = true;
                });
                
                // Hide form when cancel is clicked
                cancelBtn.addEventListener('click', () => {
                    formContainer.style.display = 'none';
                    addMarkerBtn.disabled = false;
                    if (tempMarker) {
                        map.removeLayer(tempMarker);
                        tempMarker = null;
                    }
                });
                
                // Handle clicking on map to set location
                map.on('click', function(e) {
                    const lat = e.latlng.lat.toFixed(4);
                    const lng = e.latlng.lng.toFixed(4);
                    
                    const latInput = document.getElementById('location-lat');
                    const lngInput = document.getElementById('location-lng');
                    
                    if (latInput && lngInput) {
                        latInput.value = lat;
                        lngInput.value = lng;
                        
                        // Add a temporary marker
                        if (tempMarker) {
                            map.removeLayer(tempMarker);
                        }
                        
                        tempMarker = L.marker([lat, lng]).addTo(map);
                    }
                });
                
                // Handle form submission
                experienceForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Get form values
                    const nameInput = document.getElementById('location-name');
                    const categorySelect = document.getElementById('location-category');
                    const descriptionTextarea = document.getElementById('location-description');
                    const latInput = document.getElementById('location-lat');
                    const lngInput = document.getElementById('location-lng');
                    
                    if (nameInput && categorySelect && descriptionTextarea && latInput && lngInput) {
                        const name = nameInput.value;
                        const category = categorySelect.value;
                        const description = descriptionTextarea.value;
                        const lat = parseFloat(latInput.value);
                        const lng = parseFloat(lngInput.value);
                        
                        // Create a new marker
                        const newMarker = L.marker([lat, lng])
                            .bindPopup(`
                                <h4>${name}</h4>
                                <p class="category">${category.replace('-', ' ')}</p>
                                <p>${description}</p>
                                <p class="author">Shared by: You</p>
                            `);
                        
                        // Add to marker groups
                        markerGroups.all.addLayer(newMarker);
                        markerGroups[category].addLayer(newMarker.clone());
                        
                        // Show confirmation
                        alert('Your experience has been added to the map!');
                        
                        // Reset form
                        experienceForm.reset();
                        formContainer.style.display = 'none';
                        addMarkerBtn.disabled = false;
                        
                        if (tempMarker) {
                            map.removeLayer(tempMarker);
                            tempMarker = null;
                        }
                        
                        // Show all experiences after adding a new one
                        mapFilterButtons.forEach(btn => {
                            if (btn.getAttribute('data-filter') === 'all') {
                                btn.click();
                            }
                        });
                    }
                });
            }
        }
    }
});

/**
 * Enhanced Reduced Motion Support
 * Detects user preference and adjusts animations
 */
(function() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleReducedMotion() {
        if (prefersReducedMotion.matches) {
            document.documentElement.classList.add('reduced-motion');
        } else {
            document.documentElement.classList.remove('reduced-motion');
        }
    }
    
    // Set initial state
    handleReducedMotion();
    
    // Listen for changes
    prefersReducedMotion.addEventListener('change', handleReducedMotion);
})();