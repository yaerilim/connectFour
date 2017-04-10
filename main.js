var connect4 = new game_constructor();
$(document).ready(function() {
    connect4.init();
});
//---------------------------------- SOUND EFFECTS ----------------------------------
function drop(){ //sound effect for drop noise on slots
    var audio = $("#drop")[0];
    audio.play();
}
function spongebob_win(){  //sound effect for spongebob win
    var audio = $('#spongebob_laugh')[0];
    audio.play();
}
function patrick_win(){ //sound effect for patrick win
    var audio = $('#patrick_laugh')[0];
    audio.play();
}
//---------------------------------- GAME CONSTRUCTOR ----------------------------------
function game_constructor() {
    this.winner_found = false; // flag for winner
    this.player1 = true; // variable used to detect player turn
    this.player1_score = 0;
    this.player2_score = 0;
    $('.patrick').hide(); //hide patrick token @ beginning of game
    this.diag1_counter = 0, this.diag2_counter = 0, this.horz_counter = 0, this.vert_counter = 0; //used to count up matches in a row
    this.direction_tracker = 0; //detects which direction we are counting

    this.div_array = [
        [,,,,,],
        [,,,,,],
        [,,,,,],      // used to update game board
        [,,,,,],      // with correct tokens
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
//---------------------------------- INITIATE GAME ----------------------------------
game_constructor.prototype.init = function() { //initiate game

    this.create_divs(this); //create game board

    $('.new_game').click(function() {
        connect4.reset_board();
    });
    $('.reset_score').click(function(){
        connect4.hard_reset();
    });
    $(".slot").click(drop);
};
//---------------------------------- CREATE GAME BOARD DIVS ----------------------------------
game_constructor.prototype.create_divs = function() {
    for (var row=6; row > -1 ; row--) {
        for (var column=0; column < 7; column++) {
            var new_slot = new this.slot_constructor(this, column, row );
            new_slot.create_div();
            new_slot.add_class();
            this.div_array[column][row] = new_slot;
        }
    }
};
//---------------------------------- DEFINITION FOR SLOT OBJECTS ----------------------------------
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
    this.add_class = function() { //make top
        if (this.row == 6) {
            $(this.slot_div).addClass('top')
        }
    };
};
//---------------------------------- WHEN SLOT IS CLICKED ----------------------------------
game_constructor.prototype.handle_slot_click = function(clickedSlot) {
    $('.pointer').hide();
    var current_column = this.game_array[clickedSlot.column];
    if (this.player1 === true) {
        $('.top').hover(function(){
            $(this).css({"background-image": "url('img/patrick_ready.png')", "background-repeat": "no-repeat", "background-size": "100%"})
        },function(){
            $(this).css("background", "none");
        });
        $('.spongebob').hide(); //hide spongebob token
        $('.patrick').show();
        $('.youare_s').hide(); //hide spongebob player indicator
        $('.youare_p').show();

        this.player1 = false;
        var down_to_bottom = current_column.indexOf("a"); // finds the first 'a' in the column
        current_column[down_to_bottom] = 'R'; // puts the player indicator at the 'bottom' of the array where the 'a' was found
        // applies class to div using the div_array (array containing objects)
        this.div_array[clickedSlot.column][down_to_bottom].slot_div.toggleClass('selected_slot_p1');
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

        this.player1 = true;
        var down_to_bottom = current_column.indexOf("a");
        current_column[down_to_bottom] = 'B';
        this.div_array[clickedSlot.column][down_to_bottom].slot_div.toggleClass('selected_slot_p2');
        if($(this.div_array[clickedSlot.column][down_to_bottom].slot_div).is('.krabby_patty')){
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
//---------------------------------- SEARCH SURROUNDING SLOTS TO FIND SAME COIN ----------------------------------
game_constructor.prototype.search_surrounding_slots = function (array, index) {
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

                // this while statement allows the check to continue along the same path
                // for example, if its checking the slot to the top right and finds a match,
                // it will continue checking in that direction and add onto the appropriate counter.
                while (this.game_array[array + move_array_position][index + move_index_position] === this.game_array[array][index]) {
                    this.increase_counters(this.direction_tracker);

                    // checks to see if any of the counters have reached a winning value
                    if (this.diag1_counter === 3 || this.diag2_counter === 3 || this.horz_counter === 3 || this.vert_counter === 3) {
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
//---------------------------------- COUNTER GOES UP EVERY TIME SAME COIN IS FOUND NEXT TO THE COIN DROPPED ----------------------------------
game_constructor.prototype.increase_counters = function(direction_tracker) {
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
//---------------------------------- WHEN THERE ARE NO 4 COINS MATCHING IN ANY DIRECTIONS, COUNTER RESETS ----------------------------------
game_constructor.prototype.reset_counters = function () {
    this.diag1_counter = 0;
    this.diag2_counter = 0;
    this.horz_counter = 0;
    this.vert_counter = 0;
    this.direction_tracker = 0;
};
//---------------------------------- DISPLAY PLAYER SCORES ----------------------------------
game_constructor.prototype.display_stats = function(){
    $('.player1_score').text(this.player1_score);
    $('.player2_score').text(this.player2_score);
};
//---------------------------------- NEW GAME ----------------------------------
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
//---------------------------------- RESET SCORE ----------------------------------
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
//---------------------------------- WIN CONDITION ----------------------------------
game_constructor.prototype.who_wins = function(){
    if(this.player1 === false){
        spongebob_win();
        $('.youare_p').hide();
        $('.youare_s').show();
        $('.slot').hide();
        $('.slot_container').append("<div class='you_won'><img class='spongebob_won' src='img/spongebob_wins.gif'></div>");
        this.player1_score++;
        this.display_stats();
        this.winner_found = true;
    }else{
        patrick_win();
        $('.youare_p').show();
        $('.youare_s').hide();
        $('.slot').hide();
        $('.slot_container').append("<div class='you_won'><img class='patrick_won' src='img/patrick_wins.gif'></div>");
        this.player2_score++;
        this.display_stats();
        this.winner_found = true;
    }
};