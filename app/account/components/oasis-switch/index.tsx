import { addUserToAlgolia, deleteUserFromAlgolia } from '@/app/actions/algolia'
import { updateUserData } from '@/app/actions/user'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  userData: any
}

export function OasisSwitch({ userData }: Props) {
  const [checked, setChecked] = useState(userData?.is_oasis_public)

  const handleChange = async (value: boolean) => {
    setChecked(value)

    const res = await updateUserData('is_oasis_public', value)

    if (!res) {
      return
    }

    const userObject = {
      id: userData.id,
      name: userData.full_name,
      is_oasis_public: value,
      image: userData.avatar_url,
    }

    if (value) {
      addUserToAlgolia(userObject)
      toast('Your Oasis is now public')
    } else {
      deleteUserFromAlgolia(userData.id)
      toast('Your Oasis is now private')
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="oasis-public"
        checked={checked}
        onCheckedChange={(value) => handleChange(value)}
      />
      <Label htmlFor="oasis-public">Oasis public</Label>
    </div>
  )
}
