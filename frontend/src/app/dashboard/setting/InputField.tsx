import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEventHandler } from "react";

interface InputField {
  label: string;
  value: string;
  name: string;
}

interface InputElement extends InputField {
  type: "Input";
  onChange: ChangeEventHandler<HTMLInputElement>;
}

interface TextareaElement extends InputField {
  type: "Textarea";
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
}

type InputFieldProps = InputElement | TextareaElement;

const InputField: React.FC<InputFieldProps> = (props) => {

  const { type, label, onChange, ...otherProps } = props;

  return (
    <div className="space-y-1 text-semibold text-md">
      <div>{label}</div>
      {
        type === "Input" ?
          <Input
            onChange={onChange}
            {...otherProps}
          /> :
          <Textarea
            className="h-[100px] resize-none"
            onChange={onChange}
            {...otherProps}
          />
      }
    </div>
  )
}

export default InputField;
