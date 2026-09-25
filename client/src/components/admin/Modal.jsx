import { useEffect } from "react";

export default function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="admin-modal__scrim" onMouseDown={onClose}>
      <div
        className={`admin-modal ${wide ? "admin-modal--wide" : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="admin-modal__header">
          <h3>{title}</h3>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="admin-modal__body">{children}</div>
      </div>
    </div>
  );
}
