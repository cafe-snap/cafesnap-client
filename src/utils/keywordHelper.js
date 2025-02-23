import { STARTWORDS, MIDWORDS, ENDWORDS, ENGTOKORMAP } from "./keywordConstants";

const STARTWORDS_MAP = Object.fromEntries(STARTWORDS.map((char, idx) => [char, idx]));
const MIDWORDS_MAP = Object.fromEntries(MIDWORDS.map((char, idx) => [char, idx]));
const ENDWORDS_MAP = Object.fromEntries(ENDWORDS.map((char, idx) => [char, idx]));

const engToKoHelper = (input) => {
  const engToKo = [...input].map((char) => ENGTOKORMAP[char] || "");
  let resultArray = [];
  let candidateArray = [];

  const makeWord = (buffer) => {
    const start = STARTWORDS_MAP[buffer[0]] ?? -1;
    const mid = MIDWORDS_MAP[buffer[1]] ?? -1;
    const end = buffer[2] ? ENDWORDS_MAP[buffer[2]] ?? 0 : 0;

    return start !== -1 && mid !== -1
      ? String.fromCharCode(0xac00 + ((start * 21) + mid) * 28 + end)
      : buffer.join("");
  };

  for (let i = 0; i < engToKo.length; i++) {
    const current = engToKo[i];
    const next = engToKo[i + 1] || null;

    if (STARTWORDS_MAP[current] !== undefined && MIDWORDS_MAP[next] !== undefined) {
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

  return resultArray.join("");
};

export default engToKoHelper;
