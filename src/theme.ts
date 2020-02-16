import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'

// A custom theme for this app
export default (prefersDarkMode: boolean) => {
  return React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light'
        }
      }),
    [prefersDarkMode]
  )
}
