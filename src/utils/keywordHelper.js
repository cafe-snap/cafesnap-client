import { STARTWORDS, MIDWORDS, ENDWORDS, ENGTOKORMAP } from "./keywordConstants";

const engToKoHelper = (input) => {
  const engToKo = [...input].map((char) => ENGTOKORMAP[char] || "");
  const resultArray = [];
  let candidateArray = [];

  const makeWord = (buffer) => {
    const start = STARTWORDS.indexOf(buffer[0]);
    const mid = MIDWORDS.indexOf(buffer[1]);
    const end = buffer[2] ? ENDWORDS.indexOf(buffer[2]) : 0;

    return (
      String.fromCharCode(0xac00 + ((start * 21) + mid) * 28 + end)
    );
  };

  for (let i = 0; i < engToKo.length; i++) {
    const current = engToKo[i];
    const next = engToKo[i + 1] || null;

    if ((STARTWORDS.includes(current) || ENDWORDS.includes(current)) && (STARTWORDS.includes(next) || ENDWORDS.includes(next))) {
      candidateArray.push(current);
      resultArray.push(makeWord(candidateArray));
      candidateArray = [next];
      i++;
    } else if ((STARTWORDS.includes(current) || ENDWORDS.includes(current)) && MIDWORDS.includes(next)) {
      if (candidateArray.length > 0) {
        resultArray.push(makeWord(candidateArray));
      }
      candidateArray = [current, next];
      i++;
    } else {
      candidateArray.push(current);
    }
  }

  if (candidateArray.length >= 2) {
    resultArray.push(makeWord(candidateArray));
  }

  return (
    resultArray.join("")
  );
};

export default engToKoHelper;
