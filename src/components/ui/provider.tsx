"use client"

import { ChakraProvider } from "@chakra-ui/react"
// import { defaultSystem } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

export function Provider(props: ColorModeProviderProps) {
  return (
    // <ChakraProvider value={defaultSystem}>
    <ChakraProvider>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
