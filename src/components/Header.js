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

  const { login, logout, toggleDrawer, handleLogin, handleRegister, numbers, fetchSavedNumbers, handleSubmitSavedNumber, handleDeleteSavedNumber, username } = props

  const [saved, toggleSaved] = React.useState(false)

  return (
    <Box sx={{ paddingTop: '60px' }}>
      <AppBar position="absolute" sx={{ background: 'transparent', boxShadow: 'none' }}>
        <Box>
          <Toolbar>
            <IconButton>
              <WhatsApp fontSize="large" color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 400, marginLeft: '5px' }}>Klik2Chat</Typography>
              <Typography variant="caption" sx={{ marginLeft: '5px' }}> by ATS</Typography>
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
                    <Stack direction="row" spacing={1}>
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
                    <Stack direction="row" spacing={1}>
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
      <Saved 
        saved={saved} 
        toggleSaved={toggleSaved} 
        numbers={numbers} 
        fetchSavedNumbers={fetchSavedNumbers}
        handleSubmitSavedNumber={handleSubmitSavedNumber}
        handleDeleteSavedNumber={handleDeleteSavedNumber}
        username={username}
      />
    </Box>
  )
}

export default Header
