import React from 'react'
import Header from './components/Header';
import Form from './components/Form';
import { auth, db } from './config/firebase'
import { collection, deleteDoc, getDocs, query, where } from 'firebase/firestore'
import { Box } from '@mui/system'
import { Button, Card, CardHeader, Container, IconButton, Stack, SwipeableDrawer, Typography } from '@mui/material'
import { Delete, SendToMobile } from '@mui/icons-material'
import Login from './components/Login';
import Register from './components/Register';

const saved_numbers = collection(db, "saved_numbers")

function App() {

  const [drawer, toggleDrawer] = React.useState(false)
  const [loginModal, toggleLoginModal] = React.useState(false)
  const [registerModal, toggleRegisterModal] = React.useState(false)
  const [login, setLogin] = React.useState()
  const [numbers, setNumbers] = React.useState([])

  // Functions

  const fetchSavedNumbers = async () => {
    let docs = []
    const q = query(saved_numbers, where("user_id", "==", auth.currentUser.uid))
    const qSnap = await getDocs(q)
    qSnap.forEach(snap => {
      let data = snap.data()
      docs.push(data)
    })
    docs.sort((a, b) => b.created_at - a.created_at)
    setNumbers(docs)
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

  const handleDeleteSavedNumber = async (numberOnly) => {
    const nums = numbers.filter(number => {
      return number.number !== numberOnly
    })
    const q = query(saved_numbers, where("number", "==", numberOnly))
    const qSnap = await getDocs(q)
    qSnap.forEach(snap => {
      deleteDoc(snap.ref)
    })
    setNumbers(nums)
    console.log(numbers)
  }

  // Auth

  auth.onAuthStateChanged(async user => {
    return user ? setLogin(true) : setLogin(false)
  })

  const logout = () => {
    toggleDrawer(false)
    auth.signOut()
  }


  return (
    <Container maxWidth="sm">
      <Header 
        login={login} 
        logout={logout} 
        toggleDrawer={toggleDrawer} 
        handleLogin={handleLogin} 
        handleRegister={handleRegister} 
        numbers={numbers}
        setNumbers={setNumbers}
        fetchSavedNumbers={fetchSavedNumbers}
        handleSubmitSavedNumber={handleSubmitSavedNumber}
        handleDeleteSavedNumber={handleDeleteSavedNumber}
      />
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
      <SwipeableDrawer anchor="right" open={drawer} onClose={() => toggleDrawer(false)}>
        <Box sx={{ padding: '15px' }}>
          {
            login ?
            <>
              <Button onClick={() => logout()} variant="contained" color="secondary" sx={{ color: '#fff', width: '100%', marginBottom: '15px' }}>sign out</Button>
              <Button onClick={() => fetchSavedNumbers()} variant="outlined" color="secondary" sx={{ width: '100%' }}>view saved numbers</Button>
                {
                  numbers.length === 0 ?
                  <Box sx={{ marginTop: '15px', display: 'flex' }} justifyContent="center">
                    <Typography sx={{ width: `180px`, textAlign: 'center' }}>Your saved numbers will be shown here.</Typography>
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
                    )
                  })
                }
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
              <Box sx={{ marginTop: '15px', display: 'flex' }} justifyContent="center">
                <Typography sx={{ width: `180px`, textAlign: 'center' }}>Sign up to save numbers here for easy access.</Typography>
              </Box>
            </>
          }
        </Box>
      </SwipeableDrawer>
    </Container>
  )
}

export default App;
