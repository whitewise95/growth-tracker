"use client"

import { useAuth } from "@/context/auth.context"
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"

import Challenge from "@/app/(providers)/(styles)/my-page/_component/Challenge"

import { MyChallengeType } from "../../../../../../../types/myChallengeList"

function Page() {
  const { me } = useAuth()

  const getMyChallengeList = async ({
    pageParam,
  }: {
    pageParam: number
  }): Promise<MyChallengeType> => {
    const response = await axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${me?.id}/challenge/like?page=${pageParam}&limit=10`
      )
      .then((response) => response.data)

    debugger
    return response.data
  }

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["myChallengeLikeList"],
    initialPageParam: 0,
    queryFn: getMyChallengeList,
    getNextPageParam: (
      lastPage: any,
      allPages,
      lastPageParam,
      allPageParams
    ) => {
      const nextPage = lastPageParam + 1
      return lastPage.length === 10 ? nextPage : undefined
    },
    select: ({ pages }) => pages.flat(),
  })

  if (isPending) return <div>Loading...</div>
  if (isError) return <div>Error loading data</div>

  return (
    <div className={"flex flex-col items-center"}>
      <p>좋아요 챌린지 목록</p>
      <ul>
        {data?.map((challenge) => (
          <Challenge key={challenge.id} challenge={challenge}></Challenge>
        ))}
      </ul>
    </div>
  )
}

export default Page
