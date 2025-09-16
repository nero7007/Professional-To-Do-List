// Register Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Redirect if already logged in
    if (window.authSystem.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    const registerForm = document.getElementById('registerForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('registerEmail');
    const phoneInput = document.getElementById('phoneNumber');
    const passwordInput = document.getElementById('registerPassword');
    const registerButton = document.getElementById('registerButton');
    const buttonText = registerButton.querySelector('.button-text');
    const loadingSpinner = registerButton.querySelector('.loading-spinner');
    
    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(error => {
            error.textContent = '';
        });
        
        // Validate first name
        const firstName = firstNameInput.value.trim();
        if (!firstName) {
            document.getElementById('firstNameError').textContent = window.t('required_field');
            isValid = false;
        } else if (!window.authSystem.validateName(firstName)) {
            if (firstName.length < 3) {
                document.getElementById('firstNameError').textContent = window.t('name_min_length');
            } else if (firstName.length > 15) {
                document.getElementById('firstNameError').textContent = window.t('name_max_length');
            } else {
                document.getElementById('firstNameError').textContent = window.t('name_letters_only');
            }
            isValid = false;
        }
        
        // Validate last name
        const lastName = lastNameInput.value.trim();
        if (!lastName) {
            document.getElementById('lastNameError').textContent = window.t('required_field');
            isValid = false;
        } else if (!window.authSystem.validateName(lastName)) {
            if (lastName.length < 3) {
                document.getElementById('lastNameError').textContent = window.t('name_min_length');
            } else if (lastName.length > 15) {
                document.getElementById('lastNameError').textContent = window.t('name_max_length');
            } else {
                document.getElementById('lastNameError').textContent = window.t('name_letters_only');
            }
            isValid = false;
        }
        
        // Validate email
        const email = emailInput.value.trim();
        if (!email) {
            document.getElementById('registerEmailError').textContent = window.t('required_field');
            isValid = false;
        } else if (!window.authSystem.validateEmail(email)) {
            document.getElementById('registerEmailError').textContent = window.t('invalid_email');
            isValid = false;
        }
        
        // Validate phone
        const phone = phoneInput.value.trim();
        if (!phone) {
            document.getElementById('phoneError').textContent = window.t('required_field');
            isValid = false;
        } else if (!window.authSystem.validatePhone(phone)) {
            document.getElementById('phoneError').textContent = window.t('phone_invalid');
            isValid = false;
        }
        
        // Validate password
        const password = passwordInput.value;
        if (!password) {
            document.getElementById('registerPasswordError').textContent = window.t('required_field');
            isValid = false;
        } else {
            const passwordValidation = window.authSystem.validatePassword(password);
            if (!passwordValidation.isValid) {
                document.getElementById('registerPasswordError').textContent = window.t('password_requirements');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    // Handle form submission
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        registerButton.disabled = true;
        buttonText.classList.add('d-none');
        loadingSpinner.classList.remove('d-none');
        
        try {
            const userData = {
                firstName: firstNameInput.value.trim(),
                lastName: lastNameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                password: passwordInput.value
            };
            
            const result = await window.authSystem.register(userData);
            
            if (result.success) {
                showMessage(result.message, 'success');
                
                // Redirect to verification page after short delay
                setTimeout(() => {
                    window.location.href = `verify-account.html?email=${encodeURIComponent(userData.email)}`;
                }, 1000);
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Registration failed. Please try again.', 'error');
        } finally {
            // Reset loading state
            registerButton.disabled = false;
            buttonText.classList.remove('d-none');
            loadingSpinner.classList.add('d-none');
        }
    });
    
    // Real-time validation
    function setupRealTimeValidation(input, validateFn, errorId) {
        input.addEventListener('blur', function() {
            const value = this.value.trim();
            const errorElement = document.getElementById(errorId);
            
            if (value) {
                const isValid = validateFn(value);
                if (!isValid) {
                    if (input === firstNameInput || input === lastNameInput) {
                        if (value.length < 3) {
                            errorElement.textContent = window.t('name_min_length');
                        } else if (value.length > 15) {
                            errorElement.textContent = window.t('name_max_length');
                        } else {
                            errorElement.textContent = window.t('name_letters_only');
                        }
                    } else if (input === emailInput) {
                        errorElement.textContent = window.t('invalid_email');
                    } else if (input === phoneInput) {
                        errorElement.textContent = window.t('phone_invalid');
                    }
                } else {
                    errorElement.textContent = '';
                }
            }
        });
        
        input.addEventListener('input', function() {
            document.getElementById(errorId).textContent = '';
        });
    }
    
    // Setup real-time validation
    setupRealTimeValidation(firstNameInput, window.authSystem.validateName, 'firstNameError');
    setupRealTimeValidation(lastNameInput, window.authSystem.validateName, 'lastNameError');
    setupRealTimeValidation(emailInput, window.authSystem.validateEmail, 'registerEmailError');
    setupRealTimeValidation(phoneInput, window.authSystem.validatePhone, 'phoneError');
    
    // Password validation with visual feedback
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const errorElement = document.getElementById('registerPasswordError');
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
            
            if (!validation.isValid) {
                errorElement.textContent = '';
            }
        } else {
            errorElement.textContent = '';
            requirements.forEach(req => {
                req.style.color = 'var(--text-muted)';
                req.style.fontWeight = 'normal';
            });
        }
    });
    
    // Auto-focus first field
    firstNameInput.focus();
    
    // Format phone input
    phoneInput.addEventListener('input', function() {
        let value = this.value.replace(/[^\d+]/g, '');
        
        // Ensure it starts with +
        if (value && !value.startsWith('+')) {
            value = '+' + value;
        }
        
        this.value = value;
    });
    
    // Name capitalization
    [firstNameInput, lastNameInput].forEach(input => {
        input.addEventListener('blur', function() {
            const value = this.value.trim();
            if (value) {
                this.value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            }
        });
    });
});