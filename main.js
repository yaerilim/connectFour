var connect4 = new game_constructor();

// var connect4Model = new GenericFBModel('spongeBob-connect4', boardUpdated);

// var emptyObject = {
//     column: 'empty',
//     multiplayer: false,
//     player1joined: false,
//     player2joined: false,
//     game_over: true,
//     db_player_turn: -1
// };

// setTimeout(function() {
//     connect4Model.saveState(emptyObject);
//     console.log('db reset')
// }, 5000);


// update_firebase = function(column, multiplayer, player1joined, player2joined, game_over, db_player_turn)

function setupDB() {
    setTimeout(function() {
        if (connect4.data_received_from_server.player1joined === true && connect4.data_received_from_server.player2joined === true) {
            console.log('something is wrong...');
        }
        else if (connect4.data_received_from_server.player1joined === false) {
            connect4.update_firebase('empty', false, true, false, true, -1); //setting firebase back to empty DB, joining as player 1
            connect4.data_received_from_server = {
                column: 'empty',
                multiplayer: false,
                player1joined: true,
                player2joined: false,
                game_over: true,
                db_player_turn: -1
            };
            console.log('game starting, you are player 1');
            connect4.player_turn = -1;
            connect4.you_are = 'player 1';
        }
        else if (connect4.data_received_from_server.player1joined === true) {
            connect4.update_firebase('empty', true, true, true, true, -1); //player 1 has already joined, joining as player 2
            console.log('game starting, you are player 2');
            connect4.you_are = 'player 2';
            connect4.player_turn = 1;
            connect4.data_received_from_server = {
                column: 'empty',
                multiplayer: true,
                player1joined: true,
                player2joined: true,
                game_over: true,
                db_player_turn: -1
            };
        }
        else {
            console.log("player 1 may not be in multiplayer");
        }
    }, 5000)
}



// function boardUpdated(data){
//
//     console.log('data from the server: ', data);
//     connect4.data_received_from_server = data;
//
//     connect4.remote_column_clicked = connect4.data_received_from_server.column + ' 6';
//     var input_into_jquery_selector = 'div>div:contains(' + connect4.remote_column_clicked + ')';
//
//
//     // if (connect4.data_received_from_server.db_player_turn === connect4.player_turn) {
//     //     $(input_into_jquery_selector).click();
//     //     return;
//     // }
// }

$(document).ready(function() {
    $('.sound_off').click(sound_off);
    $('.sound_on').click(sound_on);
    select_game_mode();
    setupDB();
});

function drop(){
    var audio = $("#drop")[0];
    audio.play();
}

function spongebob_win(){
    var audio = $('#spongebob_laugh')[0];
    audio.play();
}
function patrick_win(){
    var audio = $('#patrick_laugh')[0];
    audio.play();
}

function sound_off() {
    $('.sound_off').hide();
    $('.sound_on').show();
    $('.music')[0].pause();
}

function sound_on(){
    $('.sound_on').hide();
    $('.sound_off').show();
    $('.music')[0].play();
}
function game_constructor() {
    this.winner_found = false;
    this.player_turn = null;
    this.you_are = '';
    this.data_received_from_server = {};
    // this.multiplayer = false;
    // this.player2joined = false;
    this.remote_column_clicked = null;
    this.player1 = true; // variable used to detect player turn
    this.player1_score = 0;
    this.player2_score = 0;
    $('.patrick').hide();
    this.diag1_counter = 0, this.diag2_counter = 0, this.horz_counter = 0, this.vert_counter = 0;
    this.direction_tracker = 0;

    this.div_array = [
        [,,,,,],
        [,,,,,],
        [,,,,,],
        [,,,,,],
        [,,,,,],
        [,,,,,],
        [,,,,,]
    ];
    this.game_array = [ // used to keep track of selected slots on game board. also used as an index for the div_array
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 0
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 1
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 2
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 3
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 4
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 5
        ['a', 'a', 'a', 'a', 'a', 'a']  // column 6
    ];
}

function select_game_mode() {
    var game_modes_div = $('<div>', {
        class: 'game_modes'
    });
    var img_local = $('<img>', {
        src: 'img/local.png'
    });
    var img_multi = $('<img>', {
        src: 'img/multi.png'
    });
    game_modes_div.append(img_local, img_multi);
    $('.slot_container').append(game_modes_div);

    setTimeout(function() {
        $('.game_modes img:nth-child(1)').click(function() {
            $('.slot_container').empty();
            console.log('local selected');
            connect4.init();
        });

        $('.game_modes img:nth-child(2)').click(function() {
            $('.slot_container').empty();
            console.log('multi selected');
            connect4.multiplayer = true;
            connect4.update_firebase('empty', true, connect4.data_received_from_server.player1joined,  connect4.data_received_from_server.player2joined,  connect4.data_received_from_server.game_over, connect4.data_received_from_server.db_player_turn);
            connect4.waiting_for_player_2();
        });
    }, 500);

}
game_constructor.prototype.waiting_for_player_2 = function() {
    // $('.slot_container').empty();
    // $('.slot_container').css('background-color', 'red'); // need to add a graphic on waiting for player
    // if(connect4.data_received_from_server.player2joined === false) { //need to look into passing 'this' after setTimeout calls function again
    //     console.log('waiting for player 2');
    //     setTimeout(connect4.waiting_for_player_2, 1000);
    //     return;
    // }
    // $('.slot_container').css('background-color', '');
    connect4.init();

}


game_constructor.prototype.init = function() {

    this.create_divs(this);

    $('.new_game').click(function() {
        console.log('new game button clicked');
        connect4.reset_board();
    });
    $('.reset_all').click(function(){
        console.log('reset stats and board');
        connect4.hard_reset();
    });
    $('.reset_score').click(function(){
        console.log('reseting board and scores');
        connect4.hard_reset();
    });
    $(".slot").click(drop);
};
// create slot objects and corresponding divs
game_constructor.prototype.create_divs = function() {
    for (var row=6; row > -1 ; row--) {
        for (var column=0; column < 7; column++) {
            var new_slot = new this.slot_constructor(this, column, row );
            new_slot.create_div();
            new_slot.add_class();
            new_slot.krabby_patty();
            this.div_array[column][row] = new_slot;
        }
    }
};
// definition for slot object
game_constructor.prototype.slot_constructor = function(parent, column, row) {
    this.parent = parent;
    this.column = column;
    this.row = row;
    this.selected = false;
    this.location = column.toString() + ' ' + row.toString();
    this.create_div = function() {
        this.slot_div = $('<div>', {
            class: 'slot'
        });
        $('.slot_container').append(this.slot_div);
        this.slot_div.text(this.location);
        this.slot_div.click(this.handle_click.bind(this));
    };
    this.handle_click = function() {
        this.parent.handle_slot_click(this);
    };
    this.add_class = function() {
        if (this.row == 6) {
            $(this.slot_div).addClass('top')
        }
    };
    this.krabby_patty = function(){
        for(var i = 5; i >= 0; i--) {
            if (this.row === Math.floor((Math.random() * 5) + 1) && this.column === Math.floor((Math.random() * 5) + 1)) {
                $(this.slot_div).addClass('krabby_patty');
            }
        }
    };
};

game_constructor.prototype.update_firebase = function(column, multiplayer, player1joined, player2joined, game_over, db_player_turn) {
    this.firebase_db = {
        column: column,
        multiplayer: multiplayer,
        player1joined: player1joined,
        player2joined: player2joined,
        game_over: game_over,
        db_player_turn: db_player_turn
    };
    //console.log('sending data to server: ', this.firebase_db);
    connect4Model.saveState(this.firebase_db);
};

game_constructor.prototype.handle_slot_click = function(clickedSlot) {
    var current_column = this.game_array[clickedSlot.column];

    // this.data_received_from_server.db_player_turn = this.data_received_from_server.db_player_turn * -1;
    // if (connect4.player_turn !== connect4.data_received_from_server.db_player_turn) {
    //     this.update_firebase(clickedSlot.column, this.data_received_from_server.multiplayer, this.data_received_from_server.player1joined, this.data_received_from_server.player2joined, this.data_received_from_server.game_over, this.data_received_from_server.db_player_turn);
    // }

    if (this.player1 === true) {
        $('.top').hover(function(){
            $(this).css({"background-image": "url('img/patrick_ready.png')", "background-repeat": "no-repeat", "background-size": "100%"})
        },function(){
            $(this).css("background", "none");
        });
        $('.spongebob').hide();
        $('.patrick').show();
        $('.youare_s').hide();
        $('.youare_p').show();
        console.log('Player 1 has clicked', clickedSlot);
        //console.log('Player 1 has clicked', clickedSlot);
        this.player1 = false;
        var down_to_bottom = current_column.indexOf("a"); // finds the first 'a' in the column
        current_column[down_to_bottom] = 'R'; // puts the player indicator at the 'bottom' of the array where the 'a' was found
        // applies class to div using the div_array (array containing objects)
        this.div_array[clickedSlot.column][down_to_bottom].slot_div.toggleClass('selected_slot_p1');
        if($(this.div_array[clickedSlot.column][down_to_bottom].slot_div).is('.krabby_patty')){
            console.log('secret krabby patty clicked!!');
            this.div_array[clickedSlot.column][down_to_bottom].slot_div.toggleClass('krabby_patty_clicked_spongebob');
            $('.slot').hide();
            $('.slot_container').append("<div class='you_won'><img class='patrick_won' src='img/krabbypatty.gif'></div>");
            setTimeout(this.set_timeout, 3000);
            this.player1 = true;
            $('.youare_s').show();
            $('.youare_p').hide();
            $('.spongebob').show();
            $('.patrick').hide();
            $('.top').hover(function(){
                $(this).css({"background-image": "url('img/spongebob_ready.png')", "background-repeat": "no-repeat", "background-size": "100%"})
            },function(){
                $(this).css("background", "none");
            });
        }

    } else {
        $('.top').hover(function(){
            $(this).css({"background-image": "url('img/spongebob_ready.png')", "background-repeat": "no-repeat", "background-size": "100%"})
        },function(){
            $(this).css("background", "none");
        });
        $('.patrick').hide();
        $('.spongebob').show();
        $('.youare_p').hide();
        $('.youare_s').show();
        console.log('Player 2 has clicked', clickedSlot);
        //console.log('Player 2 has clicked', clickedSlot);
        this.player1 = true;
        var down_to_bottom = current_column.indexOf("a");
        current_column[down_to_bottom] = 'B';
        this.div_array[clickedSlot.column][down_to_bottom].slot_div.toggleClass('selected_slot_p2');
        if($(this.div_array[clickedSlot.column][down_to_bottom].slot_div).is('.krabby_patty')){
            console.log('secret krabby patty clicked!!');
            this.div_array[clickedSlot.column][down_to_bottom].slot_div.toggleClass('krabby_patty_clicked_patrick');
            $('.slot').hide();
            $('.slot_container').append("<div class='you_won'><img class='patrick_won' src='img/krabbypatty.gif'></div>");
            setTimeout(this.set_timeout, 3000);
            this.player1 = false;
            $('.youare_s').hide();
            $('.youare_p').show();
            $('.spongebob').hide();
            $('.patrick').show();
            $('.top').hover(function(){
                $(this).css({"background-image": "url('img/patrick_ready.png')", "background-repeat": "no-repeat", "background-size": "100%"})
            },function(){
                $(this).css("background", "none");
            });
        }
    }

    this.search_surrounding_slots(clickedSlot.column, down_to_bottom);
};

game_constructor.prototype.set_timeout = function(){
    $('.you_won').hide();
    $('.slot').show();
}
game_constructor.prototype.reset_board = function(){
    $('.slot_container').empty();
    this.init();
    this.player1 = true;
    $('.spongebob').show();
    $('.patrick').hide();
    this.game_array = [
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 0
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 1
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 2
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 3
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 4
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 5
        ['a', 'a', 'a', 'a', 'a', 'a']  // column 6
    ];
    $('.youare_p').hide();
    $('.youare_s').show();
    // this.update_firebase('empty', false, false, false, true, -1);
    this.winner_found = false;
};

game_constructor.prototype.hard_reset = function() {
    $('.slot_container').empty();
    this.init();
    this.player1 = true;
    $('.spongebob').show();
    $('.patrick').hide();
    this.game_array = [
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 0
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 1
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 2
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 3
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 4
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 5
        ['a', 'a', 'a', 'a', 'a', 'a']  // column 6
    ];
    this.player1_score = 0;
    this.player2_score = 0;
    this.display_stats();
    $('.youare_p').hide();
    $('.youare_s').show();
    this.winner_found = false;

};

game_constructor.prototype.display_stats = function(){
    //console.log('********* method display_stats called**************');
    $('.player1_score').text(this.player1_score);
    $('.player2_score').text(this.player2_score);
};

game_constructor.prototype.search_surrounding_slots = function (array, index) {
    //console.log('********* method search_slots called**************');
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            if (this.winner_found === true) {return};
            // checks happen from the bottom of a column to the top, then moves and checks the next column in the same fashion.
            // each direction is given a value of 1-9 and adds to the appropriate counter based on the switch statement below.
            this.direction_tracker++;

            // this if statement checks to make sure we're not out of bounds or counting the newly placed token itself
            if (!(j == 0 && i == 0) && array + i > -1 && array + i < 7 && index + j > -1 && index + j < 6) {
                var move_array_position = i;
                var move_index_position = j;
                //console.log('checking at: ' + (array + i) + ', ' + (index + j));

                // this while statement allows the check to continue along the same path
                // for example, if its checking the slot to the top right and finds a match,
                // it will continue checking in that direction and add onto the appropriate counter.
                while (this.game_array[array + move_array_position][index + move_index_position] === this.game_array[array][index]) {
                    this.increase_counters(this.direction_tracker);

                    //console.log('match found at: ' + (array + move_array_position) + ', ' + (index + move_index_position));

                    // checks to see if any of the counters have reached a winning value
                    if (this.diag1_counter === 3 || this.diag2_counter === 3 || this.horz_counter === 3 || this.vert_counter === 3) {
                        console.log('you win!');
                        $('.slot_container').attr('disabled', 'true');
                        this.who_wins();
                        break;
                    }

                    // increases coordinates in same direction and then checks to see if we're out of bounds before continuing another check.
                    move_array_position = move_array_position + i;
                    move_index_position = move_index_position + j;
                    if (array + move_array_position < 0 || array + move_array_position > 6 || index + move_index_position < 0 || index + move_index_position > 5) {
                        break

                    }
                }
            }
        }
    }
    this.reset_counters();
};

game_constructor.prototype.who_wins = function(){
    //console.log('********* method who_wins called**************');
    if(this.player1 === false){
        console.log('spongebob won!');
        spongebob_win();
        $('.youare_p').hide();
        $('.youare_s').show();
        $('.slot').hide();
        $('.slot_container').append("<div class='you_won'><img class='spongebob_won' src='img/spongebob_wins.gif'></div>");
        this.player1_score++;
        this.display_stats();
        this.winner_found = true;
    }else{
        $('.youare_p').show();
        $('.youare_s').hide();
        $('.slot').hide();
        console.log('patrick won!');
        patrick_win();
        $('.slot_container').append("<div class='you_won'><img class='patrick_won' src='img/patrick_wins.gif'></div>");
        this.player2_score++;
        this.display_stats();
        this.winner_found = true;
    }
    // this.update_firebase('empty', false, false, false, true, -1);


};

game_constructor.prototype.increase_counters = function(direction_tracker) {
    //console.log('********* method increase_counters called**************');
    switch (direction_tracker) {
        case 1:
        case 9:
            this.diag1_counter++;
            break;
        case 2:
        case 8:
            this.horz_counter++;
            break;
        case 3:
        case 7:
            this.diag2_counter++;
            break;
        case 4:
        case 6:
            this.vert_counter++;
            break;
    }
};


game_constructor.prototype.reset_counters = function () {
    //console.log('********* method reset_counters called**************');
    this.diag1_counter = 0;
    this.diag2_counter = 0;
    this.horz_counter = 0;
    this.vert_counter = 0;
    this.direction_tracker = 0;
};