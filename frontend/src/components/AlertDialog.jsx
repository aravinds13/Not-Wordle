import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog(props) {

    const {won, word, resetGame, wordList, index, openModal,setShowStats} = props;
    const [open, setOpen] = React.useState(true);

    React.useEffect(() => {
      if (openModal) {
          setOpen(true); // Only open the dialog when the game ends
      }
  }, [openModal]);

    const handleNoClose = () => {
        setOpen(false);
        setShowStats(false); // Ensure modal stays closed
    };

    const handleYesClose = () => {
        setOpen(false);
        setShowStats(false); // Ensure modal stays closed
        resetGame();  // Reset only when "Let's go!" is clicked
    };

    let title = won ? 'Bingo! 👏🏻' : 'Not your day, I guess 😕'
    let textTop = won ? `You won!\n` : `Dang it! :/`
    let textBottom = won ? `\nDo you wanna go another round?` : `\nBetter luck next time.\nDo you wanna try again?`
    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleNoClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {title}
                </DialogTitle>
                <DialogContent>
                  <Typography id="transition-modal-description" sx={{ mt: 2 }} component="pre">
                    {textTop}
                    <span>
                      Word for the current session: <b>{word}</b>
                    </span>
                    {textBottom}
                  </Typography>
                  <Typography id="transition-modal-stats" sx={{ mt: 2 }} component="pre">
                    {generateStatMatrix(won,wordList,index)}
                  </Typography>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleNoClose}>Nah</Button>
                <Button onClick={handleYesClose} autoFocus>
                    Let's go!
                </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
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
