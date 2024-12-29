import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideProps } from "lucide-react";
import { SvgProps } from "@/assets/settings";

type IconButton = {
  noBorder?: boolean;
  className?: string;
  alt?: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & ({
  icon: React.FC<SvgProps>;
  svg?: never;
} | {
  icon?: never;
  svg: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
})

export default function ButtonIcon(props: IconButton) {
  const {
    noBorder = false,
    className,
    icon: Icon,
    active = true,
    svg: SvgIcon,
    onClick
  } = props;

  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => setHover(false);
  return (
    <Button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={
        cn(
          `bg-white text-secondary p-[12px] hover:bg-white`,
          (active && !noBorder) ? "border border-solid border-primary" : "",
          className
        )
      }
      variant="default" size={null}>
      {Icon ? (
        <Icon
          hover={active ? hover : !hover}
          className={
            cn(
              "!h-8 !w-8 text-secondary",
              className
            )
          } />
      ) : (
        SvgIcon &&
        <SvgIcon
          stroke={(hover) ? "hsl(var(--primary))" : "hsl(var(--accent))"}
          className={
            cn(
              "!h-8 !w-8 !hover:text-accent",
              className
            )}
        />
      )
      }
    </Button >
  )
}
