import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const assistantIdAtom = atomWithStorage<string | null>('assistant_id', null)
