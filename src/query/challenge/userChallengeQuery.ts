import { useRouter } from "next/navigation"
import {
  POSTchallenge,
  POSTchallengeArgumentProps,
  PUTchallenge,
  PUTchallengeArgumentProps,
} from "@/api/supabase/challenge"
import useChallengeCreateStore, {
  defaultSelected,
  WEEK_DAY_LIST,
} from "@/store/challengeCreate.store"
import useMilestoneCreateStore, {
  initialData,
} from "@/store/milestoneCreate.store"
import { useMutation } from "@tanstack/react-query"

import queryClient from "../queryClient"

const CHALLENGE_QEURY_KEY = "challenge"

function useChallengeQuery() {
  const { setDayChecks, setRange } = useChallengeCreateStore()
  const { setCurrentSlideId, setData } = useMilestoneCreateStore()
  const router = useRouter() // useRouter 훅 사용
  const { isPending: challengeCreateIsPending, mutate: challengeCreateMutate } =
    useMutation({
      mutationFn: async (variables: POSTchallengeArgumentProps) =>
        await POSTchallenge(variables),
      onSuccess: () => {
        // 모달 추가
        alert("성공했어!")
        queryClient.invalidateQueries({ queryKey: [CHALLENGE_QEURY_KEY] })
        setRange(defaultSelected)
        setDayChecks(WEEK_DAY_LIST.map(() => false))
        setCurrentSlideId("")
        setData(initialData)
        return router.push("/")
      },
      onError: () => {
        // 모달 추가
        alert("실패했어")
      },
    })

  const { isPending: challengeUpdateIsPending, mutate: challengeUpdateMutate } =
    useMutation({
      mutationFn: async (variables: PUTchallengeArgumentProps) =>
        await PUTchallenge(variables),
      onSuccess: (data, variables) => {
        // 모달 추가
        alert("성공했어!")
        queryClient.invalidateQueries({
          queryKey: [CHALLENGE_QEURY_KEY, variables["challenge-id"]],
        })
        setRange(defaultSelected)
        setDayChecks(WEEK_DAY_LIST.map(() => false))
        setCurrentSlideId("")
        setData(initialData)
        return router.push("/newsfeed")
      },
      onError: () => {
        // 모달 추가
        alert("실패했어")
      },
    })

  return {
    challengeCreateMutate,
    challengeCreateIsPending,
    challengeUpdateIsPending,
    challengeUpdateMutate,
  }
}

export default useChallengeQuery
