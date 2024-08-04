import create from "zustand"

export type InitialDataType = {
  id: string
  userId: string
  nickname: string
  goal: string
}

type ChallengeDetailState = {
  challengeDetail: InitialDataType
  setChallengeDetail: (currentChallenge: InitialDataType) => void
}

const initialData: InitialDataType = {
  id: "",
  userId: "",
  nickname: "",
  goal: "",
}

const useChallengeDetailStore = create<ChallengeDetailState>((set) => ({
  challengeDetail: initialData,
  setChallengeDetail: (currentChallenge: InitialDataType) =>
    set((state) => ({
      challengeDetail: {
        ...state.challengeDetail,
        ...currentChallenge,
      },
    })),
}))

export default useChallengeDetailStore
