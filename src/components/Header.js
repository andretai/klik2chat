import React from 'react'
// nested components
import Saved from './Saved'
// styling
import { Box } from '@mui/system'
import { AppBar, Button, IconButton, Stack, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Menu, WhatsApp } from '@mui/icons-material'

const Header = props => {

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const { login, logout, toggleDrawer, handleLogin, handleRegister, numbers, fetchSavedNumbers, handleSubmitSavedNumber, handleDeleteSavedNumber } = props

  const [saved, toggleSaved] = React.useState(false)

  return (
    <Box sx={{ paddingTop: '60px' }}>
      <AppBar sx={{ background: 'transparent', boxShadow: 'none' }}>
        <Box>
          <Toolbar>
            <IconButton>
              <WhatsApp fontSize="large" color="primary" />
              <Typography variant="body1" sx={{ fontWeight: 100, marginLeft: '5px' }}>Klik2Chat</Typography>
            </IconButton>
            <Box sx={{ flexGrow: 1 }}></Box>
            {
              isMobile ? 
                <IconButton onClick={() => toggleDrawer(true)}>
                  <Menu />
                </IconButton> 
                : 
                <>
                  {
                    login ?
                    <Stack direction="row" spacing={2}>
                      <Button 
                        onClick={() => toggleSaved(true)} 
                        variant="outlined" 
                        color="secondary"
                      >
                        saved list
                      </Button>
                      <Button 
                        onClick={() => logout()} 
                        variant="contained" 
                        color="secondary" 
                        sx={{ color: '#fff' }}
                      >
                        sign out
                      </Button>
                    </Stack>
                    :
                    <Stack direction="row" spacing={2}>
                      <Button 
                        onClick={() => handleLogin()} 
                        variant="outlined" 
                        color="secondary"
                      >
                        login
                      </Button>
                      <Button 
                        onClick={() => handleRegister()} 
                        variant="contained" 
                        color="secondary" 
                        sx={{ color: '#fff' }}
                      >
                        signup
                      </Button>
                    </Stack>
                  }
                </>
            }
          </Toolbar>
        </Box>
      </AppBar>
      <Box sx={isMobile ? { marginTop: '60px' } : { marginTop: '60px', padding: '0px 60px' }}>
        <Typography variant="h5" sx={{ fontWeight: 1000, marginBottom: '30px' }}>Chat with someone on WhatsApp without having their phone number saved.</Typography>
        <Typography variant="body1" sx={{ fontWeight: 100 }}>Just fill in the phone number including the international code but without the + sign.</Typography>
      </Box>
      <Saved 
        saved={saved} 
        toggleSaved={toggleSaved} 
        numbers={numbers} 
        fetchSavedNumbers={fetchSavedNumbers}
        handleSubmitSavedNumber={handleSubmitSavedNumber}
        handleDeleteSavedNumber={handleDeleteSavedNumber}
      />
    </Box>
  )
}

export default Header
