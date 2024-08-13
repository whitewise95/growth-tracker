import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth.context"
import useChallengeQuery from "@/query/challenge/userChallengeQuery"
import useChallengeCreateStore, {
  categories,
  defaultSelected,
} from "@/store/challengeCreate.store"
import useMilestoneCreateStore, {
  MilestoneType,
} from "@/store/milestoneCreate.store"
import { differenceInCalendarDays, format } from "date-fns"
import { produce } from "immer"

import Button from "@/components/Button"
import CalenderIcon from "@/components/Icon/CalenderIcon"
import FlagIcon from "@/components/Icon/FlagIcon"
import Page from "@/components/Page"

import DragDropContainer from "../../../../create/_components/DrapDropContainer/DragDropContainer"
import SubTitle from "../../../../create/_components/styles/SubTitle"

interface MilestoneCreateSwitchProps {
  goNextPage: () => void
  challengeId?: string
  milestoneIds?: string[]
}
function MilestoneCreateSwitch({
  goNextPage,
  challengeId,
  milestoneIds,
}: MilestoneCreateSwitchProps) {
  const {
    randomImgUrl,
    range,
    category,
    goal,
    setRange,
    setCategory,
    setGoal,
    setRandomImgUrl,
  } = useChallengeCreateStore()
  const { data, setData } = useMilestoneCreateStore()
  const { me } = useAuth()
  const router = useRouter()

  // 뮤테이션 함수 => db에 생성 저장하는 로직
  const {
    challengeCreateMutate,
    challengeCreateIsPending,
    challengeUpdateMutate,
  } = useChallengeQuery()

  return (
    <>
      <Page>
        <section className="p-[20px]">
          <div className="mt-[12px] flex items-center gap-2">
            <FlagIcon />
            <SubTitle>{goal}</SubTitle>
          </div>
          <div className="mt-[12px] flex items-center gap-2">
            <CalenderIcon color="#717171" />
            <p className="text-[18px] font-[500] text-[#717171]">
              {range
                ? `${format(range.from!, "yyyy.MM.dd.")} ~ ${format(range.to!, "yyyy.MM.dd.")} (${differenceInCalendarDays(range.to!, range.from!) + 1}일)`
                : "기간을 선택해주세요."}
            </p>
          </div>
        </section>

        <div className="h-[10px] flex-shrink-0 bg-grey-800" />
        <section className="p-[20px]">
          <Button
            variant="outline"
            className="h-full"
            size="lg"
            onClick={() => {
              goNextPage()
            }}
            disabled={
              data.length !== 0 &&
              range &&
              format(range?.to!, "yyyy-MM-dd") === data[data.length - 1].end_at
            }
          >
            + 루틴 추가
          </Button>
        </section>

        <section className="p-[20px]">
          {data.length === 0 ? (
            <p className="text-center text-[16px] text-grey-400">
              루틴을 생성해주세요.
            </p>
          ) : (
            <DragDropContainer range={range} />
          )}
        </section>
        <div className="h-[120px]" />
        <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-[640px] bg-white px-[20px] pb-8 pt-5">
          <Button
            className="h-full"
            onClick={() => {
              // 1. 홈으로 네비게이션 돌리기
              router.push("/")
              // 2. 여기에서 그냥 생성 함수가 들어갈 수도 있다. 가져오기일때
              {
                !milestoneIds &&
                  !challengeId &&
                  challengeCreateMutate({
                    challenge: {
                      category: category,
                      user_id: me?.id || "",
                      day_cnt:
                        differenceInCalendarDays(range?.to!, range?.from!) + 1,
                      end_at: format(range?.to!, "yyyy-MM-dd"),
                      goal: goal,
                      is_secret: false,
                      start_at: format(range?.from!, "yyyy-MM-dd"),
                      image_url: randomImgUrl,
                    },
                    milestone: data.map((obj) =>
                      produce(
                        obj,
                        (
                          draft: Omit<MilestoneType, "routines" | "id"> & {
                            routines?: MilestoneType["routines"]
                            id?: MilestoneType["id"]
                          }
                        ) => {
                          draft.start_at = draft.start_at
                          draft.end_at = draft.end_at
                          delete draft.routines
                          delete draft.id
                        }
                      )
                    ),
                    routine: data.map((obj) =>
                      obj.routines.map((routine) => ({
                        content: routine.content,
                        milestone_id: obj.id,
                      }))
                    ),
                  })
              }
              // 2. 뮤테이션
              // milestoneIds 안에 있는 값만 업데이트하게 필터링
              const filteredData = data.filter(
                (obj) => milestoneIds && milestoneIds.includes(obj.id)
              )
              // 뮤테이션 돌리기
              {
                milestoneIds &&
                  challengeId &&
                  challengeUpdateMutate({
                    milestoneIds: milestoneIds,
                    "challenge-id": challengeId,
                    milestone: filteredData.map((obj) =>
                      produce(
                        obj,
                        (
                          draft: Omit<MilestoneType, "routines" | "id"> & {
                            routines?: MilestoneType["routines"]
                            id?: MilestoneType["id"]
                          }
                        ) => {
                          draft.start_at = draft.start_at
                          draft.end_at = draft.end_at
                          delete draft.routines
                          delete draft.id
                        }
                      )
                    ),
                    routine: filteredData.map((obj) =>
                      obj.routines.map((routine) => ({
                        content: routine.content,
                        milestone_id: obj.id,
                      }))
                    ),
                  })
              }
              // 3. 주스텐드 싹다 정리하는 함수를 실행하기 (스토어 초기화)
              setData([])
              setRange(defaultSelected)
              setCategory(categories[0])
              setGoal("")
              setRandomImgUrl("")
            }}
            disabled={data.length === 0}
            size="lg"
          >
            수정 완료
          </Button>
        </div>
      </Page>
    </>
  )
}

export default MilestoneCreateSwitch
