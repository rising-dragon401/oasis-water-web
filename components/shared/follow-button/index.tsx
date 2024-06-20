import { followUser, unFollowUser } from '@/app/actions/user'
import { Button } from '@/components/ui/button'

type FollowButtonProps = {
  userData: any
  targetUserId: string
}

export default function FollowButton({ userData, targetUserId }: FollowButtonProps) {
  const authUserId = userData?.uid

  const handleFollow = async () => {
    if (!authUserId) {
      return
    }

    if (userData?.following.includes(targetUserId)) {
      await unFollowUser(authUserId, targetUserId)
    } else {
      await followUser(authUserId, targetUserId)
    }
  }

  return (
    <Button
      onClick={() => {
        console.log('Follow button clicked')
      }}
      className="bg-blue-500 text-white"
    >
      {userData?.following.includes(targetUserId) ? 'Unfollow' : 'Follow'}
    </Button>
  )
}
