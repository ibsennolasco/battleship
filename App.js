let view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location){
        let cell = document.getElementById(location);
        cell.setAttribute("class","hit");
    },
    displayMiss: function(location){
        let cell = document.getElementById(location);
        cell.setAttribute("class","miss");
    }
}


let model = {
    boardSize: 7,
    numShips: 3,
    shipsSunk: 0,
    shipLength: 3,
    ships:  [{locations: [0,0,0], hits: ["","",""] },
             {locations: [0,0,0], hits: ["","",""] },
             {locations: [0,0,0], hits: ["","",""] }],
    fire: function(guess) {
        for (let i = 0; i < this.numShips; i++) {
             let ship = this.ships[i];
            //  let locations = ship.locations;
             let index = ship.locations.indexOf(guess);

             if (ship.hits[index] === "hit") {
                 biew.displayMessage("Oops, you already hit that location!");
                 return true
             }
             else if (index >= 0) {
                 ship.hits[index] = "hit";
                 view.displayHit(guess);
                 view.displayMessage("HIT!");

                 if (this.shipsSunk(ship)) {
                     view.displayMessage("You sank my battleship!")
                     this.shipsSunk++
                 }
                 return true;
             }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed")
        return false
    },
    isSunk: function(ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false
            }
        }
        return true;
    },

    generateShipLocation: function() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations
        }
        console.log("Ships array: ")
        console.log(this.ships)
    },

    generateShip: function() {
        let direction = Math.floor(Math.random() * 2);
        let row;
        let col;
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        } else {
            col = Math.floor(Math.random() * this.boardSize);
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        }

        let newShipLocation = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocation.push(row + "" + (col + i));
            } else {
                newShipLocation.push((row + i) + "" + col)
            }
        }

        return newShipLocation;
    },

    collision: function(locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true
                }
            }
        }
        return false;
    }
}


let controller = {
    guesses: 0,

    processGuess: function(guess) {
        let location = parseGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleship, in " + this.guesses + " guesses")
            }
        }
    }
};

function parseGuess(guess) {
    let alphabet = ["A","B","C","D","E","F","G"];

    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");
    } else {
        let firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Oops that's off the board!")
        } else {
            return row + column;
        }
        
    }
    return null;
}

function init() {
    let fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    let guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocation()
}

function handleFireButton() {
    let guessInput = document.getElementById("guessInput");
    let guess = guessInput.value.toUpperCase();
    controller.processGuess(guess)

    guessInput.value = "";

}

function handleKeyPress(e) {
    let fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false
    }
}

// model.generateShipLocation()

window.onload = init;


