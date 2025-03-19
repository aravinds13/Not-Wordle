const WordRow = (props) => {
  const { word, status, isCurrentWord } = props.wordDetails;
  const rowKey = props.rowKey;
  const currentWord = props.currentWord;

  // Initialize wordArray with a default 5-character empty array if word is empty
  let wordArray = word.length === 0 ? new Array(5).fill("") : word.split("");

  let currentWordArray = new Array(5).fill('')
  currentWord.split('').forEach((char, index) => {
    currentWordArray[index] = char;
  });

  return (
    <tr onKeyDown={()=>{}} key={rowKey}>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
      {wordArray.map((_, i) => (
        <td key={i}>
          <div
            className="square"
            style={{ backgroundColor: `${status[i]}`}}
            key={`${rowKey}+${i}`}>
              <text style={{color: `white`}}>
                {isCurrentWord ? currentWordArray[i] : wordArray[i]}
              </text>
          </div>
        </td>
      ))}
    </tr>
  );
};

export default WordRow;
