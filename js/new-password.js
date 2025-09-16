// New Password Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Redirect if already logged in
    if (window.authSystem.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Check if coming from password reset
    const resetData = JSON.parse(localStorage.getItem('todo_password_reset') || '{}');
    if (!resetData.email) {
        window.location.href = 'reset-password.html';
        return;
    }
    
    const newPasswordForm = document.getElementById('newPasswordForm');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmNewPassword');
    const updateButton = document.getElementById('updatePasswordButton');
    const buttonText = updateButton.querySelector('.button-text');
    const loadingSpinner = updateButton.querySelector('.loading-spinner');
    
    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(error => {
            error.textContent = '';
        });
        
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Validate new password
        if (!newPassword) {
            document.getElementById('newPasswordError').textContent = window.t('required_field');
            isValid = false;
        } else {
            const passwordValidation = window.authSystem.validatePassword(newPassword);
            if (!passwordValidation.isValid) {
                document.getElementById('newPasswordError').textContent = window.t('password_requirements');
                isValid = false;
            }
        }
        
        // Validate confirm password
        if (!confirmPassword) {
            document.getElementById('confirmPasswordError').textContent = window.t('required_field');
            isValid = false;
        } else if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            document.getElementById('confirmPasswordError').textContent = window.t('passwords_not_match');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Handle form submission
    newPasswordForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        updateButton.disabled = true;
        buttonText.classList.add('d-none');
        loadingSpinner.classList.remove('d-none');
        
        try {
            const result = await window.authSystem.resetPassword(
                newPasswordInput.value,
                confirmPasswordInput.value
            );
            
            if (result.success) {
                showMessage(result.message, 'success');
                
                // Redirect to login page after short delay
                setTimeout(() => {
                    window.location.href = 'login.html?reset=true';
                }, 2000);
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Password update failed. Please try again.', 'error');
        } finally {
            // Reset loading state
            updateButton.disabled = false;
            buttonText.classList.remove('d-none');
            loadingSpinner.classList.add('d-none');
        }
    });
    
    // Password validation with visual feedback
    newPasswordInput.addEventListener('input', function() {
        const password = this.value;
        const errorElement = document.getElementById('newPasswordError');
        const requirements = document.querySelectorAll('.password-requirements li');
        
        if (password) {
            const validation = window.authSystem.validatePassword(password);
            
            // Update requirement indicators
            requirements.forEach((req, index) => {
                const checks = [
                    password.length >= 8 && password.length <= 15, // Length
                    /[A-Z]/.test(password) && /[a-z]/.test(password), // Upper & lower case
                    /\d/.test(password), // Numbers
                    /[@#$%*]/.test(password) // Special chars
                ];
                
                if (checks[index]) {
                    req.style.color = 'var(--success-color)';
                    req.style.fontWeight = 'bold';
                } else {
                    req.style.color = 'var(--text-muted)';
                    req.style.fontWeight = 'normal';
                }
            });
            
            errorElement.textContent = '';
        } else {
            errorElement.textContent = '';
            requirements.forEach(req => {
                req.style.color = 'var(--text-muted)';
                req.style.fontWeight = 'normal';
            });
        }
        
        // Check confirm password match if both have values
        if (confirmPasswordInput.value && password !== confirmPasswordInput.value) {
            document.getElementById('confirmPasswordError').textContent = window.t('passwords_not_match');
        } else {
            document.getElementById('confirmPasswordError').textContent = '';
        }
    });
    
    // Confirm password validation
    confirmPasswordInput.addEventListener('input', function() {
        const confirmPassword = this.value;
        const newPassword = newPasswordInput.value;
        const errorElement = document.getElementById('confirmPasswordError');
        
        if (confirmPassword && newPassword && confirmPassword !== newPassword) {
            errorElement.textContent = window.t('passwords_not_match');
        } else {
            errorElement.textContent = '';
        }
    });
    
    // Clear errors on input
    [newPasswordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('focus', function() {
            const errorId = this.id + 'Error';
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    });
    
    // Auto-focus first field
    newPasswordInput.focus();
    
    // Show helpful message
    setTimeout(() => {
        showMessage('Enter your new password. Make sure it meets all requirements.', 'info');
    }, 500);
});