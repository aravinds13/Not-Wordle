import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxWidth: '80vw'
};

export default function TransitionsModal(props) {
  const {won, word, resetVerdict, handleToggleReset, wordList, index} = props;
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
    resetVerdict()
    handleToggleReset()
  };

  

  let title = won ? 'Hooray! 👏🏻' : 'Not your day, I guess 😕'
  let text = won ? `You won!\nWord for the current session: ${word}.\nDo you wanna go another round?` : `Dang it! :/\nWord for the current session: ${word}\nBetter luck next time.\nDo you wanna try again?`

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              {title}
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }} component="pre">
              {text}
            </Typography>
            <Typography id="transition-modal-stats" sx={{ mt: 2 }} component="pre">
              {generateStatMatrix(won,wordList,index)}
            </Typography>
            <Typography><Button onClick={() => handleClose}/></Typography>
            
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

const generateStatMatrix = (won,wordList, index) => {
  let matrix = '';

  for(let i=0; i<=index; i++){
    for(let j=0; j<5;j++){
      switch(wordList[i].status[j]){
        case "#2c9425":
          matrix+='🟩 '
          break;
        case "#b4a03b":
          matrix+='🟨 '
          break;
        default:
          matrix+='⬜️ '
      }
    }
    matrix+='\n'
  }
  let stats = `Stats: ${won ? index+1 : 'X'} / 6\n${matrix}`;

  return stats;
}  
