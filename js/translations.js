// Bilingual Translation System
class TranslationSystem {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = {
            en: {
                // Navigation
                'nav_new_note': '+ New Note',
                'nav_save': '💾 Save',
                'nav_alarm': '⏰ Set Alarm',
                'nav_drafts': '📄 Drafts',
                'nav_logout': '🚪 Logout',

                // Common
                'welcome_back': 'Welcome back!',
                'loading': 'Loading...',
                'save': 'Save',
                'cancel': 'Cancel',
                'close': 'Close',
                'edit': 'Edit',
                'delete': 'Delete',
                'confirm': 'Confirm',
                'success': 'Success',
                'error': 'Error',
                'warning': 'Warning',

                // Authentication
                'login_title': 'Welcome Back',
                'login_subtitle': 'Sign in to your account to continue',
                'email_label': 'Email Address',
                'password_label': 'Password',
                'signin_btn': 'Sign In',
                'forgot_password': 'Forgot your password?',
                'create_account': 'Create New Account',
                'register_title': 'Create New Account',
                'register_subtitle': 'Join us to organize your tasks professionally',
                'first_name': 'First Name',
                'last_name': 'Last Name',
                'phone_number': 'Phone Number',
                'already_account': 'Already have an account?',

                // Validation Messages
                'required_field': 'This field is required',
                'invalid_email': 'Please enter a valid email address',
                'password_min_length': 'Password must be at least 8 characters',
                'password_requirements': 'Password must contain uppercase, lowercase, numbers, and special characters',
                'passwords_not_match': 'Passwords do not match',
                'name_min_length': 'Name must be at least 3 characters',
                'name_max_length': 'Name must not exceed 15 characters',
                'name_letters_only': 'Name must contain only letters',
                'phone_invalid': 'Please enter a valid phone number with country code',
                'code_invalid': 'Please enter a valid 6-digit code',

                // Notes
                'note_title_placeholder': 'Enter note title...',
                'note_content_placeholder': 'Start writing your notes here...',
                'save_note': '💾 Save Note',
                'clear_note': '🗑️ Clear',
                'preview_note': '👁️ Preview',
                'characters': 'Characters:',
                'words': 'Words:',
                'total_notes': 'Total Notes',
                'completed_notes': 'Completed',
                'pending_notes': 'Pending',
                'today_notes': 'Today',

                // Messages
                'login_success': 'Login successful! Welcome back.',
                'login_failed': 'Invalid email or password',
                'register_success': 'Account created successfully! Please verify your email.',
                'register_failed': 'Registration failed. Please try again.',
                'note_saved': 'Note saved successfully',
                'note_deleted': 'Note deleted successfully',
                'verification_sent': 'Verification code sent to your email',
                'password_reset_sent': 'Password reset code sent to your email',

                // ... notifications
                'notification_success': 'Success',
                'notification_error': 'Error',
                'notification_warning': 'Warning',
                'notification_info': 'Information',
                'notification_close': 'Close'
            },
            ar: {
                // Navigation
                'nav_new_note': '+ مهمة جديدة',
                'nav_save': '💾 حفظ',
                'nav_alarm': '⏰ تعيين منبه',
                'nav_drafts': '📄 المسودات',
                'nav_logout': '🚪 تسجيل الخروج',

                // Common
                'welcome_back': 'مرحباً بعودتك!',
                'loading': 'جاري التحميل...',
                'save': 'حفظ',
                'cancel': 'إلغاء',
                'close': 'إغلاق',
                'edit': 'تحرير',
                'delete': 'حذف',
                'confirm': 'تأكيد',
                'success': 'نجح',
                'error': 'خطأ',
                'warning': 'تحذير',

                // Authentication
                'login_title': 'مرحباً بعودتك',
                'login_subtitle': 'قم بتسجيل الدخول إلى حسابك للمتابعة',
                'email_label': 'عنوان البريد الإلكتروني',
                'password_label': 'كلمة المرور',
                'signin_btn': 'تسجيل الدخول',
                'forgot_password': 'نسيت كلمة المرور؟',
                'create_account': 'إنشاء حساب جديد',
                'register_title': 'إنشاء حساب جديد',
                'register_subtitle': 'انضم إلينا لتنظيم مهامك بشكل مهني',
                'first_name': 'الاسم الأول',
                'last_name': 'اسم العائلة',
                'phone_number': 'رقم الهاتف',
                'already_account': 'لديك حساب بالفعل؟',

                // Validation Messages
                'required_field': 'هذا الحقل مطلوب',
                'invalid_email': 'يرجى إدخال عنوان بريد إلكتروني صحيح',
                'password_min_length': 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
                'password_requirements': 'يجب أن تحتوي كلمة المرور على أحرف كبيرة وصغيرة وأرقام ورموز خاصة',
                'passwords_not_match': 'كلمات المرور غير متطابقة',
                'name_min_length': 'يجب أن يكون الاسم 3 أحرف على الأقل',
                'name_max_length': 'يجب ألا يتجاوز الاسم 15 حرف',
                'name_letters_only': 'يجب أن يحتوي الاسم على أحرف فقط',
                'phone_invalid': 'يرجى إدخال رقم هاتف صحيح مع رمز البلد',
                'code_invalid': 'يرجى إدخال رمز صحيح مكون من 6 أرقام',

                // Notes
                'note_title_placeholder': 'أدخل عنوان المهمة...',
                'note_content_placeholder': 'ابدأ في كتابة ملاحظاتك هنا...',
                'save_note': '💾 حفظ المهمة',
                'clear_note': '🗑️ مسح',
                'preview_note': '👁️ معاينة',
                'characters': 'الأحرف:',
                'words': 'الكلمات:',
                'total_notes': 'إجمالي المهام',
                'completed_notes': 'المكتملة',
                'pending_notes': 'المعلقة',
                'today_notes': 'اليوم',

                // Messages
                'login_success': 'تم تسجيل الدخول بنجاح! مرحباً بعودتك.',
                'login_failed': 'بريد إلكتروني أو كلمة مرور غير صحيحة',
                'register_success': 'تم إنشاء الحساب بنجاح! يرجى تأكيد بريدك الإلكتروني.',
                'register_failed': 'فشل في التسجيل. يرجى المحاولة مرة أخرى.',
                'note_saved': 'تم حفظ المهمة بنجاح',
                'note_deleted': 'تم حذف المهمة بنجاح',
                'verification_sent': 'تم إرسال رمز التأكيد إلى بريدك الإلكتروني',
                'password_reset_sent': 'تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',

                // ... الاشعارات
                'notification_success': 'نجح',
                'notification_error': 'خطأ',
                'notification_warning': 'تحذير',
                'notification_info': 'معلومات',
                'notification_close': 'إغلاق'
            }
        };

        this.init();
    }

    init() {
        this.applyLanguage();
        this.setupLanguageToggle();
    }

    t(key) {
        return this.translations[this.currentLanguage][key] || key;
    }

    setLanguage(language) {
        this.currentLanguage = language;
        localStorage.setItem('language', language);
        this.applyLanguage();
    }

    applyLanguage() {
        // Update document attributes
        document.documentElement.lang = this.currentLanguage;
        document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';

        // Update data-en/data-ar elements
        document.querySelectorAll('[data-en][data-ar]').forEach(element => {
            const text = this.currentLanguage === 'ar' ? element.dataset.ar : element.dataset.en;
            if (text) {
                element.textContent = text;
            }
        });

        // Update placeholder attributes
        document.querySelectorAll(`[data-placeholder-${this.currentLanguage}]`).forEach(element => {
            const placeholder = element.dataset[`placeholder${this.currentLanguage.charAt(0).toUpperCase() + this.currentLanguage.slice(1)}`];
            if (placeholder) {
                element.placeholder = placeholder;
            }
        });

        // Update select options
        document.querySelectorAll('option[data-en][data-ar]').forEach(option => {
            const text = this.currentLanguage === 'ar' ? option.dataset.ar : option.dataset.en;
            if (text) {
                option.textContent = text;
            }
        });

        // Update language toggle button
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            const toggleText = languageToggle.querySelector('span');
            if (toggleText) {
                toggleText.textContent = this.currentLanguage === 'ar' ? 'English' : 'عربي';
            }
        }

        // Update page title
        const titleElement = document.querySelector('title[data-en][data-ar]');
        if (titleElement) {
            const title = this.currentLanguage === 'ar' ? titleElement.dataset.ar : titleElement.dataset.en;
            if (title) {
                document.title = title;
            }
        }

        // Apply RTL/LTR specific styles
        this.updateDirection();
    }

    updateDirection() {
        const isRTL = this.currentLanguage === 'ar';

        // Update form inputs for RTL
        document.querySelectorAll('.form-input').forEach(input => {
            if (isRTL) {
                input.style.textAlign = 'right';
            } else {
                input.style.textAlign = 'left';
            }
        });

        // Update navbar for RTL
        const navbar = document.querySelector('.navbar-nav');
        if (navbar && isRTL) {
            navbar.style.flexDirection = 'row-reverse';
        } else if (navbar) {
            navbar.style.flexDirection = 'row';
        }
    }

    setupLanguageToggle() {
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => {
                const newLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
                this.setLanguage(newLanguage);
            });
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    isRTL() {
        return this.currentLanguage === 'ar';
    }

    formatDate(date) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        if (this.currentLanguage === 'ar') {
            return new Intl.DateTimeFormat('ar-EG', options).format(date);
        } else {
            return new Intl.DateTimeFormat('en-US', options).format(date);
        }
    }

    formatNumber(number) {
        if (this.currentLanguage === 'ar') {
            return new Intl.NumberFormat('ar-EG').format(number);
        } else {
            return new Intl.NumberFormat('en-US').format(number);
        }
    }
}

// Initialize translation system
window.translationSystem = new TranslationSystem();

// Expose translation function globally
window.t = (key) => window.translationSystem.t(key);

// إشعار نجاح بسيط
notificationManager.success('تم حفظ المهمة بنجاح');

// إشعار خطأ مع تفاصيل
notificationManager.error('فشل في تحميل البيانات', 'خطأ في الشبكة');

// إشعار مخصص مع إجراءات
notificationManager.show({
    type: 'warning',
    title: 'تأكيد الحذف',
    message: 'هل أنت متأكد من حذف هذه المهمة؟',
    autoClose: false,
    actions: [
        {
            id: 'confirm',
            text: 'تأكيد',
            callback: () => deleteTask()
        },
        {
            id: 'cancel',
            text: 'إلغاء',
            callback: () => console.log('تم الإلغاء')
        }
    ]
});

// إشعار معلومات مع مدة مخصصة
notificationManager.info('جاري تحميل البيانات...', 'انتظر قليلاً', {
    duration: 3000
});
