
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface IconButton {
  className?: string,
  icon: any,
  alt?: string
  active?: boolean
}

export default function ButtonIcon(props: IconButton) {
  const { className, icon, alt, active = false } = props;
  return (
    <Button className={
      cn(`bg-white hover:opacity-75 hover:bg-white text-secondary p-[12px] ${active ? "border border-solid border-primary shadow-2xl" : "'"}`, className)
    }
      variant="default" size={null}>
      <Image src={icon} alt={alt || ""} />
    </Button>
  )
}