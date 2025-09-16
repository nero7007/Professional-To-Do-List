// To-Do List Main Page JavaScript
class TodoManager {
    constructor() {
        this.currentUser = null;
        this.notes = [];
        this.alarms = [];
        this.init();
    }
    
    init() {
        // Check authentication
        if (!window.authSystem.requireAuth()) {
            return;
        }
        
        this.currentUser = window.authSystem.getCurrentUser();
        this.loadUserData();
        this.setupEventListeners();
        this.updateUserInfo();
        this.updateStats();
        this.initializePaper();
        
        // Auto-save functionality
        this.setupAutoSave();
    }
    
    loadUserData() {
        const userNotesKey = `todo_notes_${this.currentUser.id}`;
        const userAlarmsKey = `todo_alarms_${this.currentUser.id}`;
        
        this.notes = JSON.parse(localStorage.getItem(userNotesKey) || '[]');
        this.alarms = JSON.parse(localStorage.getItem(userAlarmsKey) || '[]');
    }
    
    saveUserData() {
        const userNotesKey = `todo_notes_${this.currentUser.id}`;
        const userAlarmsKey = `todo_alarms_${this.currentUser.id}`;
        
        localStorage.setItem(userNotesKey, JSON.stringify(this.notes));
        localStorage.setItem(userAlarmsKey, JSON.stringify(this.alarms));
    }
    
    updateUserInfo() {
        const userNameElement = document.getElementById('currentUserName');
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        }
    }
    
    updateStats() {
        const today = new Date().toDateString();
        
        const totalNotes = this.notes.length;
        const completedNotes = this.notes.filter(note => note.completed).length;
        const pendingNotes = totalNotes - completedNotes;
        const todayNotes = this.notes.filter(note => 
            new Date(note.createdAt).toDateString() === today
        ).length;
        
        document.getElementById('totalNotes').textContent = window.translationSystem.formatNumber(totalNotes);
        document.getElementById('completedNotes').textContent = window.translationSystem.formatNumber(completedNotes);
        document.getElementById('pendingNotes').textContent = window.translationSystem.formatNumber(pendingNotes);
        document.getElementById('todayNotes').textContent = window.translationSystem.formatNumber(todayNotes);
    }
    
    initializePaper() {
        const paperLines = document.getElementById('paperLines');
        const textarea = document.getElementById('noteContent');
        
        // Create lined paper effect
        this.createPaperLines();
        
        // Handle text input to create disappearing line effect
        textarea.addEventListener('input', () => {
            this.updatePaperLines();
            this.updateCharCount();
        });
        
        textarea.addEventListener('scroll', () => {
            this.syncPaperScroll();
        });
    }
    
    createPaperLines() {
        const paperLines = document.getElementById('paperLines');
        const lineHeight = 26; // Match CSS line-height
        const numberOfLines = 20; // Initial number of lines
        
        paperLines.innerHTML = '';
        
        for (let i = 0; i < numberOfLines; i++) {
            const line = document.createElement('div');
            line.className = 'paper-line';
            line.style.cssText = `
                position: absolute;
                left: 0;
                right: 0;
                height: 2px;
                background-color: var(--color-primary-lighter);
                opacity: 0.3;
                top: ${(i + 1) * lineHeight}px;
                transition: opacity 0.2s ease;
            `;
            paperLines.appendChild(line);
        }
    }
    
    updatePaperLines() {
        // This is a simplified version - in a real implementation,
        // you would calculate which characters overlap with lines
        const textarea = document.getElementById('noteContent');
        const text = textarea.value;
        const lines = text.split('\n');
        
        // Fade lines that have text over them
        const paperLineElements = document.querySelectorAll('.paper-line');
        paperLineElements.forEach((line, index) => {
            if (index < lines.length && lines[index].trim()) {
                line.style.opacity = '0.1';
            } else {
                line.style.opacity = '0.3';
            }
        });
    }
    
    syncPaperScroll() {
        const textarea = document.getElementById('noteContent');
        const paperLines = document.getElementById('paperLines');
        paperLines.scrollTop = textarea.scrollTop;
    }
    
    updateCharCount() {
        const textarea = document.getElementById('noteContent');
        const charCount = document.getElementById('charCount');
        const wordCount = document.getElementById('wordCount');
        
        const text = textarea.value;
        const chars = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        
        charCount.textContent = window.translationSystem.formatNumber(chars);
        wordCount.textContent = window.translationSystem.formatNumber(words);
    }
    
    setupEventListeners() {
        // Navigation buttons
        document.getElementById('createNoteBtn').addEventListener('click', () => {
            this.clearCurrentNote();
        });
        
        document.getElementById('saveNotesBtn').addEventListener('click', () => {
            this.saveCurrentNote();
        });
        
        document.getElementById('setAlarmBtn').addEventListener('click', () => {
            this.openAlarmModal();
        });
        
        document.getElementById('draftsBtn').addEventListener('click', () => {
            window.location.href = 'drafts.html';
        });
        
        // Note actions
        document.getElementById('saveCurrentNote').addEventListener('click', () => {
            this.saveCurrentNote();
        });
        
        document.getElementById('clearNote').addEventListener('click', () => {
            this.clearCurrentNote();
        });
        
        document.getElementById('previewNote').addEventListener('click', () => {
            this.previewCurrentNote();
        });
        
        // Alarm modal
        document.getElementById('setAlarm').addEventListener('click', () => {
            this.setAlarm();
        });
        
        // Title input character counter
        document.getElementById('noteTitle').addEventListener('input', () => {
            this.updateTitleCounter();
        });
    }
    
    clearCurrentNote() {
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
        this.updateCharCount();
        this.updatePaperLines();
        this.updateSaveStatus('');
        
        // Focus on title
        document.getElementById('noteTitle').focus();
        
        showMessage(window.t('note_cleared') || 'Note cleared', 'info');
    }
    
    saveCurrentNote() {
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();
        
        if (!title && !content) {
            showMessage('Please add a title or content before saving', 'warning');
            return;
        }
        
        const note = {
            id: this.generateId(),
            title: title || 'Untitled Note',
            content: content,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: this.currentUser.id
        };
        
        this.notes.unshift(note); // Add to beginning
        this.saveUserData();
        this.updateStats();
        this.updateSaveStatus('saved');
        
        showMessage(window.t('note_saved'), 'success');
        
        // Clear form after saving
        setTimeout(() => {
            this.clearCurrentNote();
        }, 1000);
    }
    
    previewCurrentNote() {
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();
        
        if (!title && !content) {
            showMessage('Nothing to preview', 'warning');
            return;
        }
        
        document.getElementById('previewTitle').textContent = title || 'Untitled Note';
        document.getElementById('previewText').textContent = content || 'No content';
        
        document.getElementById('previewModal').classList.remove('d-none');
    }
    
    openAlarmModal() {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
        
        document.getElementById('alarmDate').value = today;
        document.getElementById('alarmTime').value = currentTime;
        document.getElementById('alarmTitle').value = '';
        
        document.getElementById('alarmModal').classList.remove('d-none');
    }
    
    setAlarm() {
        const title = document.getElementById('alarmTitle').value.trim();
        const date = document.getElementById('alarmDate').value;
        const time = document.getElementById('alarmTime').value;
        
        if (!title) {
            showMessage('Please enter alarm title', 'warning');
            return;
        }
        
        if (!date || !time) {
            showMessage('Please select date and time', 'warning');
            return;
        }
        
        const alarmDateTime = new Date(`${date}T${time}`);
        const now = new Date();
        
        if (alarmDateTime <= now) {
            showMessage('Please select a future date and time', 'warning');
            return;
        }
        
        const alarm = {
            id: this.generateId(),
            title: title,
            dateTime: alarmDateTime.toISOString(),
            isActive: true,
            createdAt: new Date().toISOString(),
            userId: this.currentUser.id
        };
        
        this.alarms.push(alarm);
        this.saveUserData();
        
        // Set browser notification (if supported)
        this.scheduleNotification(alarm);
        
        this.closeAlarmModal();
        showMessage('Alarm set successfully', 'success');
    }
    
    scheduleNotification(alarm) {
        if ('Notification' in window) {
            // Request permission if needed
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
            
            if (Notification.permission === 'granted') {
                const now = new Date();
                const alarmTime = new Date(alarm.dateTime);
                const timeUntilAlarm = alarmTime.getTime() - now.getTime();
                
                if (timeUntilAlarm > 0) {
                    setTimeout(() => {
                        new Notification('To-Do Reminder', {
                            body: alarm.title,
                            icon: '/favicon.ico',
                            tag: alarm.id
                        });
                    }, timeUntilAlarm);
                }
            }
        }
    }
    
    updateSaveStatus(status) {
        const saveStatusElement = document.getElementById('saveStatus');
        
        switch (status) {
            case 'saved':
                saveStatusElement.textContent = 'Saved ✓';
                saveStatusElement.className = 'save-status saved';
                break;
            case 'saving':
                saveStatusElement.textContent = 'Saving...';
                saveStatusElement.className = 'save-status saving';
                break;
            case 'error':
                saveStatusElement.textContent = 'Error saving';
                saveStatusElement.className = 'save-status error';
                break;
            default:
                saveStatusElement.textContent = '';
                saveStatusElement.className = 'save-status';
        }
    }
    
    updateTitleCounter() {
        const titleInput = document.getElementById('noteTitle');
        const maxLength = 100;
        const currentLength = titleInput.value.length;
        
        // Visual feedback for character limit
        if (currentLength > maxLength * 0.9) {
            titleInput.style.borderColor = 'var(--warning-color)';
        } else {
            titleInput.style.borderColor = '';
        }
    }
    
    setupAutoSave() {
        let autoSaveTimeout;
        const titleInput = document.getElementById('noteTitle');
        const contentInput = document.getElementById('noteContent');
        
        function scheduleAutoSave() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                const title = titleInput.value.trim();
                const content = contentInput.value.trim();
                
                if (title || content) {
                    // Auto-save to draft
                    this.updateSaveStatus('saving');
                    localStorage.setItem('todo_draft', JSON.stringify({
                        title,
                        content,
                        timestamp: Date.now()
                    }));
                    
                    setTimeout(() => {
                        this.updateSaveStatus('');
                    }, 1000);
                }
            }, 2000);
        }
        
        titleInput.addEventListener('input', scheduleAutoSave.bind(this));
        contentInput.addEventListener('input', scheduleAutoSave.bind(this));
        
        // Load draft on page load
        const draft = JSON.parse(localStorage.getItem('todo_draft') || '{}');
        if (draft.title || draft.content) {
            titleInput.value = draft.title || '';
            contentInput.value = draft.content || '';
            this.updateCharCount();
            this.updatePaperLines();
        }
    }
    
    generateId() {
        return 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    closeAlarmModal() {
        document.getElementById('alarmModal').classList.add('d-none');
    }
    
    closePreviewModal() {
        document.getElementById('previewModal').classList.add('d-none');
    }
    
    printPreview() {
        const title = document.getElementById('previewTitle').textContent;
        const content = document.getElementById('previewText').textContent;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Note - ${title}</title>
                    <style>
                        body { font-family: 'Segoe UI', sans-serif; margin: 40px; }
                        h1 { color: #2563eb; margin-bottom: 20px; }
                        .content { white-space: pre-wrap; line-height: 1.6; }
                        .footer { margin-top: 40px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    <div class="content">${content}</div>
                    <div class="footer">
                        Printed on ${new Date().toLocaleString()} | Professional To-Do List
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    }
}

// Modal control functions
function closeAlarmModal() {
    document.getElementById('alarmModal').classList.add('d-none');
}

function closePreviewModal() {
    document.getElementById('previewModal').classList.add('d-none');
}

function printPreview() {
    if (window.todoManager) {
        window.todoManager.printPreview();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.todoManager = new TodoManager();
});