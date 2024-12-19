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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { ChangeEvent } from "react";

interface Props {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onClose: () => void;
}

function AddCommunity({ value, onChange, onSubmit, onClose }: Props) {

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="rounded-full">
          <Plus />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create Community</AlertDialogTitle>
          <AlertDialogDescription className="py-3">
            <Input
              placeholder="Community name"
              value={value}
              onChange={onChange}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onClose()}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onSubmit()}>Submit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AddCommunity;
