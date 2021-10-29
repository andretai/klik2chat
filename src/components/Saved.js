import React from 'react'
import { Button, Card, CardHeader, IconButton, Modal, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Delete, SendToMobile } from '@mui/icons-material'

const Saved = props => {

  const { saved, toggleSaved, numbers, setNumbers, fetchSavedNumbers, handleSubmitSavedNumber, handleDeleteSavedNumber } = props

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
        <Button onClick={() => fetchSavedNumbers()} variant="outlined" color="secondary" sx={{ width: '100%' }}>update saved numbers</Button>
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
      </Box>
    </Modal>
  )
}

export default Saved
