const updateButtonColorState = ({
                                        callback=undefined,
                                        isButtonDisabled=undefined
                                    }) => {
    if(isButtonDisabled !== undefined) {
        if(isButtonDisabled === true) {
            return {
                backgroundColor: '#555',
                opacity: 0.5
            };
        } else {
            if(callback !== undefined) {
                return callback();
            } else {
                throw Error('Callback not provided...');
            }
        }
    } else {
        throw Error('"isButtonDisabled" can not be \'undefined\'');
    }
    
};

export {
    updateButtonColorState
};