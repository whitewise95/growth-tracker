import { PropsWithChildren } from "react"
import classNames from "classnames"

interface BaseHeaderProps {
  className?: string
}

const BaseHeader = ({
  children,
  className,
}: PropsWithChildren<BaseHeaderProps>) => {
  return (
    <header
      className={classNames(
        "fixed top-0 z-10 flex h-[60px] w-full items-center px-[20px] py-[12px]",
        className
      )}
    >
      {children}
    </header>
  )
}

export default BaseHeader
