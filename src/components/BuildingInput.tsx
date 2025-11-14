import React from 'react';
import { formatPercent } from '../utils/formatters';

interface BuildingInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  percent: number;
  id: string;
}

export const BuildingInput: React.FC<BuildingInputProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  percent,
  id
}) => {
  return (
    <div className="flex items-center justify-between gap-1.5">
      <label className="text-xs font-medium whitespace-nowrap label-text">
        {label}:
      </label>
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          id={id}
          value={value || ''}
          onChange={(e) => {
            const num = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
            onChange(num);
          }}
          disabled={disabled}
          className={`input input-bordered input-sm w-full max-w-[6ch] text-xs ${
            disabled ? 'input-disabled' : ''
          }`}
        />
        <span className="text-xs text-base-content/50 text-right min-w-[3ch]">
          {formatPercent(percent, 100)}
        </span>
      </div>
    </div>
  );
};

