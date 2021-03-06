import React from 'react'
// auth
import { auth, db } from './config/firebase'
import { collection, deleteDoc, getDocs, query, where } from 'firebase/firestore'
// nested components
import Header from './components/Header';
import Form from './components/Form';
import Login from './components/Login';
import Register from './components/Register';
// styling
import { Box } from '@mui/system'
import { Button, Card, CardHeader, Grid, IconButton, Link, Stack, SwipeableDrawer, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Delete, SendToMobile } from '@mui/icons-material'
import Reset from './components/Reset';
import Popup from './components/Popup';

const saved_numbers = collection(db, "saved_numbers")

function App() {

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // states

  const [drawer, toggleDrawer] = React.useState(false)
  const [loginModal, toggleLoginModal] = React.useState(false)
  const [registerModal, toggleRegisterModal] = React.useState(false)
  const [resetModal, toggleResetModal] = React.useState(false)
  const [popModal, togglePopModal] = React.useState(true)
  const [login, setLogin] = React.useState()
  const [numbers, setNumbers] = React.useState([])
  const [username, setUsername] = React.useState()

  // functions

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
    auth.onAuthStateChanged(async user => {
      console.log('authstatechanged')
      return user ? setLogin(true) : setLogin(false)
    })
  }

  const handleRegister = () => {
    toggleDrawer(false)
    toggleLoginModal(false)

    toggleRegisterModal(true)
    auth.onAuthStateChanged(async user => {
      console.log('authstatechanged')
      return user ? setLogin(true) : setLogin(false)
    })
  }

  const handleReset = () => {
    toggleDrawer(false)
    toggleLoginModal(false)
    toggleRegisterModal(false)
    toggleResetModal(true)
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

  // auth.onAuthStateChanged(async user => {
  //   console.log('authstatechanged')
  //   return user ? setLogin(true) : setLogin(false)
  // })

  const logout = () => {
    toggleDrawer(false)
    setUsername()
    auth.signOut()
  }


  return (
    <>
      <Header 
        login={login} 
        logout={logout} 
        toggleDrawer={toggleDrawer} 
        handleLogin={handleLogin} 
        handleRegister={handleRegister} 
        numbers={numbers}
        fetchSavedNumbers={fetchSavedNumbers}
        handleSubmitSavedNumber={handleSubmitSavedNumber}
        handleDeleteSavedNumber={handleDeleteSavedNumber}
        username={username}
      />
      <Grid container sx={{ paddingTop: '60px' }}>
        <Grid item xs={0} sm={2} md={4}></Grid>
        <Grid item xs={12} sm={8} md={4}>
          <Box sx={{ padding: '0px 25px' }}>
            <Typography variant="h5" sx={{ fontWeight: 1000, marginBottom: '30px' }}>Chat with someone on WhatsApp without having their phone number saved.</Typography>
            <Typography variant="body1" sx={{ fontWeight: 100 }}>Just fill in the phone number including the international code but without the + sign.</Typography>
          </Box>
          <Form login={login} />
        </Grid>
        <Grid item xs={0} sm={2} md={4}></Grid>
      </Grid>
      <Login 
        loginModal={loginModal} 
        toggleLoginModal={toggleLoginModal}
        handleRegister={handleRegister}
        handleReset={handleReset}
        numbers={numbers}
        setNumbers={setNumbers}
        setUsername={setUsername}
      />
      <Register 
        registerModal={registerModal} 
        handleLogin={handleLogin} 
        toggleRegisterModal={toggleRegisterModal} 
        numbers={numbers}
        setNumbers={setNumbers}
        setUsername={setUsername}
      />
      <Reset
        resetModal={resetModal}
        toggleResetModal={toggleResetModal}
      />
      {/* <Popup
        popModal={popModal}
        togglePopModal={togglePopModal}
      /> */}
      <SwipeableDrawer 
        anchor="right" 
        open={drawer} 
        onClose={() => toggleDrawer(false)} 
        onOpen={() => toggleDrawer(true)}
      >
        <Box sx={{ padding: '15px' }}>
          {
            login ?
            <>
              <Button 
                onClick={() => logout()} 
                variant="contained" 
                color="secondary" 
                sx={{ color: '#fff', width: '100%', marginBottom: '15px' }}
              >
                sign out
              </Button>
              <Button 
                onClick={() => fetchSavedNumbers()} 
                variant="outlined" 
                color="secondary" 
                sx={{ width: '100%' }}
              >
                view saved numbers
              </Button>
                {
                  numbers.length === 0 ?
                  <Box sx={{ marginTop: '15px', textAlign: 'center' }} justifyContent="center">
                    {/* <Typography variant="h6" sx={{ width: `180px`, margin:'auto', marginBottom: '5px', fontWeight: 1000 }}>Hello, {username ? username : 'user'}!</Typography> */}
                    <Typography variant="body1" sx={{ width: `180px`, margin:'auto' }}>Your saved numbers will be shown here.</Typography>
                  </Box>
                  :
                  numbers.map((number, index) => {
                    return (
                      <Card key={index} sx={{ width: '100%', margin: '15px 0px' }}>
                        <CardHeader
                          avatar={
                            <IconButton 
                              onClick={() => handleSubmitSavedNumber(number.number)} 
                              variant="text" 
                              type="button" 
                              color="secondary"
                            >
                              <SendToMobile color="success" />
                            </IconButton>
                          }
                          action={
                            <IconButton 
                              onClick={() => handleDeleteSavedNumber(number.number)} 
                              variant="text" 
                              type="button" 
                              color="secondary"
                            >
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
      <Typography sx={{ marginBottom: '30px', textAlign: 'center'}}>Find us on <Link href="https://www.facebook.com/atechs.com.my" target="_blank" underline="none" sx={{ fontWeight: 1000 }}>Facebook</Link>.</Typography>
    </>
  )
}

export default App;
