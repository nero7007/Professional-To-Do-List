# Professional Bilingual To-Do List Application

![Status](https://img.shields.io/badge/status-active-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![Responsive](https://img.shields.io/badge/design-responsive-brightgreen)

A comprehensive, professional-grade to-do list application with full bilingual support (Arabic/English) and complete user authentication system. Built with vanilla HTML, CSS, and JavaScript using localStorage.

---

## 🌟 **Features**

### 📱 **Pages & Navigation**
- **Login Page:** Secure user authentication with validation
- **Register Page:** Complete user registration with email verification  
- **Account Verification:** Email verification with 6-digit codes
- **Password Reset:** Full password recovery system
- **Main Dashboard:** Professional note-taking interface with school paper design
- **Drafts Manager:** Comprehensive note management with search, filter, and bulk operations

### 🔐 **Authentication System**
- Complete user registration with validation
- Email verification system
- Password reset functionality  
- Secure session management
- Auto-logout and session persistence
- Form validation with real-time feedback

### ✍️ **Note-Taking Features**
- **School Paper Interface:** Lined paper background with disappearing lines
- **Rich Text Input:** Title and content fields with character/word counting
- **Auto-Save:** Automatic draft saving while typing
- **Preview Mode:** Full note preview with print functionality
- **Character Counter:** Real-time character and word count
- **Note Statistics:** Dashboard with total, completed, pending, and today's notes

### 📄 **Note Management**
- View, edit, and delete notes
- Search & filter by title/content, status, date
- Sort by date, title, completion status  
- Pagination for large collections
- Bulk operations (select multiple notes)
- Completion tracking (checkboxes)

### ⏰ **Reminder System**
- Set date/time reminders for notes
- Native browser notifications
- Alarm management (schedule, manage)

### 🌍 **Bilingual Support**
- Arabic & English: Complete translation system
- RTL support for Arabic
- Instant language toggle
- Localized date formatting
- Persistent language selection

### 🎨 **Professional Design**
- Blue gradient palette
- Dark/Light themes with persistence
- Responsive (desktop, tablet, mobile)
- Modern UI, smooth animations
- Segoe UI font

### 🛠️ **Technical Features**
- Pure Vanilla JS (no frameworks)
- localStorage database
- Client-side validation
- Error handling and loading states
- Accessibility: ARIA labels, keyboard navigation

---

## 🚀 **Quick Start**

```shell
# 1. Open the Application
Open 'login.html' in your browser
# or deploy to any web server

# 2. Create an Account
Click "Create New Account" and fill details:
- First/Last Name: 3-15 letters, auto-capitalized
- Email: Valid format
- Phone: Country code required (e.g. +1234567890)
- Password: 8-15 chars, upper/lower/numbers/special

# 3. Verify Your Account
Enter any 6-digit code (demo mode)

# 4. Login & Start Using
Login and start creating/managing notes!
```

---

## 📋 **Validation Requirements**

| Field        | Requirement               | Details/Examples               |
|--------------|---------------------------|-------------------------------|
| Name         | 3-15 letters (Ar/En)      | First letter auto-capitalized |
| Email        | Valid format, contains @  | e.g. test@email.com           |
| Phone        | Starts with +, country code| +1234567890, +966123456789    |
| Password     | 8-15 chars, A-Z, a-z, 0-9, @#$%*| Must contain all types        |
| Verification | 6-digit code (numeric)    | Any 6-digit number (demo)     |

---

## 🗂️ **Project Structure**

```text
├── index.html              # Main dashboard page
├── login.html              # User login page  
├── register.html           # User registration page
├── verify-account.html     # Email verification page
├── reset-password.html     # Password reset request page
├── new-password.html       # New password creation page
├── drafts.html             # Notes management page
├── css/
│   ├── styles.css          # Main styles
│   ├── auth.css            # Auth page styles
│   ├── todo.css            # Dashboard styles
│   └── drafts.css          # Drafts styles
└── js/
    ├── translations.js     # Bilingual system
    ├── theme.js            # Theme management
    ├── auth.js             # Authentication
    ├── login.js            # Login logic
    ├── register.js         # Registration logic
    ├── verify-account.js   # Verification logic
    ├── reset-password.js   # Password reset logic  
    ├── new-password.js     # New password logic
    ├── todo.js             # Dashboard logic
    └── drafts.js           # Drafts logic
```

---

## 💾 **Data Storage**

All data is stored in the browser's `localStorage`:

- **Users:** `todo_users` (array)
- **Sessions:** `todo_sessions`
- **Notes:** `todo_notes_{userId}`
- **Alarms:** `todo_alarms_{userId}`  
- **Settings:** `language`, `theme`
- **Temporary:** `todo_pending_verification`, `todo_password_reset`, `todo_draft`

---

## 🔧 **Customization**

- **Colors:** CSS custom properties in `css/styles.css` (`--color-primary-*`, `--color-gray-*`)
- **Typography:** Segoe UI, CSS font variables, supports LTR/RTL
- **Breakpoints:** Desktop (>768px), Tablet (480–768px), Mobile (<480px)

---

## 🌐 **Browser Support**

| Browser     | Version     | Notes           |
|-------------|-------------|-----------------|
| Chrome      | 70+         | Recommended     |
| Firefox     | 65+         |                 |
| Safari      | 12+         |                 |
| Edge        | 79+         |                 |
| IE          | 11          | Limited support |

---

## 🔒 **Security Features**

- Basic password hashing (demo)
- Session expiration
- Input validation & sanitization
- XSS prevention (escaping)
- CSRF protection (same-origin)

---

## 🐛 **Known Limitations**

- **Demo Mode:** Verification codes accept any 6-digit number
- **Local Storage Only:** Data not synced across devices
- **Offline Only:** No server backup/sync
- **Basic Hashing:** Simplified for demo purposes

---

## 🚀 **Future Enhancements**

- Server-side API integration
- Real email verification
- Cloud sync
- Advanced text formatting
- File attachments
- Collaboration
- Export/import
- Advanced search & filters

---

## 📱 **Mobile Experience**

- Fully responsive design
- Touch-friendly buttons (min 44px)
- Swipe gestures for notes
- Mobile-optimized forms/inputs
- Responsive navigation

---

## 🎯 **Use Cases**

- Personal & professional task management
- Team project planning
- Study notes
- Meeting minutes
- Daily journaling
- Goal tracking
- Reminders

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**

_For support or questions, refer to the code comments and documentation within each file._
