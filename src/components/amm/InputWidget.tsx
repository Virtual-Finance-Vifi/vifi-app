import UnifiedInput from "../UnifiedValueInput";

interface InputComponentProps {
  label: string;
  value: number;
  setValue: (value: number) => void;
  type: string;
}

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  value,
  setValue,
  type,
}) => {
  return (
    <UnifiedInput label={label} value={value} setValue={setValue} type={type}/>
  );
};

export default InputComponent;
