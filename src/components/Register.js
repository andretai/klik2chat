import React from 'react'
// auth
import { analytics, auth, db } from '../config/firebase'
import { logEvent } from 'firebase/analytics'
import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from '@firebase/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'
// styling
import { Box } from '@mui/system'
import { Alert, Button, Modal, Snackbar, Stack, Typography } from '@mui/material'
import { Facebook, Google } from '@mui/icons-material'

const saved_numbers = collection(db, "saved_numbers")

const fbProvider = new FacebookAuthProvider()
const goProvider = new GoogleAuthProvider()

const Register = props => {

  const { registerModal, handleLogin, toggleRegisterModal, setNumbers, setUsername } = props

  const [error, setError] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState()

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setError(false)
  }

  const handleOthers = provider => {
    signInWithPopup(auth, provider)
      .then(async result => {
        if (provider === goProvider) {
          logEvent(analytics, "sign_up", {
            method: "Google"
          })
        } else {
          logEvent(analytics, "sign_up", {
            method: "Facebook"
          })
        }
        const user = result.user
        let docs = []
        const q = query(saved_numbers, where("user_id", "==", user.uid))
        const qSnap = await getDocs(q)
        qSnap.forEach(snap => {
          let data = snap.data()
          docs.push(data)
        })
        docs.sort((a, b) => b.created_at - a.created_at)
        setNumbers(docs)
        toggleRegisterModal(false)
        if (user.displayName) {
          setUsername(user.displayName)
        }
      })
      .catch(err => {
      })
  }

  return (
    <>
      <Modal
        open={registerModal}
        onClose={() => toggleRegisterModal(false)}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            bgcolor: 'background.paper',
            width: '330px',
            padding: '30px 15px',
            borderRadius: 3
          }}
        >
          <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 300, margin: '10px 0px' }}>
            Sign Up with Facebook or Google
          </Typography>
          <Stack 
            direction="row" 
            spacing={1} 
            justifyContent="center"
            sx={{ margin: '30px 0px'}}
          >
            <Button 
              variant="contained" 
              color="info" 
              sx={{ width: '50%', padding: '10px 0px' }}
              onClick={() => handleOthers(fbProvider)}
            >
            <Facebook sx={{ marginRight: '5px' }} />
              Facebook
            </Button>
          <Button 
            variant="outlined" 
            color="warning" 
            sx={{ width: '50%', padding: '10px 0px' }}
            onClick={() => handleOthers(goProvider)}
          >
            <Google sx={{ marginRight: '5px' }} />
            Google
          </Button>
          </Stack>
          <Typography 
            variant="h6" 
            color="GrayText" 
            sx={{ textAlign: 'center', fontWeight: 100 }}
          >
            Have an account already? <Button onClick={() => handleLogin()} type="button" color="secondary"><Typography variant="body1" sx={{ textTransform: 'uppercase', fontWeight: 1000 }}>sign in now</Typography></Button>
          </Typography>
        </Box>
      </Modal>
      <Snackbar 
        open={error} 
        autoHideDuration={4000} 
        onClose={handleClose}
      >
        <Alert 
          onClose={handleClose} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Register
