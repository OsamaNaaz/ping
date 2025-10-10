import './InputField.css';
export default function InputField({
  inputName = "",
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  className = ""
}) {
  return (
    <div className="input-wrapper">
      <label className='input-label'>{inputName}: </label>
      <div className='input-container'>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input-field ${error ? "input-field-error" : value?.length > 0 ? "input-field-valid" : ""} ${className}`}
        />
        {error && <div className="error-text">{error}</div>}
      </div>
    </div>
  );
}