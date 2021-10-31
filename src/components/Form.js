import React from 'react'
// auth
import { auth, db } from '../config/firebase'
import { addDoc, collection } from 'firebase/firestore'
// styling
import { Box } from '@mui/system'
import { Alert, Button, Snackbar, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { DoubleArrow } from '@mui/icons-material'

const Form = props => {

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const { login } = props

  // States

  const [nickname, setNickname] = React.useState()
  const [number, setNumber] = React.useState()
  const [message, setMessage] = React.useState()
  const [error, setError] = React.useState(false)
  const [errorLvl, setErrorLvl] = React.useState()
  const [errorMsg, setErrorMsg] = React.useState()

  // Functions

  const handleSubmit = e => {
    e.preventDefault()
    if (number) {
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank')
    } else {
      setError(true)
      setErrorLvl("error")
      setErrorMsg("Please enter a phone number.")
    }
  }

  const handleSave = async () => {
    if (nickname && number) { 
      const res = await addDoc(collection(db, "saved_numbers"), {
        user_id: auth.currentUser.uid,
        nickname: nickname,
        number: number,
        created_at: Date.now()
      })
      console.log(res)
      setError(true)
      setErrorLvl("success")
      setErrorMsg("Number is saved.")
    } else {
      setError(true)
      setErrorLvl("error")
      setErrorMsg("Nickname or number is empty.")
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setErrorMsg()
    setError(false)
  }

  // Components

  const Tip = () => {
    return (
      <Stack direction="row" spacing={1} sx={{ margin: '30px 0px', display: 'flex', justifyContent: 'center' }}>
        <Typography variant="body1" sx={{ fontWeight: 100 }}>{`e.g. +6012 345 6789`}</Typography>
        <DoubleArrow fontSize="small" color="secondary" />
        <Typography variant="body1" sx={{ fontWeight: 100 }}>{`60123456789`}</Typography>
      </Stack>
    )
  }

  return (
    <Box sx={isMobile ? { marginTop: '30px', padding: '0px 20px' } : { marginTop: '30px', padding: '0px 30px' }}>
      <form onSubmit={handleSubmit}>
        <Tip />
        {
          login ?
          <TextField
            label="Nickname"
            type="text"
            inputProps={{
              maxLength: 13
            }}
            onChange={({target}) => setNickname(target.value)}
            sx={{ width: '100%', marginBottom: '15px' }}
          />
          :
          null
        }
        <TextField
          label="Phone Number"
          type="tel"
          inputProps={{
            maxLength: 15
          }}
          onChange={({target}) => setNumber(target.value)}
          sx={{ width: '100%', marginBottom: '15px' }}
        />
        <TextField
          label="Message"
          type="text"
          onChange={({target}) => setMessage(target.value)}
          sx={{ width: '100%', marginBottom: '15px' }}
        />
        <Stack direction={isMobile ? "column" : "row"} spacing={1}>
          <Button 
            variant="contained" 
            color="primary" 
            type="submit" 
            sx={{ width: '100%', color: '#fff' }}
          >
            chat now
          </Button>
          {
            login ? 
            <Button 
              onClick={handleSave} 
              variant="contained" 
              color="secondary" 
              type="button" 
              sx={{width: '100%', color: '#fff' }}
            >
              save
            </Button> 
            : 
            null
          }
        </Stack>
      </form>
      <Snackbar 
        open={error} 
        autoHideDuration={4000} 
        onClose={handleClose}
      >
        <Alert 
          onClose={handleClose} 
          severity={errorLvl} 
          sx={{ width: '100%' }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Form
