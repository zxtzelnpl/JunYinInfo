const messages = (state = INITIAL_STATE_MES, action) => {
    let newState=new iMap();
    for(let key in state){
        newState.set(state[key])
    }
    switch (action.type) {
        case 'ADD':
            if(action.messages.length){
                action.messages.forEach(function(message){
                    newState.set(message);
                });
            }else{
                newState.set(action.messages);
            }
            return newState;
        case 'CHECK':
            newState.set(action.messages);
            return newState;
        case 'DEL':
            newState.del(action.messages);
            return newState;
        case 'BACK':
            newState.set(action.messages);
            return newState;
        default:
            return state
    }
};

export default messages;
