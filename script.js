let currentStep = 1;
const totalSteps = 3;

function updateProgress() {
    // 1 -> 33%, 2 -> 66%, 3 -> 100%
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
}

function nextStep(step) {
    // Basic validation before moving
    if (step === 1) {
        const loc = document.getElementById('location').value;
        if (!loc.trim()) {
            alert('Please enter your property location to continue.');
            document.getElementById('location').focus();
            return;
        }
    }
    
    if (step === 2) {
        const condition = document.querySelector('input[name="condition"]:checked');
        if (!condition) {
            alert('Please select the current condition of your home.');
            return;
        }
    }

    // Hide current step, show next
    const currentEl = document.getElementById(`step-${step}`);
    currentEl.style.opacity = '0';
    
    setTimeout(() => {
        currentEl.classList.remove('active');
        currentStep++;
        const nextEl = document.getElementById(`step-${currentStep}`);
        nextEl.classList.add('active');
        // Small delay to trigger CSS transition
        setTimeout(() => {
            nextEl.style.opacity = '1';
        }, 10);
        updateProgress();
        
        // Auto focus for better UX
        if(currentStep === 3) {
            document.getElementById('fullName').focus();
        }
    }, 200); // Wait for fade out
}

function prevStep(step) {
    const currentEl = document.getElementById(`step-${step}`);
    currentEl.style.opacity = '0';
    
    setTimeout(() => {
        currentEl.classList.remove('active');
        currentStep--;
        const prevEl = document.getElementById(`step-${currentStep}`);
        prevEl.classList.add('active');
        setTimeout(() => {
            prevEl.style.opacity = '1';
        }, 10);
        updateProgress();
    }, 200);
}

// Ensure first step is visible
document.getElementById('step-1').style.opacity = '1';

// Handle Form Submission
document.getElementById('lead-form').addEventListener('submit', function(e) {
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
    const WEBHOOK_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'; 

    // Simulation of network request (Replace with actual fetch)
    setTimeout(() => {
        // Hide Step 3 and Show Success Message
        const step3 = document.getElementById('step-3');
        step3.style.opacity = '0';
        
        setTimeout(() => {
            step3.classList.remove('active');
            const successEl = document.getElementById('form-success');
            successEl.classList.add('active');
            setTimeout(() => {
                successEl.style.opacity = '1';
            }, 10);
            document.getElementById('progress-fill').style.width = '100%';
            
            // Reset button internally
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
        }, 300);

        /* Example Fetch Request for actual GAS Integration (using no-cors)
        fetch(WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(() => {
            // Transitions to success...
        }).catch(err => {
            console.error(err);
            alert("Something went wrong. Please try again later.");
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
        });
        */
        
    }, 1500);
});

// Exit Intent Logic
let exitModalShown = false;

document.addEventListener('mouseleave', function(e) {
    // If mouse goes up and outside the window
    if (e.clientY < 0 && !exitModalShown) {
        document.getElementById('exit-modal').classList.add('active');
        exitModalShown = true;
    }
});

document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('exit-modal').classList.remove('active');
});

// Keyboard Accessibility for Exit Modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.getElementById('exit-modal').classList.remove('active');
    }
});
