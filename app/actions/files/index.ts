// file upload require browser client
import { createClient } from '@/utils/supabase/client'

export const uploadFile = async (file: File, path: string, name: string): Promise<any> => {
  const supabase = await createClient()

  try {
    let { data, error } = await supabase.storage.from(path).upload(name, file)

    // if duplicate, reupload with random string appended to name
    // @ts-ignore
    if (error && error.statusCode === '409') {
      const randomString = Math.random().toString(36).substring(7)
      const newName = `${name}-${randomString}`
      console.log('Duplicate found, reuploading with new name', newName)
      return uploadFile(file, path, newName)
    }

    if (error) {
      throw error
    }

    const { data: urlData } = supabase.storage.from(path).getPublicUrl(name)

    return urlData
  } catch (e) {
    console.error('Error uploading file', e)
    throw e
  }
}
