import { useState, useEffect } from "react";

const WordRow = (props) => {
  const { word, status, isCurrentWord } = props.wordDetails;
  const rowKey = props.rowKey;
  const updateWordList = props.updateWordList

  // Initialize wordArray with a default 5-character empty array if word is empty
  let wordArray = word.length === 0 ? new Array(5).fill("") : word.split("");

  // State should be updated if props change
  const [updatedWordArray, setUpdatedWordArray] = useState(wordArray);

  // Sync state when `word` prop changes
  useEffect(() => {
    setUpdatedWordArray(wordArray);
  }, [word]);

  useEffect(() => {
    let tabindex = `${rowKey}+${0}`;
    document.querySelector(`[tabindex="${tabindex}"]`).focus();
  },[status]);

  const onEnterPress = (e) => {
    if (e.keyCode === 13 && updatedWordArray.join('').length===5) {
      updateWordList(rowKey, updatedWordArray.join(''));
    }
  };

  const modifyWordArray = (e, index) => {
    const key = e.key; // Get the actual character pressed

    // Ensure it's a valid letter (A-Z, a-z) or backspace
    if (/^[a-zA-Z]$/.test(key) || e.keyCode === 8) {
      let val = e.keyCode === 8 ? '' : key.toUpperCase()
      if(val!=='' && index!==4){
        let tabindex = `${rowKey}+${index+1}`;
        document.querySelector(`[tabindex="${tabindex}"]`).focus();
      }
      if(val==='' && index>0 && updatedWordArray[index]===''){
        let tabindex = `${rowKey}+${index-1}`;
        document.querySelector(`[tabindex="${tabindex}"]`).focus();
      }
      setUpdatedWordArray((prevItems) =>
        prevItems.map((item, i) => (i === index ? val : item))
      );
    }
  };

  return (
    <tr onKeyDown={onEnterPress} key={rowKey}>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
      {updatedWordArray.map((_, i) => (
        <td key={i}>
          <input
            value={updatedWordArray[i]}
            type="text"
            maxLength="1"
            disabled={!isCurrentWord}
            style={{ backgroundColor: `${status[i]}`, color: `${isCurrentWord?'black':'white'}`}}
            tabIndex={`${rowKey}+${i}`}
            onKeyDown={(e) => modifyWordArray(e, i)}
            onChange={() => {}}
            maximumscale={1}
          />
        </td>
      ))}
    </tr>
  );
};

export default WordRow;
