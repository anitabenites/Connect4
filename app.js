//when the current player is red:

//when the browser first loads the html get the position values for the first cells in each coloumn
//get positions of cell0, cell6, cell12, cell18, cell24, cell30, cell36
window.onload = function() {
    setPositionvalues();
}

//runs whenever the browser is resized
window.onresize = function() {
    setPositionvalues();
}

//empty array that will store objects where the object at 0th index
//will have the left and top values of each cell0
//object at 1 index will have for cell1 and so on.....
//since there are 7 coloumns there will be 7 objects inside positions array
var positions = [];

//the current player
var currentPlayer = "red";

//slot is an array that contains all the cells present in the board
var slot = $('.slot') //ALL 42 SLOTS

/*we are taking the variable board so that we use it in line77 and line179
we need to make the board unclickable till the functions move and checkWin complete for a particular coin
The user should be able to drop the next coin only after the above 2 mentioned functions are complete
Will lead to errors if simultaneous coins dropped to the board*/
var board = document.getElementById('connect4');

/*An array of arrays, each element inside the victories array is also an array that defines the winning condition
for Example victories[0] = [0,7,14,21] and victories[0][0] = 0;*/
var victories = [
[0, 7, 14, 21],
[7, 14, 21, 28],
[14, 21, 28, 35],
[1, 8, 15, 22],
[8, 15, 22, 29],
[2, 9, 16, 23],
[6, 13, 20, 27],
[13, 20, 27, 34],
[20, 27, 34, 41],
[12, 19, 26, 33],
[19, 26, 33, 40],
[18, 25, 32, 39],
[36, 31, 26, 21],
[31, 26, 21, 16],
[26, 21, 16, 11],
[37, 32, 27, 22],
[32, 27, 22, 17],
[38, 33, 28, 23],
[30, 25, 20, 15],
[25, 20, 15, 10],
[20, 15, 10, 5],
[24, 19, 14, 9],
[19, 14, 9, 4],
[18, 13, 8, 3],
];

//we made slots a global variable because we need to use it in the move function
var slots;

// we initizalitate the jquery on method:
/* An HTML event can be something the browser does, or something a user does.
Here are some examples of HTML events:
An HTML web page has finished loading
An HTML input field was changed
An HTML button was clicked
Often, when events happen, you may want to do something.*/
$('.column').on('click', function (e) {
//here event e gives us information about the click event, for example where it was clicked
//console.log(e);

/*animation = when once coin is falling down.
we want that the board should be unclickable while the animation is happening*/
// for every coin that we are dropping the move and checkwin condition has to be fullfilled in order
//to pass to the next coin.
    board.style.pointerEvents = "none";

/*currentTarget: refering to the column:
classList: refers to all the classes that I gave to that target element in the html, in my case i have 2: column and column0
we are interested in the second element column0, class List is an array.
console.log(e.currentTarget.classlist) = ["coloumn", "coloumn0"]*/
    var coloumn = e.currentTarget.classList[1];
/*var coloumn = "column0"
here we need to identify just the number therefore we have to take out from every columnnumber the coloumn
coloumn.length - 1 = 6
coloumn[0] = "c"
coloumn[1] = "O"
coloumn[6] = '0'*/

    var coloumnNo = parseInt(coloumn[coloumn.length - 1]);
/*coloumnNo = 0
coloumnNo = 1, and so on..until 6 because there are 7 columns.
e.currentTarget refers to the coloumn ( in this case it can be any column) you clicked on
$(e.currentTarget) = coloumn*/

//slots contains all the cells of the column that I am clicking
    slots = $(e.currentTarget).find('.slot');

/*since I have just 6 rows the position will be from 0 to 5:
If the last position is occupied then I need to go to position 4 and so on.
Hence we traverse the loop in the opposite direction*/
    for (var rowNo = 5; rowNo >= 0; rowNo--) {
        if (!slots.eq(rowNo).hasClass('red') && !slots.eq(rowNo).hasClass('black')) {
//do animation:
// in the function move I am passing the coloumnNo (0-6) and rowNo (position of the row (0-5))
            move(coloumnNo, rowNo);
            board.style.pointerEvents = "auto"; //it is making an alternation
            // console.log(currentPlayer);
// I want to put the coin and then over that is reason of the break
        break;
        }
    }
});

//seperated out the code for checking winning
function checkWin(slots, rowNo) {
//this condition is checking for the col victory
    if (checkSetForVictory(slots)) {
        endGame();
// we put a return statement to exit function we do not
// need to check the rest of the condition.
    return;
    }
//for row victory
    else if (checkSetForVictory($('.row' + rowNo))) {
        endGame();
        return;
    }
    else {
/*CheckArray consists of index no's of all cells inside the board that
contain coins of the current color*/
        checkArray = [];

//slot contains all the 42 cells in the board
        for(var index = 0; index < slot.length; index++) {
// if I am throwing a red coin I am checking inside
// of the slot array if there is any other red coin inside:
        if(slot.eq(index).hasClass(currentPlayer)) {
//creates an array that contains cell numbers which have the currplayer coin color
//index = 0
            checkArray.push(index);
// checkArray = [0];
            }
        }
        // console.log(checkArray);

//check the checkArray against the victories array
    for(var i = 0; i < victories.length; i++) {
/*we are checking the checkArray agains each of the arrays inside the victory array
as soon as we get a checkArray such that has ts elements are present in the current victory array
we are checking with we have a win condition*/

/*checkArray = [0, 7, 14 ,21, 25];
checkArray Will contain all the indexes of the cells which have the current color*/
//Flag indicates how many elements have matched, we increment flag each time on element matches
        var flag = 0; //will increment one by one depending on the matches
        for(var j = 0; j < checkArray.length; j++) {
//array.indexOf(number) returns the position of the number inside the array
//if the number is not present inside the array it returns -1
            if(victories[i].indexOf(checkArray[j]) > -1) {
//match found increment by flag by 1
                flag = flag + 1;
            }
            if(flag == 4) {
//end game as soon as the victory confirmed
                endGame();
                return;
            }
        }
    }
    }
//make the board clickable again when no user won
//pointerEvents is a css attribute
//userA clicks on a coloumn
//the coin drops to the place
//check for win for A
}

    function move(coloumnNo, rowNo) {
// coloumnNo refers to 0-6
//rowNo indicates the row in which the coin is to be placed inside the coloumn
//finalY indicates the final Y position in the board
//75: distance between consecutive cells:
        var finalY = rowNo*75 + positions[0].top;
        var coin = document.getElementById("coin");
        coin.style.backgroundColor = currentPlayer;
//positions is an array that we created earlier
//suppose the coloumnNo = 0;

//we are setting the css using javascript
        coin.style.top = positions[coloumnNo].top + 'px';
        coin.style.left = positions[coloumnNo].left + 'px';

/*we are trowing the coins down the column so the x position will remain constant
and the y position will increase in px;*/
        var initialY = positions[coloumnNo].top;
/*currentY = current position of the coin while the animation is happening.
it is set to initialY first*/
        var currentY = initialY;
//currentY = 200
//after every 5ms the function animation is run
        var animationInterval = setInterval(animation, 8);
        function animation() {
            if (currentY > finalY) {
//stop the interval
// clearInterval is a method of JS that will stop the set line 204
                clearInterval(animationInterval);

//slots already has the cells the for the current coloumn
//slots.eq(rowNo) = describing the cell
/*once the coin reaches the desired slot we make its color as the current color
to depict that the coin is present there*/
                slots.eq(rowNo).addClass(currentPlayer); //// means to mark the place where the coin has been placed.
///basically painting the part where the moving coin falls

/* The moving coin color is intially transparent it is set in the css
the color is set when the animation function is called on line 188 and made transparent
again after the coin finally reaches its current position because after that the notion that
a coin in present in the board is shown by the background color of the cell
which we set in line 215*/

                coin.style.backgroundColor = "transparent";

//run checkwin no
                checkWin(slots, rowNo);

                    if (currentPlayer == 'red') {
                        currentPlayer = "black";
                    }
                    else {
                        currentPlayer = "red";
                    }
                }
                else {
                    currentY = currentY + 5; // I am defining how fast the coin will go
                    coin.style.top = currentY + 'px';
                }
            }
        }


//.....//

    function checkSetForVictory(slots) {
        // console.log(slots);
        var victory = '';
        for (var i = 0; i < slots.length; i++) {
            // console.log(slots[i]);
            if (slots[i].classList.contains(currentPlayer)) {
                victory = victory + 'w';
                //victory = 'w';
            } else {
                victory = victory + 'l';
            }
        }
        // console.log(victory);
        return victory.indexOf('wwww') > -1; // if the wwww is presence in string victory --> i won!
    }

    function setPositionvalues() {
        positions = [];
        //jump by 6
        for(i = 0; i <= 36; i=i+6) {
            //first loop document.getElemenyById("cell0");
            // i changes in every iteration of the loop, in the first time will be o and then 6, etc..
            var cell = document.getElementById('cell'+i);
            // var rect storage the position x and y of each cell.
            var rect = cell.getBoundingClientRect();
            // console.log(rect);
            //we are creating here a jsonobject whose information is going to
            // be storage in the variable positionsObj.
            positionsObj = {
                // rect give us a lot of values but we only the x and y position.
                "left" : rect.x,
                "top" : rect.y
            }
            positions.push(positionsObj);
        }
        //positions = [{},{},{},{},{},{}]
        // console.log(positions);
    }

    //notify the winner and reload the page
    function endGame() {
        // currentPlayer will contain black or red;
        alert(currentPlayer + ' player has won');
        location.reload(); //it reloads the page
    }

    //Click event to restart the game
    $(".button_bottom").click(function () {
        location.reload();
    });
