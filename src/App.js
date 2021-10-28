import React from 'react'
import Header from './components/Header';
import Form from './components/Form';
import { auth, db } from './config/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Box } from '@mui/system'
import { Avatar, Button, Card, CardHeader, Container, Drawer, IconButton, List, ListItem, ListItemAvatar, ListItemText, Modal, Stack, TextField, Typography } from '@mui/material'
import { AccountCircle, Delete, SendToMobile } from '@mui/icons-material'
import Login from './components/Login';
import Register from './components/Register';

const saved_numbers = collection(db, "saved_numbers")

function App() {

  const [drawer, toggleDrawer] = React.useState(false)
  const [loginModal, toggleLoginModal] = React.useState(false)
  const [registerModal, toggleRegisterModal] = React.useState(false)
  const [login, setLogin] = React.useState()
  const [numbers, setNumbers] = React.useState([])

  const fetchSavedNumbers = async () => {
    let docs = []
    const q = query(saved_numbers, where("user_id", "==", auth.currentUser.uid))
    const qSnap = await getDocs(q)
    qSnap.forEach(snap => {
      let data = snap.data()
      docs.push(data)
    })
    const res = await setNumbers(docs)
    console.log(numbers)
  }

  const handleLogin = () => {
    toggleDrawer(false)
    toggleRegisterModal(false)

    toggleLoginModal(true)
  }

  const handleRegister = () => {
    toggleDrawer(false)
    toggleLoginModal(false)

    toggleRegisterModal(true)
  }

  const handleSubmitSavedNumber = number => {
    let message = ""
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank')
    toggleDrawer(false)
  }

  const handleDeleteSavedNumber = number => {
    setNumbers(numbers.filter(saved_number => {
      return saved_number.number !== number.number
    }))
    console.log(numbers)
  }

  auth.onAuthStateChanged(async user => {
    return user ? setLogin(true) : setLogin(false)
  })

  const logout = () => {
    console.log(numbers)
    auth.signOut()
  }


  return (
    <Container maxWidth="sm">
      <Header toggleDrawer={toggleDrawer} handleLogin={handleLogin} handleRegister={handleRegister} />
      <Form login={login} />
      <Login 
        loginModal={loginModal} 
        toggleLoginModal={toggleLoginModal}
        handleRegister={handleRegister}
        numbers={numbers}
        setNumbers={setNumbers}
      />
      <Register 
        registerModal={registerModal} 
        handleLogin={handleLogin} 
        toggleRegisterModal={toggleRegisterModal} 
      />
      <Drawer anchor="right" open={drawer} onClose={() => toggleDrawer(false)}>
        <Box sx={{ padding: '15px' }}>
          {
            login ?
            <>
              <Button onClick={() => logout()} variant="contained" color="secondary" sx={{ color: '#fff', width: '100%', marginBottom: '15px' }}>sign out</Button>
              <Button onClick={() => fetchSavedNumbers()} variant="outlined" color="secondary" sx={{ width: '100%' }}>saved numbers</Button>
              <List>
                {
                  numbers.length === 0 ?
                  <Box sx={{ width: `180px` }}>
                    <Typography>Your saved numbers will be shown here.</Typography>
                  </Box>
                  :
                  numbers.map((number, index) => {
                    return (
                      <Card key={index} sx={{ width: '100%', margin: '15px 0px' }}>
                        <CardHeader
                          avatar={
                            <IconButton onClick={() => handleSubmitSavedNumber(number.number)} variant="text" type="button" color="secondary">
                              <SendToMobile color="success" />
                            </IconButton>
                          }
                          action={
                            <IconButton onClick={() => handleDeleteSavedNumber(number.number)} variant="text" type="button" color="secondary">
                              <Delete color="warning" />
                            </IconButton>
                          }
                          title={number.nickname}
                          subheader={number.number}
                        />
                      </Card>
                      // <ListItem
                      //   secondaryAction={
                      //     <IconButton edge="end">
                      //       <Delete />
                      //     </IconButton>
                      //   }
                      // >
                      //   <Button key={index} onClick={() => handleSubmitSavedNumber(user.number)} variant="text" type="button" color="secondary">
                      //     <ListItemAvatar><AccountCircle /></ListItemAvatar>
                      //   </Button>
                      //   <ListItemText primary={user.nickname} secondary={user.number} />                        
                      // </ListItem>
                    )
                  })
                }
              </List>
            </>
            :
            <>
              <Stack direction="row" spacing={1}>
                <Button 
                  onClick={handleLogin} 
                  variant="outlined" 
                  color="secondary" 
                  sx={{ width: '100%' }}
                >
                  login
                </Button>
                <Button 
                  onClick={handleRegister} 
                  variant="contained" 
                  color="secondary" 
                  sx={{ color: '#fff', width: '100%' }}
                >
                  signup
                </Button>
              </Stack>
              <Box sx={{ width: `180px` }}>
                <Typography>Sign up to save numbers here for easy access.</Typography>
              </Box>
            </>
          }
        </Box>
      </Drawer>
    </Container>
  )
}

export default App;
