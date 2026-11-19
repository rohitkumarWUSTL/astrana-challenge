import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({ label, className = "", ...rest }: Props) {
  return (
    <label className="block">
      {label && (
        <span className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </span>
      )}
      <input
        {...rest}
        className={`block w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      />
    </label>
  );
}
