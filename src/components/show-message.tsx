import React, { useState, useEffect } from 'react'
import { Snackbar } from '@material-ui/core'
import MuiAlert, { Color as AlertType } from '@material-ui/lab/Alert'

export interface ShowMessageProps {
  type?: AlertType
  content: string
  open: boolean
}

export default function ShowMessage (props: ShowMessageProps) {
  const [status, setStatus] = useState(false)
  useEffect(() => {
    setStatus(props.open)
  }, [props])

  // 关闭提示框
  const snackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setStatus(false)
  }
  return (
    <Snackbar
      open={status}
      onClose={snackbarClose}
      autoHideDuration={2000}
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
    >
      <MuiAlert elevation={6} variant='filled' severity={props.type || 'success'}>
        {props.content}
      </MuiAlert>
    </Snackbar>
  )
}
