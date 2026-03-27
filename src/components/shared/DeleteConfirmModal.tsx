'use client';

import { useState } from 'react';
import Modal from '../ui/Modal';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  description?: string;
  itemName?: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item',
  description = 'Are you sure you want to delete this item?',
  itemName = 'this item',
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleConfirm = async () => {
    if (confirmText !== 'DELETE') {
      alert('Please type "DELETE" to confirm');
      return;
    }

    setLoading(true);
    try {
      await onConfirm();
      setConfirmText('');
      onClose();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Description */}
        <div className="text-center">
          <p className="text-wit-muted mb-2">{description}</p>
          <p className="text-sm text-wit-muted">
            This action cannot be undone. This will permanently delete{' '}
            <span className="font-bold text-wit-text">{itemName}</span> and remove all associated data.
          </p>
        </div>

        {/* Confirmation Input */}
        <div>
          <label className="block text-sm font-medium text-wit-muted mb-2">
            Type "DELETE" to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="input-dark w-full"
            placeholder="DELETE"
            disabled={loading}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-wit-border">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || confirmText !== 'DELETE'}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
