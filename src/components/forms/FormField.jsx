function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  hint,
  options,
  inputMode,
  step,
  min,
  max,
}) {
  const hasOptions = Array.isArray(options) && options.length > 0

  return (
    <label htmlFor={id} className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {hasOptions ? (
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={[
            'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition',
            error
              ? 'border-rose-300 ring-2 ring-rose-100'
              : 'border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200',
          ].join(' ')}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          step={step}
          min={min}
          max={max}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={[
            'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition',
            error
              ? 'border-rose-300 ring-2 ring-rose-100'
              : 'border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200',
          ].join(' ')}
        />
      )}
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-slate-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-rose-700">
          {error}
        </p>
      ) : null}
    </label>
  )
}

export default FormField
