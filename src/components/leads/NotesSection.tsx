'use client';

import { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X,
  User,
  Calendar
} from 'lucide-react';

interface Note {
  id: string;
  content: string;
  author: string;
  created_at: string;
  updated_at?: string;
}

interface NotesSectionProps {
  leadId: string;
}

export default function NotesSection({ leadId }: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Customer is very interested in our solution. They mentioned budget approval in Q2.',
      author: 'Sales Team',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      content: 'Follow-up scheduled for next week. Need to prepare technical proposal.',
      author: 'Admin',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      content: 'Competitor analysis: They are also considering XYZ Corp. Our advantage: better support and local presence.',
      author: 'Sales Team',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      author: 'Current User', // TODO: Get from auth
      created_at: new Date().toISOString(),
    };

    setNotes([note, ...notes]);
    setNewNote('');
    setIsAdding(false);
  };

  const handleEditNote = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = (noteId: string) => {
    if (!editContent.trim()) return;

    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, content: editContent, updated_at: new Date().toISOString() }
        : note
    ));
    setEditingId(null);
    setEditContent('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== noteId));
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return new Date(timestamp).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-3xl">
      {/* Add Note Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-wit-border rounded-xl text-wit-muted hover:text-wit-red hover:border-wit-red/50 transition-all mb-6"
        >
          <Plus className="w-5 h-5" />
          <span>Add Note</span>
        </button>
      )}

      {/* Add Note Form */}
      {isAdding && (
        <div className="glass border border-wit-border rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3 mb-3">
            <div className="p-2 bg-wit-red/10 rounded-lg">
              <MessageSquare className="w-5 h-5 text-wit-red" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-wit-text">Add New Note</p>
              <p className="text-xs text-wit-muted">Share updates or important information</p>
            </div>
          </div>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write your note here..."
            className="w-full px-4 py-3 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red transition-all resize-none"
            rows={4}
          />
          <div className="flex items-center justify-end space-x-2 mt-3">
            <button
              onClick={() => {
                setIsAdding(false);
                setNewNote('');
              }}
              className="px-4 py-2 text-sm text-wit-muted hover:text-wit-text transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNote}
              className="flex items-center space-x-2 px-4 py-2 btn-primary text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Note</span>
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-wit-muted mx-auto mb-4" />
          <p className="text-wit-text font-medium mb-2">No notes yet</p>
          <p className="text-wit-muted text-sm">Add your first note to track important information</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="glass border border-wit-border rounded-xl p-5 hover:border-wit-red/30 transition-all"
            >
              {editingId === note.id ? (
                // Edit Mode
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-4 py-3 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red transition-all resize-none mb-3"
                    rows={4}
                  />
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center space-x-1 px-3 py-1.5 text-sm text-wit-muted hover:text-wit-text transition-all"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={() => handleSaveEdit(note.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 btn-primary text-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-wit-red/10 rounded-lg">
                        <User className="w-4 h-4 text-wit-red" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-wit-text">{note.author}</p>
                        <div className="flex items-center space-x-2 text-xs text-wit-muted">
                          <Calendar className="w-3 h-3" />
                          <span>{formatTimeAgo(note.created_at)}</span>
                          {note.updated_at && (
                            <span className="text-wit-muted">(edited)</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="p-2 text-wit-muted hover:text-wit-red hover:bg-wit-red/10 rounded-lg transition-all"
                        title="Edit note"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-2 text-wit-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-wit-text leading-relaxed whitespace-pre-wrap">{note.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
