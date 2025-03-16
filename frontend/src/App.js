import './App.css';
import {useState, useRef, useEffect} from 'react';
import WordRow  from './components/WordRow';
import axios from 'axios';

import toast, { Toaster } from 'react-hot-toast';
import defaultWordList from './helpers/defaultWordList';

import AlertDialog from './components/AlertDialog'

import coreLogic from './helpers/coreLogic';

import checkValidity from './helpers/checkValidity';

import config from './helpers/config';



function App() {

  const [wordOfSession, setWordOfSession] = useState('');
  const [wordList, setWordList] = useState(defaultWordList);
  const [reset, toggleReset] = useState(false)
  const [verdict, setVerdict] = useState({isDone: false, won: false, index: -1});
  const [showStats, setShowStats] = useState(false);

  const wordMap = useRef(new Map());

  const {API_BASE_URI, BACKEND_PORT} = config;

  useEffect(()=>{
    document.body.style.overflow = "hidden"
    setWordList(defaultWordList);
    wordMap.current.clear();
    axios.get(`/api/api/getRandomWord`)
      .then((res) => {
          console.log(res.data.word);
          setWordOfSession(res.data.word);
          let wordArray = res.data.word.split('')
          for(let i=0; i<5;i++){
            if(wordMap.current.has(wordArray[i])){
              wordMap.current.set(wordArray[i],[...wordMap.current.get(wordArray[i]),i])
            }
            else{
              wordMap.current.set(wordArray[i],[i]);
            }
          }
        });
  },[reset])

  useEffect(() => { //fix height in mobile devices with virtual keyboards
    const setAppHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    setAppHeight(); // Set height on load
    window.addEventListener('resize', setAppHeight); // Adjust on resize

    return () => window.removeEventListener('resize', setAppHeight); // Cleanup
  }, []);

  const resetGame = () => {
      setVerdict({ isDone: false, won: false, index: -1 });
      setWordOfSession('');  // Clear the current word
      setWordList(defaultWordList); // Reset the word list
      wordMap.current.clear(); // Ensure map resets properly
      toggleReset((prevState) => !prevState); // Still toggle state to force re-render
  }

  
  const updateWordList = async (index, newWord) => {
    let response = await checkValidity(newWord);
    const{isValid} = response;
    if(isValid){
      let res = coreLogic(newWord, wordMap.current);
      let {isRightAnswer, data} = res;

      setWordList((prevWordList) =>
        prevWordList.map((wordObject, i) => {
          if (i === index) {
            return {
              ...data,
            };
          } else if (i === index + 1 && !isRightAnswer) {
            return { ...wordObject, status: new Array(5).fill('white'), isCurrentWord: true }; // Activate the next word
          }
          return wordObject;
        })
      );
      if(isRightAnswer){
        setVerdict({isDone: true, won: true, index: index});
      }
      else if(index === 5){
        setVerdict({isDone: true, won: false, index: index});
      }
    }
    else{
      toast(`Come on! We both know that's not a real word 😒`)
    }
  };

  return (
    <>
      <Toaster
        position="top-center" 
        containerStyle={{
          position: "fixed",  // Ensures it stays at the top of the screen
          top: "20px",        // Adjust based on preference
          zIndex: 9999,       // Keeps it above other elements
        }}
      />
      <div className="App">
      {verdict.isDone && (
          <AlertDialog 
            key={verdict.index} 
            won={verdict.won} 
            word={wordOfSession} 
            resetGame={resetGame} 
            wordList={wordList} 
            index={verdict.index} 
            openModal={showStats}  // Now controlled by `showStats`
            setShowStats={setShowStats} // Pass down setter
          />
        )}

        <header className="App-header">

          <p className='typewriter'>!Wordle</p>
          <div className='btnParent'>
            <button className='btnReset' onClick={()=>resetGame()}>🔄 Reset Game</button>
            <button className='btnStats' disabled={!verdict.isDone} onClick={() => {
                    setShowStats(true); // Open the modal manually
                }}>📊 View Stats</button>

          </div>
          <>
          <table>
            <tbody>
              {wordList.map((wordDetails,i) => (
                <WordRow rowKey={i} wordDetails={wordDetails} updateWordList={updateWordList}/>
              ))}
            </tbody>
          </table>
          </>
        </header>
      </div>
    </>
  );
}

export default App;
