# Professional Bilingual To-Do List Application

A comprehensive, professional-grade to-do list application with full bilingual support (Arabic/English) and complete user authentication system. Built with vanilla HTML, CSS, and JavaScript using localStorage as the database.

## 🌟 Features

### 📱 Pages & Navigation
- **Login Page** - Secure user authentication with validation
- **Register Page** - Complete user registration with email verification  
- **Account Verification** - Email verification with 6-digit codes
- **Password Reset** - Full password recovery system
- **Main Dashboard** - Professional note-taking interface with school paper design
- **Drafts Manager** - Comprehensive note management with search, filter, and bulk operations

### 🔐 Authentication System
- Complete user registration with validation
- Email verification system
- Password reset functionality  
- Secure session management
- Auto-logout and session persistence
- Form validation with real-time feedback

### ✍️ Note-Taking Features
- **School Paper Interface** - Lined paper background with disappearing lines as you type
- **Rich Text Input** - Title and content fields with character/word counting
- **Auto-Save** - Automatic draft saving while typing
- **Preview Mode** - Full note preview with print functionality
- **Character Counter** - Real-time character and word count
- **Note Statistics** - Dashboard with total, completed, pending, and today's notes

### 📄 Note Management
- **View Notes** - Detailed note viewing with metadata
- **Edit Notes** - Full editing capabilities with completion status
- **Delete Notes** - Individual and bulk delete with confirmation
- **Search & Filter** - Search by title/content, filter by status/date
- **Sorting Options** - Sort by date, title, or completion status  
- **Pagination** - Efficient pagination for large note collections
- **Bulk Operations** - Select multiple notes for bulk actions
- **Completion Tracking** - Mark notes as completed with checkboxes

### ⏰ Reminder System
- **Alarm Setting** - Set date/time reminders for notes
- **Browser Notifications** - Native browser notifications (when supported)
- **Alarm Management** - Schedule and manage multiple reminders

### 🌍 Bilingual Support
- **Arabic & English** - Complete translation system
- **RTL Support** - Proper right-to-left layout for Arabic
- **Dynamic Language Switching** - Instant language toggle
- **Localized Dates** - Date formatting in both languages
- **Persistent Language** - Remembers selected language

### 🎨 Professional Design
- **Blue Color Scheme** - Professional blue gradient palette from light to dark
- **Dark/Light Themes** - Toggle between themes with persistence
- **Responsive Design** - Works on all screen sizes (desktop, tablet, mobile)
- **Modern UI** - Clean, professional interface with smooth animations
- **Segoe UI Font** - Professional typography throughout

### 🛠️ Technical Features
- **Pure Vanilla JS** - No external libraries or frameworks
- **LocalStorage Database** - Complete data persistence without backend
- **Form Validation** - Comprehensive client-side validation
- **Error Handling** - User-friendly error messages and states
- **Loading States** - Professional loading indicators
- **Accessibility** - ARIA labels and keyboard navigation support

## 🚀 Quick Start

1. **Open the Application**
   - Open `login.html` in your web browser
   - Or deploy to any web server and access the login page

2. **Create an Account**
   - Click "Create New Account" on the login page
   - Fill in your details with proper validation:
     - First/Last Name: 3-15 letters only, auto-capitalized
     - Email: Valid email format required
     - Phone: Must include country code (e.g., +1234567890)
     - Password: 8-15 characters with uppercase, lowercase, numbers, and special characters (@#$%*)

3. **Verify Your Account**
   - Enter any 6-digit code for verification (demo mode)
   - You'll be redirected to the login page

4. **Login & Start Using**
   - Login with your credentials
   - Start creating notes with the professional interface
   - Use all the management features in the drafts section

## 📋 Validation Requirements

### Names (First/Last)
- Minimum 3 characters, maximum 15 characters
- Letters only (supports Arabic and English)
- First letter automatically capitalized

### Email
- Must contain @ symbol
- Valid email format required

### Phone Number  
- Must start with country code (+)
- Format: +[country_code][number]
- Example: +1234567890, +966123456789

### Password
- 8-15 characters required
- Must contain:
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)  
  - Numbers (0-9)
  - Special characters (@, #, $, %, *)

### Verification Code
- 6-digit numeric code
- Any 6-digit number accepted in demo mode

## 🗂️ Project Structure

```
├── index.html              # Main dashboard page
├── login.html              # User login page  
├── register.html           # User registration page
├── verify-account.html     # Email verification page
├── reset-password.html     # Password reset request page
├── new-password.html       # New password creation page
├── drafts.html            # Notes management page
├── css/
│   ├── styles.css         # Main CSS with variables and components
│   ├── auth.css          # Authentication pages styles
│   ├── todo.css          # Main dashboard styles
│   └── drafts.css        # Drafts page styles
└── js/
    ├── translations.js    # Bilingual translation system
    ├── theme.js          # Dark/light theme management
    ├── auth.js           # Authentication system
    ├── login.js          # Login page functionality
    ├── register.js       # Registration page functionality
    ├── verify-account.js # Account verification functionality
    ├── reset-password.js # Password reset functionality  
    ├── new-password.js   # New password functionality
    ├── todo.js           # Main dashboard functionality
    └── drafts.js         # Drafts management functionality
```

## 💾 Data Storage

All data is stored in the browser's localStorage:

- **Users**: `todo_users` - Array of user accounts
- **Sessions**: `todo_sessions` - Active user sessions
- **Notes**: `todo_notes_{userId}` - User-specific notes
- **Alarms**: `todo_alarms_{userId}` - User-specific alarms  
- **Settings**: `language`, `theme` - User preferences
- **Temporary**: `todo_pending_verification`, `todo_password_reset`, `todo_draft`

## 🔧 Customization

### Colors
All colors are defined as CSS custom properties in `css/styles.css`:
- Blue palette: `--color-primary-*` (lightest to darkest)
- Gray palette: `--color-gray-*` (lightest to darkest)
- Theme colors automatically switch for dark mode

### Typography
- Primary font: Segoe UI
- All font sizes use CSS custom properties
- Supports both LTR and RTL text direction

### Responsive Breakpoints
- Desktop: > 768px
- Tablet: 480px - 768px  
- Mobile: < 480px

## 🌐 Browser Support

- ✅ Chrome 70+ (recommended)
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+
- ⚠️ IE 11 (limited support)

## 🔒 Security Features

- Password hashing (basic implementation for demo)
- Session management with expiration
- Input validation and sanitization
- XSS prevention through proper escaping
- CSRF protection through same-origin policy

## 🐛 Known Limitations

1. **Demo Mode**: Verification codes accept any 6-digit number
2. **Local Storage**: Data is not synchronized across devices
3. **Offline Only**: No server-side backup or sync
4. **Basic Hashing**: Password hashing is simplified for demo purposes

## 🚀 Future Enhancements

- Server-side API integration
- Real email verification system
- Cloud storage synchronization
- Advanced text formatting
- File attachments
- Collaboration features
- Export/import functionality
- Advanced search with filters

## 📱 Mobile Experience

The application is fully responsive and optimized for mobile devices:
- Touch-friendly button sizes (minimum 44px)
- Swipe gestures for note management
- Mobile-optimized forms and inputs
- Proper viewport handling
- Responsive navigation

## 🎯 Use Cases

- Personal task management
- Professional note-taking
- Team project planning
- Study notes organization
- Meeting minutes
- Daily journaling
- Goal tracking
- Reminder system

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**

For support or questions, please refer to the code comments and documentation within each file.#   P r o f e s s i o n a l - T o - D o - L i s t 
 
 # Professional-To-Do-List
