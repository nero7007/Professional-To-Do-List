// Authentication System with localStorage Database
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('todo_users') || '[]');
        this.sessions = JSON.parse(localStorage.getItem('todo_sessions') || '[]');
        this.init();
    }
    
    init() {
        // Check for existing session on page load
        this.checkSession();
        
        // Setup logout buttons
        this.setupLogoutButtons();
    }
    
    // Generate UUID for unique IDs
    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    // Hash password (simple implementation for demo)
    hashPassword(password) {
        // In a real app, use a proper hashing library
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }
    
    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Validate password strength
    validatePassword(password) {
        const minLength = 8;
        const maxLength = 15;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[@#$%*]/.test(password);
        
        return {
            isValid: password.length >= minLength && 
                    password.length <= maxLength && 
                    hasUpperCase && 
                    hasLowerCase && 
                    hasNumbers && 
                    hasSpecialChar,
            errors: {
                length: password.length < minLength || password.length > maxLength,
                upperCase: !hasUpperCase,
                lowerCase: !hasLowerCase,
                numbers: !hasNumbers,
                specialChar: !hasSpecialChar
            }
        };
    }
    
    // Validate name
    validateName(name) {
        const nameRegex = /^[A-Za-zأ-ي\s]+$/;
        return name.length >= 3 && name.length <= 15 && nameRegex.test(name);
    }
    
    // Validate phone number
    validatePhone(phone) {
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        return phoneRegex.test(phone);
    }
    
    // Register new user
    async register(userData) {
        try {
            const { firstName, lastName, email, phone, password } = userData;
            
            // Validate input
            if (!this.validateName(firstName)) {
                throw new Error(window.t('name_letters_only'));
            }
            
            if (!this.validateName(lastName)) {
                throw new Error(window.t('name_letters_only'));
            }
            
            if (!this.validateEmail(email)) {
                throw new Error(window.t('invalid_email'));
            }
            
            if (!this.validatePhone(phone)) {
                throw new Error(window.t('phone_invalid'));
            }
            
            const passwordValidation = this.validatePassword(password);
            if (!passwordValidation.isValid) {
                throw new Error(window.t('password_requirements'));
            }
            
            // Check if user already exists
            const existingUser = this.users.find(user => user.email === email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }
            
            // Create new user
            const user = {
                id: this.generateId(),
                firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(),
                lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase(),
                email: email.toLowerCase(),
                phone: phone,
                password: this.hashPassword(password),
                isVerified: false,
                verificationCode: Math.floor(100000 + Math.random() * 900000).toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            this.users.push(user);
            localStorage.setItem('todo_users', JSON.stringify(this.users));
            
            // Store pending verification
            localStorage.setItem('todo_pending_verification', JSON.stringify({
                email: email,
                code: user.verificationCode,
                timestamp: Date.now()
            }));
            
            return {
                success: true,
                message: window.t('register_success'),
                user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message || window.t('register_failed')
            };
        }
    }
    
    // Verify account with code
    async verifyAccount(email, code) {
        try {
            const pending = JSON.parse(localStorage.getItem('todo_pending_verification') || '{}');
            
            if (!pending.email || pending.email !== email) {
                throw new Error('No pending verification for this email');
            }
            
            // Check if code is valid (accept any 6-digit code as per requirements)
            if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
                throw new Error(window.t('code_invalid'));
            }
            
            // Find and verify user
            const userIndex = this.users.findIndex(user => user.email === email);
            if (userIndex === -1) {
                throw new Error('User not found');
            }
            
            this.users[userIndex].isVerified = true;
            this.users[userIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('todo_users', JSON.stringify(this.users));
            
            // Clear pending verification
            localStorage.removeItem('todo_pending_verification');
            
            return {
                success: true,
                message: 'Account verified successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    // Login user
    async login(email, password) {
        try {
            if (!this.validateEmail(email)) {
                throw new Error(window.t('invalid_email'));
            }
            
            const user = this.users.find(u => u.email === email.toLowerCase());
            if (!user || user.password !== this.hashPassword(password)) {
                throw new Error(window.t('login_failed'));
            }
            
            if (!user.isVerified) {
                throw new Error('Please verify your account first');
            }
            
            // Create session
            const session = {
                id: this.generateId(),
                userId: user.id,
                email: user.email,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
            };
            
            this.sessions.push(session);
            localStorage.setItem('todo_sessions', JSON.stringify(this.sessions));
            localStorage.setItem('todo_current_session', session.id);
            
            this.currentUser = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            };
            
            return {
                success: true,
                message: window.t('login_success'),
                user: this.currentUser
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    // Check current session
    checkSession() {
        const sessionId = localStorage.getItem('todo_current_session');
        if (!sessionId) return false;
        
        const session = this.sessions.find(s => s.id === sessionId);
        if (!session || new Date(session.expiresAt) < new Date()) {
            this.logout();
            return false;
        }
        
        const user = this.users.find(u => u.id === session.userId);
        if (!user) {
            this.logout();
            return false;
        }
        
        this.currentUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone
        };
        
        return true;
    }
    
    // Logout user
    logout() {
        const sessionId = localStorage.getItem('todo_current_session');
        if (sessionId) {
            this.sessions = this.sessions.filter(s => s.id !== sessionId);
            localStorage.setItem('todo_sessions', JSON.stringify(this.sessions));
            localStorage.removeItem('todo_current_session');
        }
        
        this.currentUser = null;
        
        // Redirect to login page
        if (!window.location.pathname.includes('login.html') && 
            !window.location.pathname.includes('register.html') &&
            !window.location.pathname.includes('verify-account.html') &&
            !window.location.pathname.includes('reset-password.html') &&
            !window.location.pathname.includes('new-password.html')) {
            window.location.href = 'login.html';
        }
    }
    
    // Reset password request
    async resetPasswordRequest(email) {
        try {
            if (!this.validateEmail(email)) {
                throw new Error(window.t('invalid_email'));
            }
            
            const user = this.users.find(u => u.email === email.toLowerCase());
            if (!user) {
                throw new Error('No account found with this email');
            }
            
            const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Store reset request
            localStorage.setItem('todo_password_reset', JSON.stringify({
                email: email,
                code: resetCode,
                timestamp: Date.now()
            }));
            
            return {
                success: true,
                message: window.t('password_reset_sent')
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    // Reset password with new password
    async resetPassword(newPassword, confirmPassword) {
        try {
            if (newPassword !== confirmPassword) {
                throw new Error(window.t('passwords_not_match'));
            }
            
            const passwordValidation = this.validatePassword(newPassword);
            if (!passwordValidation.isValid) {
                throw new Error(window.t('password_requirements'));
            }
            
            const resetData = JSON.parse(localStorage.getItem('todo_password_reset') || '{}');
            if (!resetData.email) {
                throw new Error('No password reset in progress');
            }
            
            const userIndex = this.users.findIndex(u => u.email === resetData.email);
            if (userIndex === -1) {
                throw new Error('User not found');
            }
            
            this.users[userIndex].password = this.hashPassword(newPassword);
            this.users[userIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('todo_users', JSON.stringify(this.users));
            
            // Clear reset request
            localStorage.removeItem('todo_password_reset');
            
            return {
                success: true,
                message: 'Password reset successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }
    
    // Require authentication (redirect if not logged in)
    requireAuth() {
        if (!this.checkSession()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
    
    // Setup logout button event listeners
    setupLogoutButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn')) {
                e.preventDefault();
                this.logout();
            }
        });
    }
}

// Message display functions
function showMessage(message, type = 'info') {
    const container = document.getElementById('messageContainer');
    const text = container.querySelector('.message-text');
    
    if (container && text) {
        text.textContent = message;
        container.className = `message-container message-${type}`;
        container.classList.remove('d-none');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            hideMessage();
        }, 5000);
    }
}

function hideMessage() {
    const container = document.getElementById('messageContainer');
    if (container) {
        container.classList.add('d-none');
    }
}

// Password toggle functionality
function setupPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.closest('.password-input-wrapper').querySelector('input');
            const icon = toggle.querySelector('.password-icon');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = '🙈';
            } else {
                input.type = 'password';
                icon.textContent = '👁️';
            }
        });
    });
}

// Initialize auth system
window.authSystem = new AuthSystem();

// Setup password toggles when DOM is loaded
document.addEventListener('DOMContentLoaded', setupPasswordToggles);