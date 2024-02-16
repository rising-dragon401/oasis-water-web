import { atomWithStorage } from 'jotai/utils'

export const assistantIdAtom = atomWithStorage<string | null>('oasis-assistant_id', null)

export const messagesAtom = atomWithStorage<any[]>('oasis-messages', [])

export const threadIdAtom = atomWithStorage<string | null>('oasis-thread-id', null)
