// Reset Password Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Redirect if already logged in
    if (window.authSystem.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    const resetForm = document.getElementById('resetPasswordForm');
    const emailInput = document.getElementById('resetEmail');
    const sendCodeButton = document.getElementById('sendCodeButton');
    const buttonText = sendCodeButton.querySelector('.button-text');
    const loadingSpinner = sendCodeButton.querySelector('.loading-spinner');
    
    // Form validation
    function validateForm() {
        const email = emailInput.value.trim();
        const errorElement = document.getElementById('emailError');
        
        if (!email) {
            errorElement.textContent = window.t('required_field');
            return false;
        }
        
        if (!window.authSystem.validateEmail(email)) {
            errorElement.textContent = window.t('invalid_email');
            return false;
        }
        
        errorElement.textContent = '';
        return true;
    }
    
    // Handle form submission
    resetForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        sendCodeButton.disabled = true;
        buttonText.classList.add('d-none');
        loadingSpinner.classList.remove('d-none');
        
        try {
            const result = await window.authSystem.resetPasswordRequest(emailInput.value.trim());
            
            if (result.success) {
                showMessage(result.message, 'success');
                
                // Redirect to new password page after short delay
                setTimeout(() => {
                    window.location.href = `new-password.html?email=${encodeURIComponent(emailInput.value.trim())}`;
                }, 2000);
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Password reset request failed. Please try again.', 'error');
        } finally {
            // Reset loading state
            sendCodeButton.disabled = false;
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
    
    // Handle Enter key
    emailInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            resetForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // Auto-focus email field
    emailInput.focus();
});