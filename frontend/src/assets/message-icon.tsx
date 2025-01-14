import { SvgProps } from "./settings"

const Message = (props: SvgProps) => {

  const { height = "32", width = "32", hover, className = "" } = props;

  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 30 30"
      style={{
        fill: hover ? "hsl(var(--accent))" : "hsl(var(--primary))",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.4875 15.5V20.5875C19.4875 21.0375 19.4375 21.4625 19.325 21.85C18.8625 23.6875 17.3375 24.8375 15.2375 24.8375H11.8375L8.0625 27.35C7.5 27.7375 6.75 27.325 6.75 26.65V24.8375C5.475 24.8375 4.4125 24.4125 3.675 23.675C2.925 22.925 2.5 21.8625 2.5 20.5875V15.5C2.5 13.125 3.975 11.4875 6.25 11.275C6.4125 11.2625 6.575 11.25 6.75 11.25H15.2375C17.7875 11.25 19.4875 12.95 19.4875 15.5Z" />
      <path d="M22.1875 19.5C23.775 19.5 25.1125 18.975 26.0375 18.0375C26.975 17.1125 27.5 15.775 27.5 14.1875V7.8125C27.5 4.875 25.125 2.5 22.1875 2.5H11.5625C8.625 2.5 6.25 4.875 6.25 7.8125V8.75C6.25 9.1 6.525 9.375 6.875 9.375H15.2375C18.625 9.375 21.3625 12.1125 21.3625 15.5V18.875C21.3625 19.225 21.6375 19.5 21.9875 19.5H22.1875V19.5Z" />
    </svg>
  )
}

export default Message;
