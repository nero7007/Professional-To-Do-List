// Drafts Page JavaScript
class DraftsManager {
    constructor() {
        this.currentUser = null;
        this.notes = [];
        this.filteredNotes = [];
        this.selectedNotes = new Set();
        this.currentPage = 1;
        this.notesPerPage = 12;
        this.currentEditingNote = null;
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
        this.renderNotes();
    }
    
    loadUserData() {
        const userNotesKey = `todo_notes_${this.currentUser.id}`;
        this.notes = JSON.parse(localStorage.getItem(userNotesKey) || '[]');
        this.filteredNotes = [...this.notes];
    }
    
    saveUserData() {
        const userNotesKey = `todo_notes_${this.currentUser.id}`;
        localStorage.setItem(userNotesKey, JSON.stringify(this.notes));
    }
    
    setupEventListeners() {
        // Search and filter
        document.getElementById('searchNotes').addEventListener('input', () => {
            this.handleSearch();
        });
        
        document.getElementById('filterNotes').addEventListener('change', () => {
            this.handleFilter();
        });
        
        document.getElementById('sortNotes').addEventListener('change', () => {
            this.handleSort();
        });
        
        // Bulk actions
        document.getElementById('selectAllBtn').addEventListener('click', () => {
            this.toggleSelectAll();
        });
        
        document.getElementById('deleteSelectedBtn').addEventListener('click', () => {
            this.deleteSelectedNotes();
        });
        
        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => {
            this.goToPage(this.currentPage - 1);
        });
        
        document.getElementById('nextPage').addEventListener('click', () => {
            this.goToPage(this.currentPage + 1);
        });
        
        // Modal actions
        document.getElementById('saveEditedNote').addEventListener('click', () => {
            this.saveEditedNote();
        });
        
        document.getElementById('confirmDelete').addEventListener('click', () => {
            this.confirmDeleteNote();
        });
    }
    
    handleSearch() {
        const searchTerm = document.getElementById('searchNotes').value.toLowerCase().trim();
        
        if (searchTerm) {
            this.filteredNotes = this.notes.filter(note =>
                note.title.toLowerCase().includes(searchTerm) ||
                note.content.toLowerCase().includes(searchTerm)
            );
        } else {
            this.filteredNotes = [...this.notes];
        }
        
        this.handleFilter();
    }
    
    handleFilter() {
        const filterValue = document.getElementById('filterNotes').value;
        const searchTerm = document.getElementById('searchNotes').value.toLowerCase().trim();
        
        let filtered = searchTerm ? 
            this.notes.filter(note =>
                note.title.toLowerCase().includes(searchTerm) ||
                note.content.toLowerCase().includes(searchTerm)
            ) : [...this.notes];
        
        switch (filterValue) {
            case 'completed':
                filtered = filtered.filter(note => note.completed);
                break;
            case 'pending':
                filtered = filtered.filter(note => !note.completed);
                break;
            case 'today':
                const today = new Date().toDateString();
                filtered = filtered.filter(note => 
                    new Date(note.createdAt).toDateString() === today
                );
                break;
            case 'week':
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                filtered = filtered.filter(note => 
                    new Date(note.createdAt) >= weekAgo
                );
                break;
        }
        
        this.filteredNotes = filtered;
        this.handleSort();
    }
    
    handleSort() {
        const sortValue = document.getElementById('sortNotes').value;
        
        switch (sortValue) {
            case 'newest':
                this.filteredNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                this.filteredNotes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'title':
                this.filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'completed':
                this.filteredNotes.sort((a, b) => b.completed - a.completed);
                break;
        }
        
        this.currentPage = 1;
        this.selectedNotes.clear();
        this.renderNotes();
    }
    
    renderNotes() {
        const container = document.getElementById('notesGrid');
        const emptyState = document.getElementById('emptyState');
        const paginationSection = document.getElementById('paginationSection');
        
        if (this.filteredNotes.length === 0) {
            container.innerHTML = '';
            emptyState.classList.remove('d-none');
            paginationSection.classList.add('d-none');
            return;
        }
        
        emptyState.classList.add('d-none');
        
        // Calculate pagination
        const totalPages = Math.ceil(this.filteredNotes.length / this.notesPerPage);
        const startIndex = (this.currentPage - 1) * this.notesPerPage;
        const endIndex = Math.min(startIndex + this.notesPerPage, this.filteredNotes.length);
        const currentNotes = this.filteredNotes.slice(startIndex, endIndex);
        
        // Render notes
        container.innerHTML = currentNotes.map(note => this.renderNoteCard(note)).join('');
        
        // Setup note card event listeners
        this.setupNoteCardListeners();
        
        // Update pagination
        this.updatePagination(totalPages);
    }
    
    renderNoteCard(note) {
        const createdDate = window.translationSystem.formatDate(new Date(note.createdAt));
        const statusClass = note.completed ? 'completed' : 'pending';
        const statusText = note.completed ? 
            (window.translationSystem.getCurrentLanguage() === 'ar' ? 'مكتملة' : 'Completed') :
            (window.translationSystem.getCurrentLanguage() === 'ar' ? 'معلقة' : 'Pending');
        
        const truncatedContent = note.content.length > 150 ? 
            note.content.substring(0, 150) + '...' : note.content;
        
        return `
            <div class="note-card" data-note-id="${note.id}">
                <input type="checkbox" class="note-checkbox" data-note-id="${note.id}">
                
                <div class="note-card-header">
                    <div class="note-meta">
                        <span class="note-date">${createdDate}</span>
                        <span class="note-status ${statusClass}">${statusText}</span>
                    </div>
                </div>
                
                <h3 class="note-title">${this.escapeHtml(note.title)}</h3>
                
                <div class="note-preview">${this.escapeHtml(truncatedContent)}</div>
                
                <div class="note-actions">
                    <button class="note-action-btn view" data-note-id="${note.id}">
                        ${window.translationSystem.getCurrentLanguage() === 'ar' ? '👁️ عرض' : '👁️ View'}
                    </button>
                    <button class="note-action-btn edit" data-note-id="${note.id}">
                        ${window.translationSystem.getCurrentLanguage() === 'ar' ? '✏️ تحرير' : '✏️ Edit'}
                    </button>
                    <button class="note-action-btn complete" data-note-id="${note.id}">
                        ${note.completed ? '↩️' : '✅'}
                    </button>
                    <button class="note-action-btn delete" data-note-id="${note.id}">
                        ${window.translationSystem.getCurrentLanguage() === 'ar' ? '🗑️ حذف' : '🗑️ Delete'}
                    </button>
                </div>
            </div>
        `;
    }
    
    setupNoteCardListeners() {
        // Checkbox selection
        document.querySelectorAll('.note-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                const noteId = checkbox.dataset.noteId;
                const noteCard = checkbox.closest('.note-card');
                
                if (checkbox.checked) {
                    this.selectedNotes.add(noteId);
                    noteCard.classList.add('selected');
                } else {
                    this.selectedNotes.delete(noteId);
                    noteCard.classList.remove('selected');
                }
                
                this.updateBulkActionButtons();
            });
        });
        
        // Action buttons
        document.querySelectorAll('.note-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const noteId = btn.dataset.noteId;
                const action = btn.classList[1]; // get action class
                
                switch (action) {
                    case 'view':
                        this.viewNote(noteId);
                        break;
                    case 'edit':
                        this.editNote(noteId);
                        break;
                    case 'complete':
                        this.toggleNoteComplete(noteId);
                        break;
                    case 'delete':
                        this.deleteNote(noteId);
                        break;
                }
            });
        });
        
        // Card click to view
        document.querySelectorAll('.note-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.note-checkbox') && !e.target.closest('.note-actions')) {
                    const noteId = card.dataset.noteId;
                    this.viewNote(noteId);
                }
            });
        });
    }
    
    viewNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;
        
        const createdDate = window.translationSystem.formatDate(new Date(note.createdAt));
        const statusText = note.completed ? 
            (window.translationSystem.getCurrentLanguage() === 'ar' ? 'مكتملة' : 'Completed') :
            (window.translationSystem.getCurrentLanguage() === 'ar' ? 'معلقة' : 'Pending');
        
        document.getElementById('viewNoteDate').textContent = createdDate;
        document.getElementById('viewNoteStatus').textContent = statusText;
        document.getElementById('viewNoteStatus').className = `note-status ${note.completed ? 'completed' : 'pending'}`;
        document.getElementById('viewNoteTitle').textContent = note.title;
        document.getElementById('viewNoteContent').textContent = note.content;
        
        // Store current note for actions
        this.currentEditingNote = note;
        
        document.getElementById('viewModal').classList.remove('d-none');
    }
    
    editNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;
        
        this.currentEditingNote = note;
        
        document.getElementById('editNoteTitle').value = note.title;
        document.getElementById('editNoteContent').value = note.content;
        document.getElementById('editNoteCompleted').checked = note.completed;
        
        document.getElementById('editModal').classList.remove('d-none');
    }
    
    saveEditedNote() {
        if (!this.currentEditingNote) return;
        
        const title = document.getElementById('editNoteTitle').value.trim();
        const content = document.getElementById('editNoteContent').value.trim();
        const completed = document.getElementById('editNoteCompleted').checked;
        
        if (!title && !content) {
            showMessage('Please add a title or content', 'warning');
            return;
        }
        
        // Update note
        const noteIndex = this.notes.findIndex(n => n.id === this.currentEditingNote.id);
        if (noteIndex !== -1) {
            this.notes[noteIndex] = {
                ...this.notes[noteIndex],
                title: title || 'Untitled Note',
                content: content,
                completed: completed,
                updatedAt: new Date().toISOString()
            };
            
            this.saveUserData();
            this.loadUserData();
            this.handleSort();
            
            showMessage(window.t('note_saved'), 'success');
            this.closeEditModal();
        }
    }
    
    toggleNoteComplete(noteId) {
        const noteIndex = this.notes.findIndex(n => n.id === noteId);
        if (noteIndex !== -1) {
            this.notes[noteIndex].completed = !this.notes[noteIndex].completed;
            this.notes[noteIndex].updatedAt = new Date().toISOString();
            
            this.saveUserData();
            this.loadUserData();
            this.handleSort();
            
            const status = this.notes[noteIndex].completed ? 'completed' : 'pending';
            showMessage(`Note marked as ${status}`, 'success');
        }
    }
    
    deleteNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;
        
        // Show delete confirmation
        document.getElementById('deleteNotePreview').innerHTML = `
            <h5>${this.escapeHtml(note.title)}</h5>
            <p>${this.escapeHtml(note.content.substring(0, 100))}${note.content.length > 100 ? '...' : ''}</p>
        `;
        
        this.currentEditingNote = note;
        document.getElementById('deleteModal').classList.remove('d-none');
    }
    
    confirmDeleteNote() {
        if (!this.currentEditingNote) return;
        
        this.notes = this.notes.filter(n => n.id !== this.currentEditingNote.id);
        this.selectedNotes.delete(this.currentEditingNote.id);
        
        this.saveUserData();
        this.loadUserData();
        this.handleSort();
        
        showMessage(window.t('note_deleted'), 'success');
        this.closeDeleteModal();
    }
    
    toggleSelectAll() {
        const visibleNotes = this.filteredNotes.slice(
            (this.currentPage - 1) * this.notesPerPage,
            this.currentPage * this.notesPerPage
        );
        
        const allSelected = visibleNotes.every(note => this.selectedNotes.has(note.id));
        
        if (allSelected) {
            // Deselect all
            visibleNotes.forEach(note => this.selectedNotes.delete(note.id));
        } else {
            // Select all
            visibleNotes.forEach(note => this.selectedNotes.add(note.id));
        }
        
        this.renderNotes();
    }
    
    deleteSelectedNotes() {
        if (this.selectedNotes.size === 0) {
            showMessage('No notes selected', 'warning');
            return;
        }
        
        const confirmDelete = confirm(`Are you sure you want to delete ${this.selectedNotes.size} selected notes?`);
        if (confirmDelete) {
            this.notes = this.notes.filter(note => !this.selectedNotes.has(note.id));
            this.selectedNotes.clear();
            
            this.saveUserData();
            this.loadUserData();
            this.handleSort();
            
            showMessage('Selected notes deleted successfully', 'success');
        }
    }
    
    updateBulkActionButtons() {
        const selectAllBtn = document.getElementById('selectAllBtn');
        const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
        
        const hasSelection = this.selectedNotes.size > 0;
        deleteSelectedBtn.disabled = !hasSelection;
        
        const visibleNotes = this.filteredNotes.slice(
            (this.currentPage - 1) * this.notesPerPage,
            this.currentPage * this.notesPerPage
        );
        
        const allSelected = visibleNotes.length > 0 && visibleNotes.every(note => this.selectedNotes.has(note.id));
        selectAllBtn.textContent = allSelected ? 
            (window.translationSystem.getCurrentLanguage() === 'ar' ? 'إلغاء التحديد' : 'Deselect All') :
            (window.translationSystem.getCurrentLanguage() === 'ar' ? 'تحديد الكل' : 'Select All');
    }
    
    updatePagination(totalPages) {
        const paginationSection = document.getElementById('paginationSection');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const currentPageSpan = document.getElementById('currentPage');
        const totalPagesSpan = document.getElementById('totalPages');
        
        if (totalPages <= 1) {
            paginationSection.classList.add('d-none');
            return;
        }
        
        paginationSection.classList.remove('d-none');
        
        prevBtn.disabled = this.currentPage <= 1;
        nextBtn.disabled = this.currentPage >= totalPages;
        
        currentPageSpan.textContent = window.translationSystem.formatNumber(this.currentPage);
        totalPagesSpan.textContent = window.translationSystem.formatNumber(totalPages);
    }
    
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredNotes.length / this.notesPerPage);
        
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderNotes();
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Modal methods
    closeEditModal() {
        document.getElementById('editModal').classList.add('d-none');
        this.currentEditingNote = null;
    }
    
    closeViewModal() {
        document.getElementById('viewModal').classList.add('d-none');
        this.currentEditingNote = null;
    }
    
    closeDeleteModal() {
        document.getElementById('deleteModal').classList.add('d-none');
        this.currentEditingNote = null;
    }
    
    editFromView() {
        if (this.currentEditingNote) {
            this.closeViewModal();
            this.editNote(this.currentEditingNote.id);
        }
    }
    
    printNote() {
        if (!this.currentEditingNote) return;
        
        const note = this.currentEditingNote;
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Note - ${note.title}</title>
                    <style>
                        body { 
                            font-family: 'Segoe UI', sans-serif; 
                            margin: 40px; 
                            direction: ${window.translationSystem.isRTL() ? 'rtl' : 'ltr'};
                        }
                        h1 { color: #2563eb; margin-bottom: 20px; }
                        .meta { color: #666; margin-bottom: 20px; font-size: 14px; }
                        .content { white-space: pre-wrap; line-height: 1.6; }
                        .footer { margin-top: 40px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <h1>${note.title}</h1>
                    <div class="meta">
                        Created: ${window.translationSystem.formatDate(new Date(note.createdAt))} | 
                        Status: ${note.completed ? 'Completed' : 'Pending'}
                    </div>
                    <div class="content">${note.content}</div>
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

// Global functions for modal controls
function closeEditModal() {
    if (window.draftsManager) {
        window.draftsManager.closeEditModal();
    }
}

function closeViewModal() {
    if (window.draftsManager) {
        window.draftsManager.closeViewModal();
    }
}

function closeDeleteModal() {
    if (window.draftsManager) {
        window.draftsManager.closeDeleteModal();
    }
}

function editFromView() {
    if (window.draftsManager) {
        window.draftsManager.editFromView();
    }
}

function printNote() {
    if (window.draftsManager) {
        window.draftsManager.printNote();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.draftsManager = new DraftsManager();
});