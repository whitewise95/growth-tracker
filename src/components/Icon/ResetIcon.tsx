import { SVGProps } from "react"

import Icon from "./Icon"

const ResetIcon = (props: SVGProps<SVGSVGElement> & { color?: string }) => (
  <Icon {...props} width="19" height="18" viewBox="0 0 19 18" fill="none">
    <path
      d="M14.2012 9.31098H10.3598C10.0567 9.31098 9.81098 9.55667 9.81098 9.85976V13.7012C9.81098 14.0043 10.0567 14.25 10.3598 14.25H14.2012C14.5043 14.25 14.75 14.0043 14.75 13.7012V9.85976C14.75 9.55667 14.5043 9.31098 14.2012 9.31098Z"
      fill={props.color || "#474747"}
    />
    <path
      d="M7.35 9.75C7.35 9.28056 6.96944 8.9 6.5 8.9C6.03056 8.9 5.65 9.28056 5.65 9.75H7.35ZM6.5 13.125V13.975C6.96944 13.975 7.35 13.5944 7.35 13.125H6.5ZM3.125 12.275C2.65556 12.275 2.275 12.6556 2.275 13.125C2.275 13.5944 2.65556 13.975 3.125 13.975V12.275ZM12.2013 6.33398C12.3857 6.76567 12.8852 6.96609 13.3169 6.78164C13.7486 6.59718 13.949 6.0977 13.7645 5.66602L12.2013 6.33398ZM5.28661 12.7951C5.68016 13.0511 6.20666 12.9395 6.46258 12.5459C6.7185 12.1524 6.60694 11.6259 6.21339 11.37L5.28661 12.7951ZM4.35 7.93902C4.35 5.68072 6.18072 3.85 8.43902 3.85V2.15C5.24183 2.15 2.65 4.74183 2.65 7.93902H4.35ZM5.65 9.75V13.125H7.35V9.75H5.65ZM6.5 12.275H3.125V13.975H6.5V12.275ZM10.3598 10.161H14.2012V8.46098H10.3598V10.161ZM13.9 9.85976V13.7012H15.6V9.85976H13.9ZM14.2012 13.4H10.3598V15.1H14.2012V13.4ZM10.661 13.7012V9.85976H8.96098V13.7012H10.661ZM10.3598 13.4C10.5261 13.4 10.661 13.5349 10.661 13.7012H8.96098C8.96098 14.4737 9.58723 15.1 10.3598 15.1V13.4ZM13.9 13.7012C13.9 13.5349 14.0349 13.4 14.2012 13.4V15.1C14.9737 15.1 15.6 14.4737 15.6 13.7012H13.9ZM14.2012 10.161C14.0349 10.161 13.9 10.0261 13.9 9.85976H15.6C15.6 9.08723 14.9737 8.46098 14.2012 8.46098V10.161ZM10.3598 8.46098C9.58723 8.46098 8.96098 9.08723 8.96098 9.85976H10.661C10.661 10.0261 10.5261 10.161 10.3598 10.161V8.46098ZM8.43902 3.85C10.1262 3.85 11.5765 4.87194 12.2013 6.33398L13.7645 5.66602C12.8819 3.60029 10.8308 2.15 8.43902 2.15V3.85ZM6.21339 11.37C5.08992 10.6394 4.35 9.37537 4.35 7.93902H2.65C2.65 9.97463 3.70132 11.7642 5.28661 12.7951L6.21339 11.37Z"
      fill={props.color || "#474747"}
    />
  </Icon>
)

export default ResetIcon
