/*
    CIT 281 Project 1
    Name: Quinn Smiley
*/

// Returns a random number between min (inclusive) and max (exclusive)
    function getRandomInteger(min, max) { 
        return Math.floor(Math.random() * (max - min) + min);
    }


    function getRandomString(){
        const alpha = 'abcdefghijklmnopqrstuvwxyz';
        const lengths = getRandomInteger(5, 26);
        let result = ""
        for (let i = 0; i < lengths; i++){
            result += alpha[getRandomInteger(0, 26)]
        }
        
        console.log(result.length + " lowercase letters: " + result)
    }
    
getRandomString();
