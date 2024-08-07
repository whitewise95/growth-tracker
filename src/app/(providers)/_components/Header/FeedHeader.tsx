"use client"

import { useState } from "react"
import { useChallengeSearchStore } from "@/store/challengeSearch.store"

import CloseWithoutLineIcon from "@/components/Icon/CloseWithoutLineIcon"
import SearchIcon from "@/components/Icon/SearchIcon"
import Input from "@/components/Input"

import Notice from "../Notice/Notice"
import BaseHeader from "./BaseHeader"

export interface FeedHeaderProps {
  onSearch?: (query: string) => void
}

function FeedHeader({ onSearch }: FeedHeaderProps) {
  const [isShowSearch, setIsShowSearch] = useState<boolean>(false)
  const { setSearchQuery } = useChallengeSearchStore()

  const handleSearchClick = () => {
    setIsShowSearch(true)
  }

  const handleSearchSubmit = (query: string) => {
    if (onSearch) {
      onSearch(query)
    }
    setIsShowSearch(false)
  }

  const handleSearchClose = () => {
    setIsShowSearch(false)
  }

  return (
    <BaseHeader className="bg-white">
      <div className="flex w-full items-center justify-between">
        <div
          className={`flex transition-all ${isShowSearch ? "hidden" : "block"}`}
        >
          <h1>LOGO</h1>
        </div>

        <div className="ml-auto flex flex-1 items-center justify-end gap-[8px]">
          {isShowSearch ? (
            <div className="relative flex flex-1 items-center gap-[8px]">
              <Input
                className="flex-1 text-xs"
                variant="search"
                placeholder="챌린지를 찾아보세요"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit((e.target as HTMLInputElement).value)
                  }
                }}
                autoFocus
              />
              <CloseWithoutLineIcon
                width={12}
                height={12}
                onClick={handleSearchClose}
                color="#000"
                className="absolute right-2 top-[30px] cursor-pointer"
              />
            </div>
          ) : (
            <SearchIcon onClick={handleSearchClick} />
          )}
          <Notice></Notice>
        </div>
      </div>
    </BaseHeader>
  )
}

export default FeedHeader
