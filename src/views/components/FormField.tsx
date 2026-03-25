import React from "react";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  min?: number;
  max?: number;
  className?: string;
}

export function FormField({
  label,
  name,
  type = "text",
  required,
  placeholder,
  value,
  min,
  max,
  className = "",
}: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={value}
        min={min}
        max={max}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
      />
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  rows?: number;
  minLength?: number;
  maxLength?: number;
}

export function TextAreaField({
  label,
  name,
  required,
  placeholder,
  value,
  rows = 4,
  minLength,
  maxLength,
}: TextAreaFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={value}
        rows={rows}
        minLength={minLength}
        maxLength={maxLength}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
      />
    </div>
  );
}

interface CheckboxGroupProps {
  label: string;
  name: string;
  options: string[];
  selected?: string[];
  columns?: number;
}

export function CheckboxGroup({
  label,
  name,
  options,
  selected = [],
  columns = 2,
}: CheckboxGroupProps) {
  // Always 2 cols on mobile; use columns prop for sm+ screens
  const colClass =
    columns === 3 ? "grid-cols-2 sm:grid-cols-3" :
    columns === 4 ? "grid-cols-2 sm:grid-cols-4" :
    "grid-cols-2";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className={`grid ${colClass} gap-2`}>
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center p-2.5 sm:p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400"
          >
            <input
              type="checkbox"
              name={name}
              value={option}
              defaultChecked={selected.includes(option)}
              className="mr-2 rounded text-blue-600 flex-shrink-0"
            />
            <span className="text-xs sm:text-sm text-gray-700 leading-snug">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
