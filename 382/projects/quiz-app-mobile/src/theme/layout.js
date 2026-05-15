import { useWindowDimensions } from 'react-native'

export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
}

export function getColumns(width) {
  if (width >= breakpoints.lg) return 3
  if (width >= breakpoints.md) return 2
  return 1
}

export function useResponsive() {
  const { width, height } = useWindowDimensions()
  const columns = getColumns(width)
  return {
    width,
    height,
    columns,
    isSmall: width < breakpoints.md,
    isMediumUp: width >= breakpoints.md,
    isLargeUp: width >= breakpoints.lg,
  }
}

