import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  placeholder: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  darkMode: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  value,
  placeholder,
  error,
  onChange,
  disabled = false,
  darkMode
}) => {
  const inputId = `field-${name}`;
  const errorId = `${inputId}-error`;
  
  return (
    <div className="flex-1">
      <label 
        htmlFor={inputId}
        className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-600'} mb-2`}
      >
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        className={`p-2 border-2 rounded-xl text-black bg-bg w-full ${error ? 'border-red-500' : 'custom-border'}`}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />
      <div className="min-h-[1.25rem] mt-1">
        {error && <p id={errorId} className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default FormField; 