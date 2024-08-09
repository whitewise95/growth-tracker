"use client"

import { useAuth } from "@/context/auth.context"

import ChallengeCard from "@/components/ChallengeCard"

import { PostType } from "../../../../../../types/challenge"

interface ChallengePostsProps {
  posts: PostType[]
  onClickPost: (id: string) => void
}

function ChallengePosts({ posts, onClickPost }: ChallengePostsProps) {
  const { me } = useAuth()

  return (
    <div className="pb-[80px]">
      <ul>
        {posts.map((post) => {
          return (
            <li
              key={post.id}
              onClick={() => onClickPost(post.id)}
              className="cursor-pointe mb-[20px]"
            >
              <ChallengeCard
                challenge={post}
                milestones={post.milestones}
                title={post.goal}
                category={post.category}
                likes={post.like_cnt}
                bookmarks={post.template_cnt}
                liked={me ? (post.liked || []).includes(me.id) : false}
                nickname={post.user.nickname}
                progress={post.progress}
                userImage={post.user.profile_image_url}
                bookmarked={
                  me ? (post.bookmarked || []).includes(me.id) : false
                }
                challengeImage={post.image}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ChallengePosts
