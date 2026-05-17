// Modal.jsx
'use client';

export default function Modal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl text-center">
        {title && <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>}
        <p className="text-zinc-400 text-sm mb-6">{message}</p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-medium rounded-xl transition-colors text-sm"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl transition-colors text-sm"
          >
            ОК
          </button>
        </div>
      </div>
    </div>
  );
}
