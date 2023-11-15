'use client'

import { useState, useEffect } from 'react'

export default function useDevice() {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0)

  function handleWindowSizeChange() {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleWindowSizeChange)
      return () => {
        window.removeEventListener('resize', handleWindowSizeChange)
      }
    }
  }, [])

  const isMobile = width <= 768
  const isTablet = width > 768 && width <= 1024

  return {
    isMobile: isMobile,
    isTablet: isTablet,
  }
}
