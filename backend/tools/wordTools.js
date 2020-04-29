exports.selectRandomWord = (playersNum, data) => {
    var normalWord = data['firstWord'];
    var undercoverWord = data['secondWord'];
    var words = [playersNum];
    // Pick a random player position
    const positionUndercover = Math.floor(Math.random() * playersNum);
    // Pick wich word would be the undercover word
    const wordUndercover = Math.floor(Math.random() * 2);

    if (wordUndercover == 1) {
        normalWord = data['secondWord'];
        undercoverWord = data['firstWord'];
    }
    for (var i = 0; i < playersNum; i++) {
        if (i == positionUndercover) {
            words[i] = undercoverWord;
        } else {
            words[i] = normalWord;
        }
    }
    return words;
};