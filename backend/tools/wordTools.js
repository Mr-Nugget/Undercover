exports.selectRandomWord = (data) => {
    // Pick wich word would be the undercover word
    const wordUndercover = Math.floor(Math.random() * 2);

    if (wordUndercover == 1) {
        return {
            normalWord: data['secondWord'],
            undercoverWord : data['firstWord']
        };
    }else{
        return {
            normalWord: data['firstWord'],
            undercoverWord : data['secondWord']
        };
    }
};