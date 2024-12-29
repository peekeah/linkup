
import { SvgProps } from "./settings"

const Close = (props: SvgProps) => {

  const { height = "32", width = "32", hover = false, className = "" } = props;

  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 32 32"
      style={{
        fill: hover ? "hsl(var(--accent))" : "hsl(var(--primary))",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6.66797 6.66666L25.3334 25.3321" stroke="#292D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.66686 25.3321L25.3323 6.66666" stroke="#292D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default Close;
