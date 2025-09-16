// نظام إدارة الإشعارات المتسق مع تصميم المشروع
class NotificationManager {
    constructor() {
        this.container = null;
        this.notifications = new Map();
        this.defaultDuration = 5000;
        this.init();
    }
    
    init() {
        this.createContainer();
        this.setupStyles();
    }
    
    createContainer() {
        // إنشاء الحاوي إذا لم يكن موجوداً
        this.container = document.querySelector('.notifications-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'notifications-container';
            document.body.appendChild(this.container);
        }
    }
    
    setupStyles() {
        // إضافة الأنماط إذا لم تكن موجودة
        if (!document.querySelector('#notification-styles')) {
            const link = document.createElement('link');
            link.id = 'notification-styles';
            link.rel = 'stylesheet';
            link.href = 'css/notifications.css';
            document.head.appendChild(link);
        }
    }
    
    show(options = {}) {
        const {
            type = 'info',
            title = '',
            message = '',
            duration = this.defaultDuration,
            autoClose = true,
            actions = []
        } = options;
        
        // إنشاء معرف فريد للإشعار
        const id = this.generateId();
        
        // إنشاء عنصر الإشعار
        const notification = this.createNotificationElement({
            id,
            type,
            title,
            message,
            duration,
            autoClose,
            actions
        });
        
        // إضافة الإشعار للحاوي
        this.container.appendChild(notification);
        this.notifications.set(id, notification);
        
        // إعداد الإغلاق التلقائي
        if (autoClose && duration > 0) {
            setTimeout(() => this.hide(id), duration);
        }
        
        return id;
    }
    
    createNotificationElement({ id, type, title, message, duration, autoClose, actions }) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.setAttribute('data-id', id);
        
        // أيقونة حسب النوع
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">${icons[type] || icons.info}</div>
            <div class="notification-content">
                ${title ? `<div class="notification-title">${title}</div>` : ''}
                ${message ? `<div class="notification-message">${message}</div>` : ''}
                ${actions.length > 0 ? this.createActionsHTML(actions, id) : ''}
            </div>
            <button class="notification-close" onclick="notificationManager.hide('${id}')" 
                    aria-label="${window.t ? window.t('close') : 'إغلاق'}">
                ×
            </button>
            ${autoClose && duration > 0 ? `<div class="notification-progress" style="--notification-duration: ${duration}ms;"></div>` : ''}
        `;
        
        return notification;
    }
    
    createActionsHTML(actions, notificationId) {
        const actionsHTML = actions.map(action => 
            `<button class="btn btn-sm btn-outline" 
                     onclick="notificationManager.handleAction('${notificationId}', '${action.id}', ${action.callback})"
                     style="margin-top: var(--spacing-sm);">
                ${action.text}
            </button>`
        ).join(' ');
        
        return `<div class="notification-actions">${actionsHTML}</div>`;
    }
    
    handleAction(notificationId, actionId, callback) {
        if (typeof callback === 'function') {
            callback();
        }
        this.hide(notificationId);
    }
    
    hide(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;
        
        notification.style.animation = 'slideOutNotification 0.3s ease-in forwards';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications.delete(id);
        }, 300);
    }
    
    hideAll() {
        this.notifications.forEach((_, id) => this.hide(id));
    }
    
    generateId() {
        return 'notification-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
    
    // طرق مختصرة لأنواع الإشعارات المختلفة
    success(message, title = '', options = {}) {
        return this.show({
            type: 'success',
            title: title || (window.t ? window.t('success') : 'نجح'),
            message,
            ...options
        });
    }
    
    error(message, title = '', options = {}) {
        return this.show({
            type: 'error',
            title: title || (window.t ? window.t('error') : 'خطأ'),
            message,
            duration: 7000, // مدة أطول للأخطاء
            ...options
        });
    }
    
    warning(message, title = '', options = {}) {
        return this.show({
            type: 'warning',
            title: title || (window.t ? window.t('warning') : 'تحذير'),
            message,
            ...options
        });
    }
    
    info(message, title = '', options = {}) {
        return this.show({
            type: 'info',
            title: title || (window.t ? window.t('info') : 'معلومات'),
            message,
            ...options
        });
    }
}

// إنشاء مثيل عام للاستخدام
const notificationManager = new NotificationManager();

// إضافة للكائن العام window للوصول من أي مكان
window.notificationManager = notificationManager;
