import React, { useState, useEffect } from 'react'
import { Snackbar } from '@material-ui/core'
import MuiAlert, { Color as AlertType } from '@material-ui/lab/Alert'

export interface ShowMessageProps {
  type?: AlertType
  content: string
  open: boolean,
  onClose?: (event: React.SyntheticEvent) => void
}

export default function ShowMessage (props: ShowMessageProps) {
  const [status, setStatus] = useState(false)
  useEffect(() => {
    setStatus(props.open)
  }, [props.open])

  // 关闭提示框
  const snackbarClose = (event: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setStatus(false)
    if (props.onClose) {
      props.onClose(event)
    }
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
