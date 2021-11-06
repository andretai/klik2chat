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
          // console.log(data)
          docs.push(data)
        })
        docs.sort((a, b) => b.created_at - a.created_at)
        setNumbers(docs)
        // console.log(numbers)
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
          // console.log(data)
          docs.push(data)
        })
        docs.sort((a, b) => b.created_at - a.created_at)
        setNumbers(docs)
        // console.log(numbers)
        toggleLoginModal(false)
        if (user.displayName) {
          setUsername(user.displayName)
        }
      })
      .catch(err => {
        // console.log('Social SignIn Err:', err)
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
          padding: '30px 15px',
          borderRadius: 3
        }}
      >
        <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 300, margin: '10px 0px' }}>
          Sign In via Facebook or Google
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
          Don't have an account? <Button onClick={() => handleRegister()} type="button" color="secondary"><Typography variant="body1" sx={{ textTransform: 'uppercase', fontWeight: 1000 }}>Sign up for free</Typography></Button>
        </Typography>
      </Box>
    </Modal>
  )
}

export default Login
