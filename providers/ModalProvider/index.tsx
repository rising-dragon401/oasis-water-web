'use client'

import { ReactNode, createContext, useContext, useState } from 'react'
import { kModalMap } from './modals'

// Define the shape of your modal states and the functions available in the context
export type ModalName = keyof typeof kModalMap

interface ModalContextType {
  openModal: (modalName: ModalName) => void
  closeModal: (modalName: ModalName) => void
  isOpen: boolean
}

// Prepare default state for context
const defaultModalOpenStates = Object.keys(kModalMap).reduce(
  (acc, key) => ({ ...acc, [key]: false }),
  {}
) as { [key in ModalName]: boolean }

// Create the context with explicit typing
const ModalContext = createContext<ModalContextType>({
  openModal: () => {}, // Implement a no-op function or handle this case gracefully
  closeModal: () => {},
  isOpen: false,
})

interface Props {
  children: ReactNode
}

export const ModalProvider = ({ children }: Props) => {
  const [modalStates, setModalStates] =
    useState<{ [key in ModalName]: boolean }>(defaultModalOpenStates)

  const openModal = (modalName: ModalName) => {
    setModalStates((prevStates) => ({ ...prevStates, [modalName]: true }))
  }

  const closeModal = (modalName: ModalName) => {
    setModalStates((prevStates) => ({ ...prevStates, [modalName]: false }))
  }

  const providerValue = {
    openModal,
    closeModal,
    isOpen: Object.values(modalStates).some((state) => state === true),
  }

  return (
    <ModalContext.Provider value={providerValue}>
      {children}
      {Object.entries(kModalMap).map(([key, Component]) => (
        <Component
          key={key}
          open={modalStates[key as ModalName]}
          setOpen={() => closeModal(key as ModalName)}
        />
      ))}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  return useContext(ModalContext)
}
