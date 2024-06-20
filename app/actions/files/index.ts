// file upload require browser client
import { createClient } from '@/utils/supabase/client'

export const uploadFile = async (file: File, path: string, name: string) => {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.storage.from(path).upload(name, file)

    if (error) {
      throw error
    }

    const { data: urlData } = supabase.storage.from(path).getPublicUrl(name)

    return urlData
  } catch (e) {
    return false
  }
}
