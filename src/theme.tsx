import React, { useContext } from 'react'
import { grey, lightBlue } from '@material-ui/core/colors'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import GlobalContext from './context/global-context'

interface Props {
  children: React.ReactElement | Array<React.ReactElement>
}
export default function LemonTheme (props: Props) {
  const { themeType } = useContext(GlobalContext)
  const currentThem = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: themeType,
          primary: {
            main: grey[900]
          },
          secondary: {
            main: lightBlue.A400
          }
        }
      }),
    [themeType]
  )

  return (
    <ThemeProvider theme={currentThem}>
      {props.children}
    </ThemeProvider>
  )
}
