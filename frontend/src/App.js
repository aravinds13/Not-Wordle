import './App.css';
import {useState, useRef, useEffect} from 'react';
import WordRow  from './components/WordRow';
import axios from 'axios';

import toast, { Toaster } from 'react-hot-toast';
import stockValues from './helpers/stockValues';

import AlertDialog from './components/AlertDialog'

import coreLogic from './helpers/coreLogic';

import checkValidity from './helpers/checkValidity';

import config from './helpers/config';

import Keyboard from './components/Keyboard';



function App() {

  const {defaultWordList, defaultCharStatus} = stockValues;

  const [wordOfSession, setWordOfSession] = useState('');
  const [wordList, setWordList] = useState(defaultWordList);
  const [reset, toggleReset] = useState(false)
  const [verdict, setVerdict] = useState({isDone: false, won: false, index: -1});
  const [showStats, setShowStats] = useState(false);

  const wordMap = useRef(new Map());
  const [charStatus, setCharStatus] = useState({...defaultCharStatus});

  const [currentWord, updateCurrentWord] = useState('');
  const [currentRow, updateCurrentRow] = useState(0);

  const {API_BASE_URI, BACKEND_PORT} = config;


  const handleKeyPress = (key) => {
    if(key === "Enter"){
      if(currentWord.length===5){
        updateWordList(currentRow,currentWord)
      }
    }
    else if((/[A-Z]/).test(key)){
      updateCurrentWord((prevState) => prevState.length<5 ? prevState+=key : prevState);
    }
    else if(key === "⌫"){
      updateCurrentWord((prevState) => prevState.slice(0,-1));
    }
  }

  useEffect(()=>{
    document.body.style.overflow = "hidden"
    setWordList(defaultWordList);
    wordMap.current.clear();
    axios.get(`/api/api/getRandomWord`)
      .then((res) => {
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
      updateCurrentRow(0)
      updateCurrentWord('')
      toggleReset((prevState) => !prevState); // Still toggle state to force re-render
      setCharStatus({...defaultCharStatus}); 
  }

  
  const updateWordList = async (index, newWord) => {
    let response = await checkValidity(newWord);
    const{isValid} = response;
    if(isValid){
      
      let res = coreLogic(newWord, wordMap.current, charStatus);
      let {isRightAnswer, data, charStatusLocal} = res;

      setCharStatus(charStatusLocal);
      setWordList((prevWordList) =>
        prevWordList.map((wordObject, i) => {
          if (i === currentRow) {
            return {
              ...data,
            };
          } else if (i === currentRow + 1 && !isRightAnswer) {
            return { ...wordObject, status: new Array(5).fill('black'), isCurrentWord: true }; // Activate the next word
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
      else{
        updateCurrentRow((prevState) => prevState+=1)
        updateCurrentWord((prevState) => '')
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

          <div className='btnParent'>
            <div className='typewriter'>!Wordle</div>
            <button className='btnReset' onClick={()=>resetGame()}>🔄 Reset</button>
            {verdict.isDone && (
              <button className='btnStats' disabled={!verdict.isDone} onClick={() => {
                setShowStats(true); // Open the modal manually
              }}>📊 Stats</button>
            )}

          </div>
          <>
          <table>
            <tbody>
              {wordList.map((wordDetails,i) => (
                <WordRow rowKey={i} wordDetails={wordDetails} updateWordList={updateWordList} currentWord={currentWord}/>
              ))}
            </tbody>
          </table>
          </>
          <Keyboard onKeyPress={handleKeyPress} charStatus={charStatus}/>
        </header>
      </div>
    </>
  );
}

export default App;
