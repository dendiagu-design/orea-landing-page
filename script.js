// Intersection Observer for Smooth Fade-up Animations
const observerOptions = {
    root: document.querySelector('.scroll-container'),
    rootMargin: '0px',
    threshold: 0.15 // Trigger when 15% of the element is visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Select elements to animate
    const elementsToAnimate = document.querySelectorAll('.hero-content, .hero-image img, .section-header, .problem-card, .solution-image, .solution-content, .form-copy, .form-card, .testimonial-card, .closing-content h2, .closing-content .btn');

    elementsToAnimate.forEach((el, index) => {
        el.classList.add('fade-up');

        // Stagger animation delay slightly for grid items
        if (el.classList.contains('problem-card') || el.classList.contains('testimonial-card')) {
            el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        }

        observer.observe(el);
    });

    // Ensure first section triggers immediately
    setTimeout(() => {
        document.querySelectorAll('#hero .fade-up').forEach(el => el.classList.add('visible'));
    }, 100);

    // Mobile Sticky CTA hide logic when close to form
    const formSection = document.getElementById('lead-form');
    const stickyCta = document.getElementById('sticky-cta');

    if (formSection && stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stickyCta.style.transform = 'translateY(150%)'; // hide off screen
                } else {
                    stickyCta.style.transform = 'translateY(0)'; // show it
                }
            });
        }, { threshold: 0.1 });
        ctaObserver.observe(formSection);
    }
});

// Smooth scrolling for Anchor Links
document.querySelectorAll('.cta-scroll').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Focus on the first input ONLY if the target is the Lead Form
            if (targetId === '#lead-form') {
                setTimeout(() => {
                    const nameInput = document.getElementById('fullName');
                    // Prevent default browser jump mechanics to keep scroll extremely smooth
                    if(nameInput) nameInput.focus({ preventScroll: true });
                }, 800);
            }
        }
    });
});

// Handle Form Submission
const checklistForm = document.getElementById('checklist-form');
if (checklistForm) {
    checklistForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.innerText;

        // Disable button to prevent double submit
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending Request...';

        // Collect data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        // Webhook endpoint (Google Apps Script URL will be placed here)
        // Format: https://script.google.com/macros/s/.../exec
        const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbx3PjM2JYnnaLcEyaQG9INYjOzA8sWS4ZieSO5WHT8pqNyQXjctty0uzkZ3tPpqkb863w/exec';

        // Execute Real Fetch Request to GAS Backend
        fetch(WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for Google Apps Script Web App
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(() => {
            // Hide Form and Show Success Message
            const formCard = document.getElementById('form-card');
            const successCard = document.getElementById('success-card');
            
            if(formCard) formCard.style.opacity = '0';
            
            setTimeout(() => {
                if(formCard) formCard.classList.add('hidden');
                if(successCard) {
                    successCard.classList.remove('hidden');
                    void successCard.offsetWidth; 
                    successCard.style.opacity = '1';
                }

                // Track Conversion Data for Meta Ads
                try {
                    if (typeof fbq === 'function') {
                        fbq('track', 'Lead');
                        console.log("Meta Pixel: 'Lead' event tracked successfully.");
                    }
                } catch(e) { console.error("Pixel tracking error", e); }
                
                // Redirect to Dedicated Thank You Page
                window.location.href = "thank-you.html";
                
            }, 300);

        }).catch(err => {
            console.error("Submission error:", err);
            alert("Something went wrong. Please try again later.");
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
        });
    });
}
