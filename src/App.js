import React from 'react'
import Header from './components/Header';
import Form from './components/Form';
import { Box } from '@mui/system'
import { Button, Container, Drawer, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material'
import { AccountCircle } from '@mui/icons-material'

function App() {

  const [drawer, toggleDrawer] = React.useState(true)
  const [loggedIn, setLoggedIn] = React.useState(true)

  const users = [
    { nickname: 'user1', phonenumber: '6012345687' },
    { nickname: 'user1', phonenumber: '6012345687' },
    { nickname: 'user1', phonenumber: '6012345687' }
  ]

  console.log(window.innerWidth / 2)

  return (
    <Container maxWidth="sm">
      <Header toggleDrawer={toggleDrawer} />
      <Form loggedIn={loggedIn} />
      <Drawer anchor="right" open={drawer} onClose={() => toggleDrawer(false)}>
        <Box sx={{ padding: '15px' }}>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="secondary" sx={{ width: '100%' }}>login</Button>
            <Button variant="contained" color="secondary" sx={{ color: '#fff', width: '100%' }}>signup</Button>
          </Stack>
          <List sx={{ width: `180px`}}>
            {
              loggedIn ?
              users.map((user, index) => <ListItem key={index}>
                <ListItemAvatar><AccountCircle /></ListItemAvatar>
                <ListItemText primary={user.nickname} secondary={user.phonenumber} />
              </ListItem>)
              :
              <Box sx={{ width: `180px` }}>
                <Typography>Sign up to save numbers here for easy access.</Typography>
              </Box>
            }
          </List>
        </Box>
      </Drawer>
    </Container>
  );
}

export default App;
