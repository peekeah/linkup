import React from "react";
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { LucideProps } from "lucide-react";

type IconButton = {
  className?: string;
  alt?: string;
  icon: string | StaticImport;
  svg?: never;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
} | {
  className?: string;
  alt?: string;
  icon?: never;
  svg?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ButtonIcon(props: IconButton) {
  const { className, icon, alt, active = false, svg: SvgIcon, onClick } = props;
  return (
    <Button
      onClick={onClick}
      className={
        cn(`bg-white hover:opacity-75 hover:bg-white text-secondary p-[12px]`,
          active ? "border border-solid border-primary shadow-2xl" : "",
          SvgIcon ? "h-14 w-14 !p-0 !m-0" : "",
          className)
      }
      variant="default" size={null}>
      {
        icon ? (
          <Image src={icon} alt={alt || ""} />
        ) :
          SvgIcon ? (
            <SvgIcon className="p-0 m-0" />
          ) : null
      }
    </Button >
  )
}
