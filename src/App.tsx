import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import Routers from './routes'
import Toast from './components/Toast'
import withProviders from './contexts/providers'
import useInitApp from './contexts/providers/hook'
import {
  MAINNET_PRIMARY_THEME_COLOR,
  MAINNET_SECONDARY_THEME_COLOR,
  TESTNET_PRIMARY_THEME_COLOR,
  TESTNET_SECONDARY_THEME_COLOR,
} from './utils/const'
import { isMainnet } from './utils/chain'

const AppDiv = styled.div`
  width: 100vw;
  height: 100vh;
`
const App = withProviders(() => {
  const theme = {
    primary: isMainnet() ? MAINNET_PRIMARY_THEME_COLOR : TESTNET_PRIMARY_THEME_COLOR,
    secondary: isMainnet() ? MAINNET_SECONDARY_THEME_COLOR : TESTNET_SECONDARY_THEME_COLOR,
  }

  useInitApp()

  return (
    <ThemeProvider theme={theme}>
      <AppDiv>
        <Routers />
        <Toast />
      </AppDiv>
    </ThemeProvider>
  )
})

export default App
