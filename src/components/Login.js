import React from 'react'
import { auth, db } from '../config/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Box } from '@mui/system'
import { Button, Modal, Stack, TextField, Typography } from '@mui/material'
import { Facebook, Google } from '@mui/icons-material'
import { signInWithEmailAndPassword } from '@firebase/auth'

const saved_numbers = collection(db, "saved_numbers")

const Login = props => {

  const { loginModal, toggleLoginModal, handleRegister, numbers, setNumbers } = props

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
        setNumbers(docs)
        console.log(numbers)
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
          padding: '15px'
        }}
      >
        <Typography variant="h5" color="secondary" sx={{ textAlign: 'center', fontWeight: 1000, marginBottom: '30px' }}>
          Login to Your Account
        </Typography>
        <Typography variant="body1" color="GrayText" sx={{ textAlign: 'center', fontWeight: 100, marginBottom: '30px' }}>
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
            sx={{ width: '100%', marginBottom: '30px' }}
          />
          <Button 
            variant="contained"
            type="submit"
            sx={{ width: '100%', color: '#fff' }}
          >
            login
          </Button>
        </form>
        <Stack direction="row" sx={{ margin: '15px 0px', fontWeight: 100 }}>
          <hr></hr>
          {/* <Typography variant="body1" >or</Typography> */}
          <hr></hr>
        </Stack>
        <Stack direction="row" spacing={3} justifyContent="center" sx={{ marginBottom: '15px' }}>
          <Facebook fontSize="large" color="info" />
          <Google fontSize="large" color="warning" />
        </Stack>
      </Box>
    </Modal>
  )
}

export default Login
