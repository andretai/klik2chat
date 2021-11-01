import React from 'react'
// auth
import { auth, db } from '../config/firebase'
import { createUserWithEmailAndPassword, FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from '@firebase/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'
// styling
import { Box } from '@mui/system'
import { Alert, Button, IconButton, Modal, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { Facebook, Google } from '@mui/icons-material'

const saved_numbers = collection(db, "saved_numbers")

const fbProvider = new FacebookAuthProvider()
const goProvider = new GoogleAuthProvider()

const Register = props => {

  const { registerModal, handleLogin, toggleRegisterModal, numbers, setNumbers, setUsername } = props

  const [name, setName] = React.useState()
  const [email, setEmail] = React.useState()
  const [password, setPassword] = React.useState()
  const [confirm, setConfirm] = React.useState()
  const [error, setError] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState()

  const handleSubmit = e => {
    e.preventDefault()
    if (!(name && email && password && confirm)) {
      setError(true)
      setErrorMsg("Please fill in all the fields.")
    } else if (password !== confirm) {
      setError(true)
      setErrorMsg("Passwords do not match.")
    } else {
      createUserWithEmailAndPassword(auth, email, password)
      .then(async credentials => {
        toggleRegisterModal(false)
      })
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setError(false)
  }

  const handleOthers = provider => {
    signInWithPopup(auth, provider)
      .then(async result => {
        const user = result.user
        let docs = []
        const q = query(saved_numbers, where("user_id", "==", user.uid))
        const qSnap = await getDocs(q)
        qSnap.forEach(snap => {
          let data = snap.data()
          // console.log(data)
          docs.push(data)
        })
        docs.sort((a, b) => b.created_at - a.created_at)
        setNumbers(docs)
        // console.log(numbers)
        toggleRegisterModal(false)
        if (user.displayName) {
          setUsername(user.displayName)
        }
      })
      .catch(err => {
        // console.log('Social SignIn Err:', err)
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
            padding: '15px',
            borderRadius: 3
          }}
        >
          <Typography 
            variant="h5" 
            color="secondary" 
            sx={{ textAlign: 'center', fontWeight: 1000, marginBottom: '30px' }}
          >
            Create Free Account
          </Typography>
          <Typography 
            variant="body1" 
            color="GrayText" 
            sx={{ textAlign: 'center', fontWeight: 100, marginBottom: '30px' }}
          >
            Have an account already?
            <Button 
              onClick={() => handleLogin()}
              variant="text"
              type="button"
            >
              login
            </Button>
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              type="name"
              inputProps={{
                maxLength: 13
              }}
              onChange={({target}) => setName(target.value)}
              sx={{ width: '100%', marginBottom: '15px' }}
            />
            <TextField
              label="Email"
              type="email"
              onChange={({target}) => setEmail(target.value)}
              sx={{ width: '100%', marginBottom: '15px' }}
            />
            <TextField
              label="Password"
              type="password"
              onChange={({target}) => setPassword(target.value)}
              sx={{ width: '100%', marginBottom: '15px' }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              onChange={({target}) => setConfirm(target.value)}
              sx={{ width: '100%', marginBottom: '30px' }}
            />
            <Button 
              variant="contained"
              type="submit"
              sx={{ width: '100%', color: '#fff' }}
            >
              signup
            </Button>
          </form>
          <Stack direction="row" sx={{ marginTop: '15px', fontWeight: 100 }}>
            <hr></hr>
            <hr></hr>
          </Stack>
          <Stack 
            direction="row" 
            spacing={3} 
            justifyContent="center"
          >
            <IconButton onClick={() => handleOthers(fbProvider)}>
              <Facebook fontSize="large" color="info" />
            </IconButton>
            <IconButton onClick={() => handleOthers(goProvider)}>
              <Google fontSize="large" color="warning" />
            </IconButton>
          </Stack>
          <Typography variant="body1" sx={{ textAlign: 'center', fontWeight: 100, margin: '10px 0px' }}>
            Sign Up via Facebook or Google
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
