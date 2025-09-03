import React from 'react';

const FormInput = ({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required
          className={`appearance-none block w-full px-3 py-2 border ${
            error ? 'border-red-500' : 'border-violet-700'
          } rounded-md shadow-sm bg-slate-800 placeholder-gray-500 text-white focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm transition-colors`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {error && (
          <p className="mt-2 text-sm text-red-400" id={`${id}-error`}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormInput; 