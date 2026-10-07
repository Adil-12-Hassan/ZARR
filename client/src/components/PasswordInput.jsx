import { useState } from "react";
import "../styles/components/passwordInput.css";

function PasswordInput({ className = "", ...inputProps }) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="password-field">
      <input
        {...inputProps}
        className={`password-field__input ${className}`.trim()}
        type={visible ? "text" : "password"}
      />
      <button
        className="password-field__toggle"
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
      >
        <i className={`fa ${visible ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true" />
      </button>
    </span>
  );
}

export default PasswordInput;
