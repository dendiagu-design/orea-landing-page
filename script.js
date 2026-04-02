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
        if(el.classList.contains('problem-card') || el.classList.contains('testimonial-card')) {
            el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        }
        
        observer.observe(el);
    });
    
    // Ensure first section triggers immediately
    setTimeout(() => {
        document.querySelectorAll('#hero .fade-up').forEach(el => el.classList.add('visible'));
    }, 100);
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
            // Focus on the first input after scrolling
            setTimeout(() => {
                const nameInput = document.getElementById('fullName');
                if(nameInput) nameInput.focus();
            }, 800);
        }
    });
});

// Handle Form Submission
const checklistForm = document.getElementById('checklist-form');
if (checklistForm) {
    checklistForm.addEventListener('submit', function(e) {
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
        const WEBHOOK_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'; 

        // Simulation of network request (Replace with actual fetch)
        setTimeout(() => {
            // Hide Form and Show Success Message
            const formCard = document.getElementById('form-card');
            const successCard = document.getElementById('success-card');
            
            formCard.style.opacity = '0';
            
            setTimeout(() => {
                formCard.classList.add('hidden');
                successCard.classList.remove('hidden');
                
                // Trigger reflow for CSS transition
                void successCard.offsetWidth; 
                
                successCard.style.opacity = '1';
                
                // Reset button internally in case of refresh or modal reset
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
                
                // Ensure viewport is correctly positioned if scrolled down
                successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);

            /* Actual Fetch Request for GAS Integration (example)
            fetch(WEBHOOK_URL, {
                method: 'POST',
                mode: 'no-cors', // Important for Google Apps Script Web App
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }).then(() => {
                // Execute UI transitions here
            }).catch(err => {
                console.error(err);
                alert("Something went wrong. Please try again later.");
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            });
            */
            
        }, 1500);
    });
}
