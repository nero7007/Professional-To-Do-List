// Theme Management System
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }
    
    init() {
        this.applyTheme();
        this.setupThemeToggle();
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme();
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    applyTheme() {
        // Set theme attribute on document
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Update theme toggle icons
        this.updateThemeIcons();
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor();
    }
    
    updateThemeIcons() {
        const themeButtons = document.querySelectorAll('#themeToggle, .theme-toggle');
        themeButtons.forEach(button => {
            const icon = button.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
            }
        });
    }
    
    updateMetaThemeColor() {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        // Set appropriate theme color based on current theme
        const color = this.currentTheme === 'light' ? '#ffffff' : '#1a1a1a';
        metaThemeColor.content = color;
    }
    
    setupThemeToggle() {
        // Add event listeners to all theme toggle buttons
        const themeButtons = document.querySelectorAll('#themeToggle, .theme-toggle');
        themeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.toggleTheme();
            });
        });
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    isDarkTheme() {
        return this.currentTheme === 'dark';
    }
    
    // Get theme-appropriate colors for dynamic content
    getThemeColors() {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        
        return {
            primary: computedStyle.getPropertyValue('--bg-primary').trim(),
            secondary: computedStyle.getPropertyValue('--bg-secondary').trim(),
            text: computedStyle.getPropertyValue('--text-primary').trim(),
            textSecondary: computedStyle.getPropertyValue('--text-secondary').trim(),
            accent: computedStyle.getPropertyValue('--accent-color').trim(),
            border: computedStyle.getPropertyValue('--border-color').trim(),
            success: computedStyle.getPropertyValue('--success-color').trim(),
            warning: computedStyle.getPropertyValue('--warning-color').trim(),
            error: computedStyle.getPropertyValue('--error-color').trim()
        };
    }
    
    // Add smooth transition when switching themes
    enableTransition() {
        document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        // Remove transition after it completes to avoid interfering with other animations
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    }
}

// Initialize theme manager
window.themeManager = new ThemeManager();

// Add smooth transitions when changing themes
document.addEventListener('DOMContentLoaded', () => {
    const originalToggleTheme = window.themeManager.toggleTheme;
    window.themeManager.toggleTheme = function() {
        this.enableTransition();
        originalToggleTheme.call(this);
    };
});