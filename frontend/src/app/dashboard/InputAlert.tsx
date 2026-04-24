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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChangeEvent, KeyboardEventHandler, ReactNode } from "react";

interface Props {
  open: boolean;
  title: string;
  placeholder: string;
  value: string;
  triggerButton: ReactNode;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onClose: () => void;
  showCategorySelect?: boolean;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  categories?: string[];
}

const InputAlert = (props: Props) => {

  const {
    open,
    title,
    placeholder,
    value,
    triggerButton,
    onChange,
    onSubmit,
    onClose,
    showCategorySelect = false,
    selectedCategory = "",
    onCategoryChange,
    categories = []
  } = props;

  const onKeyDown: KeyboardEventHandler = (e) => {
    if (e.code === "Enter") {
      onSubmit()
    }
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        {triggerButton}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3 py-3">
            <Input
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
            />
            {showCategorySelect && (
              <Select
                value={selectedCategory}
                onValueChange={onCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(cat => cat !== "All").map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
