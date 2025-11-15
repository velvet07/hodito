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
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium whitespace-nowrap label-text flex-1 pr-2 text-right">
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
          className={`input input-bordered input-sm text-xs ${
            disabled ? 'input-disabled' : ''
          }`}
          style={{ width: '62px', minWidth: '62px' }}
        />
        <span className="text-xs text-base-content/50 text-left min-w-[4ch]">
          {formatPercent(percent, 100)}
        </span>
      </div>
    </div>
  );
};

