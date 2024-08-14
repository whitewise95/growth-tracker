import { PropsWithChildren } from "react"
import classNames from "classnames"

import BaseHeader from "./BaseHeader"

interface DefaultHeaderProps {
  className?: string
}
function DefaultHeader({
  children,
  className,
}: PropsWithChildren<DefaultHeaderProps>) {
  return (
    <BaseHeader
      className={classNames(className, "mx-auto w-full min-w-[320px]")}
    >
      {children}
    </BaseHeader>
  )
}

export default DefaultHeader
