import React from 'react'
import { auth } from '../config/firebase'
import { sendPasswordResetEmail } from '@firebase/auth'
import { Button, Modal, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'

const Reset = props => {

  const { resetModal, toggleResetModal } = props

  const [email, setEmail] = React.useState()

  const handleSubmit = e => {
    e.preventDefault()
    var actionCodeSettings = {
      url: 'http://klik2chat.atechs.com.my/',
      handleCodeInApp: true
    }
    sendPasswordResetEmail(auth, email, actionCodeSettings)
      .then(function () {
        alert(`The password reset link has been sent to ${email}.`)
        toggleResetModal(false)
      })
      .catch(err => console.log(err))
  }

  return (
    <Modal
      open={resetModal}
      onClose={() => toggleResetModal(false)}
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
          Reset Password
        </Typography>
        <Typography 
          variant="body1" 
          color="GrayText" 
          sx={{ textAlign: 'center', fontWeight: 100, marginBottom: '30px' }}
        >
          Enter the email you used to create the account.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            onChange={({target}) => setEmail(target.value)}
            sx={{ width: '100%', marginBottom: '15px' }}
          />
          <Button variant="contained" color="warning" type="submit" sx={{ display: 'block', width: '100%', marginBottom: '10px' }}>Send</Button>
        </form>
      </Box>
    </Modal>
  )
}

export default Reset
