import { uploadFile } from '@/app/actions/files'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Camera, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

type ImageUploadProps = {
  itemId: number | null
  label: string
  file?: string | null
  setFile?: (value: string) => void
  height?: string
  onSuccess?: (url: string) => void
  showIcon?: boolean
}

export function ImageUpload({
  itemId,
  label,
  file,
  setFile,
  height,
  showIcon,
  onSuccess,
}: ImageUploadProps) {
  const [drag, setDrag] = useState(false)
  const [loading, setLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setDrag(true)
  }

  const onDragLeave = () => {
    setDrag(false)
  }

  const onDrop = async (event: React.DragEvent) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files.length) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        await handleUploadFile(file)
      }
    }
    setDrag(false)
  }

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (!files) return

    if (files.length) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        await handleUploadFile(file)
      }
    }
  }

  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleUploadFile = async (file: File) => {
    try {
      if (!itemId) {
        throw new Error('No item id')
      }

      setLoading(true)

      const res = await uploadFile(file, `users/${itemId}`, file.name)

      if (res) {
        if (onSuccess) {
          onSuccess(res.publicUrl)
        }

        if (setFile) {
          setFile(res.publicUrl)
        }
      } else {
        throw new Error('Unable to upload image')
      }

      setLoading(false)
    } catch (error) {
      toast('Error uploading image. Please try another')
      setLoading(false)
    }
  }

  const heightAndWidth = height ? `w-${height} h-${height}` : 'w-28 h-28'

  return (
    <>
      <Label htmlFor="picture" className="mb-1">
        {label}
      </Label>

      <div
        className={`${heightAndWidth} grid max-w-sm items-center justify-center gap-1.5 border rounded-full border-dashed ${
          drag ? 'dragging' : ''
        } `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />

        {file ? (
          <div onClick={onButtonClick} className={`relative cursor-pointer ${heightAndWidth}`}>
            <Image
              src={file}
              alt="Uploaded"
              width={300}
              height={300}
              className={`rounded-full ${heightAndWidth}`}
            />
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted" />
              </div>
            ) : (
              showIcon && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="h-6 w-6 text-muted" />
                </div>
              )
            )}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center text-center gap-1">
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            <Typography size="sm" fontWeight="normal">
              Drag and drop an image here
            </Typography>
            <Button variant="ghost" onClick={onButtonClick} className="p-0">
              or click to upload
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
