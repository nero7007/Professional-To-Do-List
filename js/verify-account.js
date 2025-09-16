// Verify Account Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Redirect if already logged in
    if (window.authSystem.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    
    // Redirect if no email provided
    if (!email) {
        window.location.href = 'register.html';
        return;
    }
    
    const verifyForm = document.getElementById('verifyForm');
    const codeInput = document.getElementById('verificationCode');
    const verifyButton = document.getElementById('verifyButton');
    const resendButton = document.getElementById('resendButton');
    const userEmailElement = document.getElementById('userEmail');
    const buttonText = verifyButton.querySelector('.button-text');
    const loadingSpinner = verifyButton.querySelector('.loading-spinner');
    const countdownElement = document.querySelector('.countdown');
    const countdownTime = document.getElementById('countdownTime');
    
    // Display email
    if (userEmailElement) {
        userEmailElement.textContent = email;
    }
    
    // Countdown timer for resend button
    let countdownTimer = null;
    let countdownSeconds = 0;
    
    function startCountdown(seconds = 30) {
        countdownSeconds = seconds;
        resendButton.disabled = true;
        countdownElement.classList.remove('d-none');
        
        countdownTimer = setInterval(() => {
            countdownSeconds--;
            countdownTime.textContent = countdownSeconds;
            
            if (countdownSeconds <= 0) {
                clearInterval(countdownTimer);
                resendButton.disabled = false;
                countdownElement.classList.add('d-none');
            }
        }, 1000);
    }
    
    // Form validation
    function validateForm() {
        const code = codeInput.value.trim();
        const errorElement = document.getElementById('codeError');
        
        if (!code) {
            errorElement.textContent = window.t('required_field');
            return false;
        }
        
        if (!/^\d{6}$/.test(code)) {
            errorElement.textContent = window.t('code_invalid');
            return false;
        }
        
        errorElement.textContent = '';
        return true;
    }
    
    // Handle form submission
    verifyForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        verifyButton.disabled = true;
        buttonText.classList.add('d-none');
        loadingSpinner.classList.remove('d-none');
        
        try {
            const result = await window.authSystem.verifyAccount(email, codeInput.value.trim());
            
            if (result.success) {
                showMessage(result.message, 'success');
                
                // Redirect to login page after short delay
                setTimeout(() => {
                    window.location.href = 'login.html?verified=true';
                }, 1000);
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Verification failed. Please try again.', 'error');
        } finally {
            // Reset loading state
            verifyButton.disabled = false;
            buttonText.classList.remove('d-none');
            loadingSpinner.classList.add('d-none');
        }
    });
    
    // Handle resend code
    resendButton.addEventListener('click', async function() {
        if (this.disabled) return;
        
        // Simulate resending code (in real app, would make API call)
        showMessage(window.t('verification_sent'), 'success');
        
        // Start countdown
        startCountdown(30);
        
        // Generate new verification code (simulate)
        const users = JSON.parse(localStorage.getItem('todo_users') || '[]');
        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex !== -1) {
            users[userIndex].verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            localStorage.setItem('todo_users', JSON.stringify(users));
            
            // Update pending verification
            localStorage.setItem('todo_pending_verification', JSON.stringify({
                email: email,
                code: users[userIndex].verificationCode,
                timestamp: Date.now()
            }));
        }
    });
    
    // Real-time validation
    codeInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, ''); // Only digits
        if (value.length > 6) {
            value = value.substring(0, 6);
        }
        this.value = value;
        
        // Clear error
        document.getElementById('codeError').textContent = '';
        
        // Auto-submit if 6 digits entered
        if (value.length === 6) {
            setTimeout(() => {
                if (validateForm()) {
                    verifyForm.dispatchEvent(new Event('submit'));
                }
            }, 500);
        }
    });
    
    // Handle paste
    codeInput.addEventListener('paste', function(e) {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        const digits = paste.replace(/\D/g, '').substring(0, 6);
        this.value = digits;
        
        if (digits.length === 6) {
            setTimeout(() => {
                if (validateForm()) {
                    verifyForm.dispatchEvent(new Event('submit'));
                }
            }, 500);
        }
    });
    
    // Handle Enter key
    codeInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            verifyForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // Auto-focus input
    codeInput.focus();
    
    // Start initial countdown
    startCountdown(30);
    
    // Show helpful message
    setTimeout(() => {
        showMessage('Enter any 6-digit code to verify your account (demo mode)', 'info');
    }, 1000);
});