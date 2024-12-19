import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { ChangeEvent, KeyboardEventHandler, ReactNode } from "react";

interface Props {
  title: string;
  placeholder: string;
  value: string;
  triggerButton: ReactNode;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const InputAlert = (props: Props) => {

  const {
    title,
    placeholder,
    value,
    triggerButton,
    onChange,
    onSubmit,
    onClose
  } = props;

  // #FIXME: Submit on enter button.
  const onKeyDown: KeyboardEventHandler = (e) => {
    return;
    if (e.code === "Enter") {
      onSubmit()
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {triggerButton}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="py-3">
            <Input
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onClose()}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onSubmit()}
          >Submit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default InputAlert;
