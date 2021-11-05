import React from 'react'
import { Button, Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, IconButton, Link, Modal, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Close } from '@mui/icons-material'
import fbcover from '../images/fbcover820x360.png'

const Popup = props => {

  const { popModal, togglePopModal } = props
  const [rand, setRand] = React.useState(0)

  React.useEffect(() => {
    setRand(Math.floor(Math.random() * 3))    
  })

  const messages = [
    { title: 'Get a Professional Email', content: 'Send emails from addresses ending with your desired name!' },
    { title: 'Easy Website Design', content: 'Looking to digitalize your business? We help design landing pages!' },
    { title: 'Bring Your Site Online', content: 'Designed a website yourself? We\'ll help you deploy it!' }
  ]

  return (
    <Modal
      open={popModal}
      onClose={() => togglePopModal(false)}
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
        <Card elevation={0}>
          <CardHeader
            title={<Typography variant="h5" sx={{ fontWeight: 1000, textAlign: 'center' }}>{messages[rand].title}</Typography>}
          />
          <CardMedia
            component="img"
            image={fbcover}
          />
          <CardContent>
            <Typography>{messages[rand].content}</Typography>
          </CardContent>
          <CardActions>
            <Typography variant="button" sx={{ color: 'blueviolet' }}>Talk to us on <Link href="https://www.facebook.com/atechs.com.my" target="_blank" underline="none" sx={{ fontWeight: 1000 }}>Facebook</Link>.</Typography>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  )
}

export default Popup
