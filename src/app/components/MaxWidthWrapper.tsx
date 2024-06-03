import { ReactNode } from "react"
import { cn } from "@/lib/utils"

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => {
  return (
    <div
      className={cn(
        "h-full mx-auto w-full max-w-screen-xl text-white px-2.5 md:px-32 sm:px-40",
        className
      )}
    >
      {children}
    </div>
  )
}

export default MaxWidthWrapper
