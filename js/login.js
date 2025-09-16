// Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Redirect if already logged in
    if (window.authSystem.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const loginButton = document.getElementById('loginButton');
    const buttonText = loginButton.querySelector('.button-text');
    const loadingSpinner = loginButton.querySelector('.loading-spinner');
    
    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(error => {
            error.textContent = '';
        });
        
        // Validate email
        const email = emailInput.value.trim();
        if (!email) {
            document.getElementById('emailError').textContent = window.t('required_field');
            isValid = false;
        } else if (!window.authSystem.validateEmail(email)) {
            document.getElementById('emailError').textContent = window.t('invalid_email');
            isValid = false;
        }
        
        // Validate password
        const password = passwordInput.value;
        if (!password) {
            document.getElementById('passwordError').textContent = window.t('required_field');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        loginButton.disabled = true;
        buttonText.classList.add('d-none');
        loadingSpinner.classList.remove('d-none');
        
        try {
            const result = await window.authSystem.login(
                emailInput.value.trim(),
                passwordInput.value
            );
            
            if (result.success) {
                showMessage(result.message, 'success');
                
                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Login failed. Please try again.', 'error');
        } finally {
            // Reset loading state
            loginButton.disabled = false;
            buttonText.classList.remove('d-none');
            loadingSpinner.classList.add('d-none');
        }
    });
    
    // Real-time validation
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        const errorElement = document.getElementById('emailError');
        
        if (email && !window.authSystem.validateEmail(email)) {
            errorElement.textContent = window.t('invalid_email');
        } else {
            errorElement.textContent = '';
        }
    });
    
    // Clear errors on input
    emailInput.addEventListener('input', function() {
        document.getElementById('emailError').textContent = '';
    });
    
    passwordInput.addEventListener('input', function() {
        document.getElementById('passwordError').textContent = '';
    });
    
    // Handle Enter key
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    });
    
    // Auto-focus first field
    emailInput.focus();
    
    // Check for verification success message
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('verified') === 'true') {
        showMessage('Account verified successfully! You can now log in.', 'success');
    }
    
    if (urlParams.get('reset') === 'true') {
        showMessage('Password reset successfully! You can now log in with your new password.', 'success');
    }
});