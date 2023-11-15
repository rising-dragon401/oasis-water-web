import { atomWithStorage } from 'jotai/utils'

export const assistantIdAtom = atomWithStorage<string | null>('oaisys-assistant_id', null)

export const messagesAtom = atomWithStorage<any[]>('oaisys-messages', [])

export const threadIdAtom = atomWithStorage<string | null>('oaisys-thread-id', null)
