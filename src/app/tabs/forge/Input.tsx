import React, { useState, useEffect } from 'react';
import UnifiedInput from '../../../components/UnifiedValueInput';

interface InputComponentProps {
  label: string;
  initialValue: number;  
  onValueChange?: (newValue: number) => void;  
  balance: number;
}

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  initialValue,
  onValueChange,
  balance
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

  return (
    <UnifiedInput label={label} value={value} setValue={setValue} balance={balance}/>
  );
};

export default InputComponent;
