import React, { useState, useEffect } from 'react';
import UnifiedInput from '../UnifiedValueInput';

interface InputComponentProps {
  label: string;
  initialValue: number;
  onValueChange?: (newValue: number) => void;
  type: string;
  balance: number;
}

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  initialValue,
  onValueChange,
  type,
  balance,
}) => {
  const [value, setValue] = useState(initialValue);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedValue = localStorage.getItem(label);
      if (savedValue !== null) {
        setValue(parseFloat(savedValue));
      }
    }
    setIsMounted(true);
  }, [label]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(label, value.toString());
      if (onValueChange) {
        onValueChange(value);
      }
    }
  }, [value, label, onValueChange, isMounted]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      setValue(newValue);
    } else {
      setValue(0);
    }
  };

  return (
    <UnifiedInput label={label} value={value} setValue={setValue} type={type} balance={balance}/>
  );
};

export default InputComponent;
