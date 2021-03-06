import React from 'react'
// styling
import { Box } from '@mui/system'
import { Button, Card, CardHeader, IconButton, Modal, Typography } from '@mui/material'
import { Delete, SendToMobile } from '@mui/icons-material'

const Saved = props => {

  const { saved, toggleSaved, numbers, fetchSavedNumbers, handleSubmitSavedNumber, handleDeleteSavedNumber, username } = props

  return (
    <Modal
      open={saved}
      onClose={() => toggleSaved(false)}
    >
      <Box
        sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          bgcolor: 'background.paper',
          width: '390px',
          padding: '30px',
          borderRadius: 3
        }}
      >
        <Button 
          onClick={() => fetchSavedNumbers()} 
          variant="outlined" 
          color="secondary" 
          sx={{ width: '100%' }}
        >
          update saved numbers
        </Button>
        {/* <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '10px', fontWeight: 500 }}>Hello, {username ? username : 'user'}!</Typography> */}
        {
          numbers.length === 0 ?
          <Box sx={{ marginTop: '15px', textAlign: 'center' }} justifyContent="center">
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
      </Box>
    </Modal>
  )
}

export default Saved
