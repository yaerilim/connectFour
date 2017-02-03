var connect4Model = new GenericFBModel('spongeBob-connect4-derrick', boardUpdated);

function boardUpdated(data){
    console.log('this is the DB before the wipe', data)
}

var emptyObject = {
    column: 'empty',
    multiplayer: false,
    player1joined: false,
    player2joined: false,
    game_over: true
};

setTimeout(function() {
    connect4Model.saveState(emptyObject);
    console.log('database should now be reset...')
}, 2000);



