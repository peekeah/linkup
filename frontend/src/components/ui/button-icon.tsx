import react from "react";
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { LucideProps } from "lucide-react";

// interface IconButtonBase {
//   className?: string;
//   alt?: string;
//   active?: boolean;
//   onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
// }
//
// interface IconButtonWithIcon extends IconButtonBase {
//   icon: string | StaticImport;
//   svg: never;
// }
//
// interface IconButtonWithSvg extends IconButtonBase {
//   icon: never;
//   svg: react.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
// }
//
// type IconButton = IconButtonWithSvg | IconButtonWithIcon;

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
  svg: react.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// #TODO:Fix svg icon issue
export default function ButtonIcon(props: IconButton) {
  const { className, icon, alt, active = false, svg, onClick } = props;
  return (
    <Button
      onClick={onClick}
      className={
        cn(`bg-white hover:opacity-75 hover:bg-white text-secondary p-[12px] ${active ? "border border-solid border-primary shadow-2xl" : "'"}`, className)
      }
      variant="default" size={null}>
      {
        icon ?
          <Image src={icon} alt={alt || ""} /> :
          <>
            {svg}
          </>
      }
    </Button>
  )
}
