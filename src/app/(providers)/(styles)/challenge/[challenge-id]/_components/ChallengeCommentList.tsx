"use client"

import { ChangeEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth.context"
import { useModal } from "@/context/modal.context"
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import axios from "axios"
import { useInView } from "react-intersection-observer"

function ChallengeCommentList({ challengeId }: { challengeId: string }) {
  const { me } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [content, setContent] = useState("")
  const [updateContent, setUpdateContent] = useState("")
  const [isUpdate, setIsUpdate] = useState(false)
  const [updateCommentId, setUpdateCommentId] = useState("")
  const modal = useModal()
  /**
   * 유저정보, 댓글정보, 좋아요정보 조회
   * */
  const getChallengeCommentList = async ({
    pageParam,
  }: {
    pageParam: number
  }): Promise<ChallengeCommentType> => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/challenge/${challengeId}/comment?limit=3&page=${pageParam}&userId=${me?.id}`
    )

    return response.data
  }

  /**
   * 댓글 생성
   * */
  const createComment = async () => {
    if (!me) {
      router.push("/")
      return
    } else if (!content.trim()) {
      alertOpen("댓글 내용을 입력해주세요.")
      return
    }

    const response = await axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/challenge/${challengeId}/comment`,
        JSON.stringify({ content, userId: me?.id }), // JSON 데이터
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)

    if (response.error) {
      alertOpen("댓글 작성에 실패했습니다.")
      throw new Error(response.error)
    }
    setContent("")
    refetch()
  }

  /**
   * 댓글 삭제
   * */
  const deleteComment = async (commentId: string) => {
    const response = await axios
      .delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/challenge/${challengeId}/comment/${commentId}`
      )
      .then((response) => response.data)
    if (response.error) {
      alertOpen("댓글 삭제에 실패했습니다.")
      throw new Error(response.error)
    }
    refetch()
  }

  /**
   * 댓글 수정
   * */
  const updateComment = async ({
    commentId,
    content,
  }: {
    commentId: string
    content: string
  }) => {
    const response = await axios
      .put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/challenge/${challengeId}/comment/${commentId}`,
        JSON.stringify({ content: content }), // JSON 데이터
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)

    if (response.error) {
      alertOpen("댓글 작성에 실패했습니다.")
      throw new Error(response.error)
    }
  }

  /**
   * 댓글 좋아요
   * */
  const createOrDeleteCommentLike = async ({
    isLike,
    commentId,
  }: {
    isLike: boolean
    commentId: string
  }) => {
    const method = isLike ? "delete" : "post"
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/challenge/${challengeId}/comment/${commentId}/like?userId=${me?.id}`

    const config = { method, url }
    const response = await axios(config).then((response) => response.data)

    if (response.error) {
      throw new Error(response.error.message)
    }
  }

  const { mutate: handleCommentLikeMutate } = useMutation({
    mutationFn: createOrDeleteCommentLike,
    onMutate: async ({
      isLike,
      commentId,
    }: {
      isLike: boolean
      commentId: string
    }) => {
      await queryClient.cancelQueries({ queryKey: ["challenge_comment"] })
      const commentList = queryClient.getQueryData(["challenge_comment"])
      queryClient.setQueryData(["challenge_comment"], (prev: ResponseData) => {
        return {
          pageParams: [...prev.pageParams],
          pages: prev.pages.map((comments) => {
            return comments.map((comment) => {
              debugger
              if (comment.id === commentId) {
                debugger
                comment.is_like = !comment.is_like
              }
              return comment
            })
          }),
        }
      })
      return { commentList }
    },
    onError: (err, test, context) => {
      debugger
      queryClient.setQueryData(["challenge_comment"], context?.commentList)
    },
    onSettled: () => {
      debugger
      queryClient.invalidateQueries({ queryKey: ["challenge_comment"] })
    },
  })

  const { mutate: handleCommentDeleteMutate } = useMutation({
    mutationFn: deleteComment,
    onMutate: async (commentId: string) => {
      debugger
      await queryClient.cancelQueries({ queryKey: ["challenge_comment"] })
      const commentList = queryClient.getQueryData(["challenge_comment"])
      debugger
      queryClient.setQueryData(["challenge_comment"], (prev: ResponseData) => {
        return {
          pageParams: [...prev.pageParams],
          pages: prev.pages.map((comments) => {
            return comments.filter((comment) => comment.id !== commentId)
          }),
        }
      })
      return { commentList }
    },
    onError: (err, _commentId, context) => {
      queryClient.setQueryData(["challenge_comment"], context?.commentList)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["challenge_comment"] })
    },
  })

  const { mutate: handleCommentMutate } = useMutation({
    mutationFn: updateComment,
    onMutate: async ({
      commentId,
      content,
    }: {
      commentId: string
      content: string
    }) => {
      debugger
      await queryClient.cancelQueries({ queryKey: ["challenge_comment"] })
      const commentList = queryClient.getQueryData(["challenge_comment"])
      queryClient.setQueryData(["challenge_comment"], (prev: ResponseData) => {
        return {
          pageParams: [...prev.pageParams],
          pages: prev.pages.map((comments) => {
            return comments.map((comment) => {
              if (comment.id === commentId) {
                comment.content = content
              }
              return comment
            })
          }),
        }
      })
      setUpdateContent("")
      setIsUpdate(false)
      setUpdateCommentId("")
      return { commentList }
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["challenge_comment"], context?.commentList)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["challenge_comment"] })
    },
  })

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["challenge_comment"],
    initialPageParam: 0,
    queryFn: getChallengeCommentList,
    getNextPageParam: (
      lastPage: any,
      allPages,
      lastPageParam,
      allPageParams
    ) => {
      const nextPage = lastPageParam + 1
      return lastPage.length === 3 ? nextPage : undefined
    },
    select: ({ pages }) => pages.flat(),
  })

  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  const alertOpen = (message: string) => {
    modal.open({
      type: "alert",
      content: message,
    })
    return
  }

  return (
    <div className={"flex-col gap-4"}>
      <div className={"text-2xl"}>댓글 목록</div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          createComment()
        }}
      >
        <input
          className={"w-[500px]"}
          value={content}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setContent(e.target.value)
          }
        ></input>
        <button
          onClick={(e) => {
            e.preventDefault()
            createComment()
          }}
        >
          댓글 작성
        </button>
      </form>
      {data?.map((comment, idx) => {
        const isLastItem = data?.length - 1 === idx
        return (
          <div
            className={"border border-b-2"}
            key={comment.id}
            ref={isLastItem ? ref : null}
          >
            <div className={"flex gap-4"}>
              <div>유저 이메일 : {comment.email}</div>
              <div>유저 닉네임 : {comment.nickname}</div>
            </div>
            {isUpdate && comment.id === updateCommentId ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleCommentMutate({
                    commentId: comment.id,
                    content: updateContent,
                  })
                }}
              >
                <input
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                />
              </form>
            ) : (
              <div>내용 : {comment.content}</div>
            )}

            <div className={"flex gap-4"}>
              종아요 여부 :{" "}
              <div
                onClick={() =>
                  handleCommentLikeMutate({
                    isLike: comment.is_like,
                    commentId: comment.id,
                  })
                }
              >
                {comment.is_like ? <p>❤️</p> : <p>🤍</p>}{" "}
              </div>
            </div>
            {comment.user_id === me?.id && (
              <div className={"flex gap-4"}>
                {isUpdate && comment.id === updateCommentId ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleCommentMutate({
                          commentId: comment.id,
                          content: updateContent,
                        })
                      }}
                      className={"border border-slate-600"}
                    >
                      수정완료
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setUpdateContent("")
                        setIsUpdate(false)
                        setUpdateCommentId("")
                      }}
                      className={"border border-slate-600"}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setUpdateContent(comment.content)
                        setIsUpdate(true)
                        setUpdateCommentId(comment.id)
                      }}
                      className={"border border-slate-600"}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleCommentDeleteMutate(comment.id)}
                      className={"border border-slate-600"}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ChallengeCommentList
