import { PropsWithChildren } from "react"

interface PageProps {
  title: string
  isTitleHidden?: boolean
}

const Page = ({
  children,
  title,
  isTitleHidden,
}: PropsWithChildren<PageProps>) => {
  return (
    <main className="container mx-auto p-4 sm:p-8 md:p-12 lg:p-14 xl:p-16">
      <h1
        className={`mb-6 font-semibold ${isTitleHidden ? "hidden" : ""} text-lg md:text-2xl lg:text-3xl xl:text-4xl`}
      >
        {title}
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-none lg:grid-cols-none">
        {children}
      </div>
    </main>
  )
}

export default Page
