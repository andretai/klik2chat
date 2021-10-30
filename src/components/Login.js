import React from 'react'
// auth
import { auth, db } from '../config/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { FacebookAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from '@firebase/auth'
// styling
import { Box } from '@mui/system'
import { Button, IconButton, Modal, Stack, TextField, Typography } from '@mui/material'
import { Facebook, Google } from '@mui/icons-material'

const saved_numbers = collection(db, "saved_numbers")

const fbProvider = new FacebookAuthProvider()
const goProvider = new GoogleAuthProvider()

const Login = props => {

  const { loginModal, toggleLoginModal, handleRegister, handleReset, numbers, setNumbers, setUsername } = props

  const [email, setEmail] = React.useState()
  const [password, setPassword] = React.useState()

  const handleSubmit = e => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
      .then(async credentials => {
        toggleLoginModal(false)
        let user = credentials.user
        let docs = []
        const q = query(saved_numbers, where("user_id", "==", user.uid))
        const qSnap = await getDocs(q)
        qSnap.forEach(snap => {
          let data = snap.data()
          console.log(data)
          docs.push(data)
        })
        docs.sort((a, b) => b.created_at - a.created_at)
        setNumbers(docs)
        console.log(numbers)
        if (user.displayName) {
          setUsername(user.displayName)
        }
      })
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
          console.log(data)
          docs.push(data)
        })
        docs.sort((a, b) => b.created_at - a.created_at)
        setNumbers(docs)
        console.log(numbers)
        toggleLoginModal(false)
        if (user.displayName) {
          setUsername(user.displayName)
        }
      })
      .catch(err => {
        console.log('Social SignIn Err:', err)
      })
  }

  return (
    <Modal 
      open={loginModal}
      onClose={() => toggleLoginModal(false)}
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
          Login to Your Account
        </Typography>
        <Typography 
          variant="body1" 
          color="GrayText" 
          sx={{ textAlign: 'center', fontWeight: 100, marginBottom: '30px' }}
        >
          Don't have an account? <Button onClick={() => handleRegister()} type="button">Sign up for free</Button>
        </Typography>
        <form onSubmit={handleSubmit}>
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
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={() => handleReset()} variant="text" color="inherit" sx={{ marginBottom: '15px' }}>Forgot password?</Button>
          </Box>
          <Button 
            variant="contained"
            type="submit"
            sx={{ width: '100%', color: '#fff' }}
          >
            login
          </Button>
        </form>
        <Stack direction="row" sx={{ marginTop: '15px', fontWeight: 100 }}>
          <hr></hr>
          {/* <Typography variant="body1" >or</Typography> */}
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
          Sign In via Facebook or Google
        </Typography>
      </Box>
    </Modal>
  )
}

export default Login
