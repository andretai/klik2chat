import React from 'react'
import { auth, db } from '../config/firebase'
import { createUserWithEmailAndPassword } from '@firebase/auth'
import { Box } from '@mui/system'
import { Button, Modal, Stack, TextField, Typography } from '@mui/material'

const Register = props => {

  const { registerModal, handleLogin, toggleRegisterModal } = props

  const [name, setName] = React.useState()
  const [email, setEmail] = React.useState()
  const [password, setPassword] = React.useState()
  const [confirm, setConfirm] = React.useState()

  const handleSubmit = e => {
    e.preventDefault()
    createUserWithEmailAndPassword(auth, email, password)
      .then(async credentials => {
        toggleRegisterModal(false)
      })
  }

  return (
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
          padding: '15px'
        }}
      >
        <Typography variant="h5" color="secondary" sx={{ textAlign: 'center', fontWeight: 1000, marginBottom: '30px' }}>
          Create Free Account
        </Typography>
        <Typography variant="body1" color="GrayText" sx={{ textAlign: 'center', fontWeight: 100, marginBottom: '30px' }}>
          Sign up to save numbers for easy access.
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
        <Stack direction="row" sx={{ margin: '15px 0px', fontWeight: 100 }}>
          <hr></hr>
          {/* <Typography variant="body1" >or</Typography> */}
          <hr></hr>
        </Stack>
        <Button 
          onClick={() => handleLogin()}
          variant="outlined"
          type="button"
          sx={{ width: '100%', marginBottom: '15px' }}
        >
          login
        </Button>
      </Box>
    </Modal>
  )
}

export default Register
