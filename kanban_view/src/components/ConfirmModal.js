import React from 'react';

function ConfirmModal({ show, onConfirm, onCancel, message }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p>{message}</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-md">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
