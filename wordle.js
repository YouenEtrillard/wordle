const dictionary = require('./words.json');
let attempts = 0;
const maxAttempts = 6;

const wordleGuess = (attemptWord, solutionWord, attempts) => {
  if (!(attemptWord.length === solutionWord.length)) {
    throw `the word has to be ${solutionWord.length} letters long`;
  }

  let result = ``;
  let atLeastOneWrongLetter = false;

  for (let index = 0; index < attemptWord.length; index++) {
    if (attemptWord[index] === solutionWord[index]) {
      result += `🟩`;
    } else if (solutionWord.includes(attemptWord[index])) {
      result += `🟨`;
      atLeastOneWrongLetter = true;
    } else {
      result += `⬛`;
      atLeastOneWrongLetter = true;
    }
  }

  attempts++;

  return {
    success: !atLeastOneWrongLetter,
    result,
    remainingAttempts: maxAttempts - attempts,
  };
};

if (typeof window === 'undefined') {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const startGame = (solutionWord) => {
    promptInput(solutionWord);
  };

  const promptInput = (solutionWord) => {
    rl.question('Type your guess :', function (answer) {
      if (answer === `!exit`) {
        rl.close();
      }

      try {
        const guess = wordleGuess(answer, solutionWord);

        if (guess.success) {
          console.log(
            `${
              guess.result
            }\nCongratulations ! You found the word of the day in ${attempts} attempt${
              attempts > 1 ? 's' : ''
            } !`
          );

          rl.close();
        } else {
          if (guess.remainingAttempts <= 0) {
            console.log(
              `${guess.result}\nSorry, this is not the right answer. You can still try or type "!exit" to close the game.`
            );
          } else {
            console.log(
              `${guess.result}\nGuess again, you have ${
                guess.remainingAttempts
              } attempt${guess.remainingAttempts > 1 ? 's' : ''} left`
            );
          }
          promptInput();
        }
      } catch (e) {
        console.log(e);
        promptInput();
      }
    });
  };

  const initGame = () => {
    const maxLength = dictionary.reduce((previous, current) =>
      previous > current ? previous : current
    );
    let word = ``;

    const askLength = rl.question(
      `How many letters should the word be ? (maximum ${maxLength})`,
      function (wordLength) {
        if (typeof wordLength === 'Number') {
          while (word.length !== wordLength) {
            word = dictionary[Math.floor(Math.random() * dictionary.length)];
          }
        }
      }
    );

    rl.question(
      `How many letters should the word be ? (maximum ${maxLength})`,
      function (wordLength) {
        if (typeof wordLength === 'Number') {
          while (word.length !== wordLength) {
            word = dictionary[Math.floor(Math.random() * dictionary.length)];
          }
        }
      }
    );

    return { word, maxAttempts };
  };

  rl.on('close', function () {
    process.exit(0);
  });

  // startGame(initGame());
  initGame();
}

// wordleGuess('reads', solutionWord);
// ('⬛🟨⬛🟨⬛');

// wordleGuess('lodgr', solutionWord);
// ('⬛⬛🟩🟩🟩');
