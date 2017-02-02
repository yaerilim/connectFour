
var connect4;

$(document).ready(function() {
    connect4 = new game_constructor();
    connect4.init();
    connect4.search_surrounding_slots(6, 3);
});

function game_constructor() {
    this.turn = 'player 1';
    this.counter = 0;
    this.matches_found = {};
    this.game_array = [
        // [,,,,,],
        // [,,,,,],
        // [,,,,,],
        // [,,,,,],
        // [,,,,,],
        // [,,,,,],
        // [,,,,,]

        ['a', 'a', 'a', 'a', 'a', 'a'], // column 0
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 1
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 2
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 3
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 4
        ['a', 'a', 'a', 'a', 'a', 'a'], // column 5
        ['a', 'a', 'a', 'a', 'a', 'a']  // column 6

    ];

}

game_constructor.prototype.init = function() {
    this.create_divs(this);
};


game_constructor.prototype.create_divs = function() {
    for (var row=6; row > -1 ; row--) {
        for (var column=0; column < 7; column++) {
            var new_slot = new this.slot_constructor(this, column, row );
            new_slot.create_div();
            //this.game_array[column][row] = new_slot;
        }
    }
};

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
        if (!this.selected) {
            this.selected = true;
            this.parent.handle_slot_click(this);
        }
    };

};

game_constructor.prototype.handle_slot_click = function(clickedSlot) {
    if (this.player1 === true) {
        var current_column = this.game_array[clickedSlot.column];
        console.log('Player 1 has clicked', clickedSlot);
        this.player1 = false;
        /*var current_slot = this.game_array[clickedSlot.column][clickedSlot.row] = 'R';*/
        var down_to_bottom = current_column.indexOf("a");
        clickedSlot.slot_div.toggleClass('selected_slot_p1');

    } else {
        console.log('Player 2 has clicked: ', clickedSlot);
        clickedSlot.slot_div.toggleClass('selected_slot_p2');
        this.player1 = true;
        this.game_array[clickedSlot.column][clickedSlot.row] = 'B';
    }
};


game_constructor.prototype.check_win_condition = function () {

};

game_constructor.prototype.search_surrounding_slots = function (array, index) {
    this.counter = 0;
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            if (!(j == 0 && i == 0) && array + i > 0 && array + i < 6 && index + j > 0 && index + j < 5) {
                var move_array_position = i;
                var move_index_position = j;
                console.log('checking at: ' + (array+i) + ', ' + (index+j));
                while(this.game_array[array+move_array_position][index+move_index_position] === this.game_array[array][index]) {
                    this.counter++;
                    console.log('match found at: ' + (array + move_array_position) + ', ' + (index + move_index_position));
                    move_array_position = move_array_position + i;
                    move_index_position = move_index_position + j;
                    if (this.counter === 3) {
                        console.log('you win!')
                    }

                }
            }
        }
    }
};

game_constructor.prototype.log_match_found = function(array_found, index_found) {
    console.log('matches found: ' + this.counter);
    console.log('found at array: ' + array_found + ', index: ' + index_found)
};