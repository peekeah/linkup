import { SvgProps } from "./settings";

const Message = (props: SvgProps) => {

  const { height = "32", width = "32", hover, className = "" } = props;

  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        fill: hover ? "hsl(var(--accent))" : "hsl(var(--primary))",
      }}
    >
      <path d="M15.9999 16C19.6818 16 22.6666 13.0152 22.6666 9.33332C22.6666 5.65142 19.6818 2.66666 15.9999 2.66666C12.318 2.66666 9.33325 5.65142 9.33325 9.33332C9.33325 13.0152 12.318 16 15.9999 16Z" />
      <path d="M15.9999 19.3333C9.31988 19.3333 3.87988 23.8133 3.87988 29.3333C3.87988 29.7067 4.17322 30 4.54655 30H27.4532C27.8266 30 28.1199 29.7067 28.1199 29.3333C28.1199 23.8133 22.6799 19.3333 15.9999 19.3333Z" />
    </svg>
  )
}

export default Message;
