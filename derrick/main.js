

// var game_array = [
//     ['R', '', '', '', '', ''], // column 1
//     ['B', '', '', '', '', ''], // column 2
//     ['R', 'R', '', '', '', ''], // column 3
//     ['B', 'R', '', '', '', ''], // column 4
//     ['B', 'B', 'R', '', '', ''], // column 5
//     ['B', 'R', 'B', 'R', '', '']  // column 6
// ];

// Different Match Possibilities
// 00 01 02 03
// 00 10 20 30
// 00 11 22 33


var connect4;

$(document).ready(function() {
    connect4 = new game_constructor();
    connect4.init();
});

function game_constructor() {
    this.turn = 'player 1';
    this.game_array = [
        [,,,,,],
        [,,,,,],
        [,,,,,],
        [,,,,,],
        [,,,,,],
        [,,,,,],
        [,,,,,]
    ];

}

game_constructor.prototype.init = function() {
    this.create_divs(this);
};


game_constructor.prototype.create_divs = function() {
    for (var row=5; row > -1 ; row--) {
        for (var column=0; column < 7; column++) {
            var new_slot = new this.slot_constructor(this, column, row );
            new_slot.create_div();
            this.game_array[column][row] = new_slot;
        }
    }
};

game_constructor.prototype.slot_constructor = function(parent, column, row) {
    this.parent = parent;
    this.column = column;
    this.row = row;
    this.selected = false;
    this.location = row.toString() + ' ' + column.toString();
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
    console.log(clickedSlot);
    clickedSlot.slot_div.toggleClass('selected_slot_p1');

};

game_constructor.prototype.check_win_condition = function () {

}



