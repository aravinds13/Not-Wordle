const coreLogic = (guess, wordMap, charStatus) => {
    let statusArray = new Array(5).fill('');
    let greenCounter = 0;
    let isRightAnswer = false;

    let tempMap = new Map();

    let charStatusLocal = charStatus;
    
    wordMap.forEach((value, key) =>{
        tempMap.set(key,[...value]);
    })

    for(let i=0; i<5; i++){ // green pass
      //if the letter is present in the map, it's a candidate for green
      if(tempMap.has(guess.charAt(i))){
        let arr = tempMap.get(guess.charAt(i));
        //if the index matches the indices in the array, it's a green
        if(arr.includes(i)){
            statusArray[i] = '#2c9425'; //green
            charStatusLocal[guess.charAt(i)] = '#2c9425';
            greenCounter++;
            arr.splice(guess.charAt(i),1);
            if(arr.length === 0){
                tempMap.delete(guess.charAt(i));
            }
        }    
      }
    }
    if(greenCounter === 5){
      //if we reach 5 greens, the user wins
      console.log('Bingo!')
      isRightAnswer = true;
    }

    else{
        for(let i=0; i<5; i++){ // yellow pass
            //if the letter is present in the map, it's a yellow since we already filtered out the greens
            if(tempMap.has(guess.charAt(i)) && statusArray[i] !== '#2c9425'){
                let arr = tempMap.get(guess.charAt(i));
                arr.pop();
                if(arr.length === 0){
                    tempMap.delete(guess.charAt(i));
                }
                else{
                    tempMap.set(guess.charAt(i), [...arr])
                }
                statusArray[i] = '#b4a03b'; //yellow
                if(charStatusLocal[guess.charAt(i)] !== '#2c9425'){
                  charStatusLocal[guess.charAt(i)] = '#b4a03b';
                }
            }
            else if (statusArray[i] !== '#2c9425'){ //if it's not yellow and green is not already assigned, it's a gray
                statusArray[i] = '#808080'; //grey
                if(charStatusLocal[guess.charAt(i)] !== '#b4a03b'){
                  charStatusLocal[guess.charAt(i)] = '#808080';
                }
            }
        }
    }
  
    let data =
      {
        'isCurrentWord': false,
        'word': guess,
        'status': statusArray,
      }
  
    return {isRightAnswer: isRightAnswer, data, charStatusLocal}
  }

export default coreLogic;
