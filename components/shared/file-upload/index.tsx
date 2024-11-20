import { uploadFile } from '@/app/actions/files'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUserProvider } from '@/providers/UserProvider'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type FileUploadProps = {
  file?: string | null
  setFile?: (value: string) => void
}

export function FileUpload({ file, setFile }: FileUploadProps) {
  const { user } = useUserProvider()
  const [loading, setLoading] = useState(false)

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast.error('Please login to upload a file')
      return
    }

    setLoading(true)

    try {
      const files = event.target.files
      if (!files || files.length === 0) {
        throw new Error('No file selected.')
      }

      const file = files[0]
      const fileName = file.name

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        const base64Data = reader.result as string

        if (!base64Data) {
          throw new Error('No base64 data available for the selected file.')
        }

        const res = await uploadFile(file, `data/community/requests`, fileName)

        if (res && setFile) {
          setFile(res.publicUrl)
        }
      }
    } catch (e) {
      toast.error('Error selecting file: ' + e)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="file">Attachment</Label>
      <Input id="file" type="file" onChange={onFileChange} />
      {loading && <Loader2 className="animate-spin" />}
    </div>
  )
}
