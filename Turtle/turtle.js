const canvas = document.getElementById('turtlecanvas');

/**@type {CanvasRenderingContext2D} */
const context = canvas.getContext('2d');


const PLANE_SIZE = 500;
const PLANE_DRAW_START_OFFSET = 10;
const PLANE_DRAW_END_OFFSET = 20;
const START_SQUARE_SIZE = 40;
let isInGame = false;

class Square {
    /**
     * @param {Point} coords 
     * @param {number} size 
     */
    constructor(coords, size) {
        this.coords = coords;
        this.size = size;
    }

    /**
     * @param {Point} point 
     * @returns {boolean}
     */
    contains(point) {
        const inXSpace = point.x >= this.coords.x && point.x <= this.coords.x + this.size;
        const inYSpace = point.y >= this.coords.y && point.y <= this.coords.y + this.size;
        return inXSpace && inYSpace;
    }

}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Turtle {
    /**
     * @param {Point} position 
     * @param {number} angle 
     * @param {string} color 
     * @param {boolean} penDown 
     */
    constructor(position, angle, color, penDown) {
        this.position = position;
        this.angle = angle;
        this.color = color;
        this.penDown = penDown;
    }

    angleToRadians() {
        return this.angle * (Math.PI / 180)
    }

    /**
     * @param {number} distance 
     */
    moveForward(distance) {
        this.position.x = this.position.x + distance * Math.cos(this.angleToRadians());
        this.position.y = this.position.y + distance * Math.sin(this.angleToRadians());
    }

    rotate(angle) {
        this.angle = (this.angle + angle) % 360;
    }

    /**
     * @param {Point} position 
     */
    setFixedPosition(position) {
        this.position = position;
    }

    drawOnCanvas() {
        // context.beginPath();

        // context.arc(
        //     this.position.x, 
        //     this.position.y, 
        //     10, //FIXME: Take that to considiration where calculating collisions
        //     0, 
        //     2 * Math.PI
        // );

        // context.stroke()
    }
}


// Definiujemy żółwia
/**@type {Array<Square>} */
var redSquares = []
var turtle = new Turtle(new Point(30, 30), 90, 'black', true);

// Funkcje żółwia

function forward(distance) {
    context.beginPath();
    context.moveTo(turtle.position.x, turtle.position.y);
    turtle.moveForward(distance)
    context.lineTo(turtle.position.x, turtle.position.y);
    
    if (turtle.penDown) {
        context.strokeStyle = turtle.color;
        context.stroke();
    }

    turtle.drawOnCanvas();

    if (isInGame == false) {
        return
    }

    for (const square of redSquares) {
        if (square.contains(new Point(turtle.position.x, turtle.position.y))) {
            console.log("IN RED SQUARE")
            drawLoseScreen();
            return;
        }
    }

    if (turtle.position.x >= 490 || turtle.position.x <= 10 || turtle.position.y >= 490 || turtle.position.y <= 10) {
        drawLoseScreen();
        return;
    }

    if (turtle.position.x <= 490 && turtle.position.x >= 450 && turtle.position.y <= 490 && turtle.position.y >= 450) {
        drawWinScreen();
        return;
    }
}

function goTo(x, y) {
    turtle.setFixedPosition(new Point(x, y))
    turtle.drawOnCanvas();
}

function move(distance) {
    for (let i = 0; i < distance; i++) {
        forward(1);
    }
}

function rotate(angle) {
    turtle.rotate(angle)
}


function changeColor(new_color) {
    turtle.color = new_color;
}

function penUp() {
    turtle.penUp = false;
}

function penDown() {
    turtle.penDown = true;
}

function koch(length, dim) {
    if (dim <= 1 || length <= 10) {
        forward(length);
    } else {
        koch(length / 3, dim - 1);
        rotate(60);
        koch(length / 3, dim - 1);
        rotate(240);
        koch(length / 3, dim - 1);
        rotate(60);
        koch(length / 3, dim - 1);
    }
}

function triangle(lenght) {
    rotate(30);
    forward(lenght);
    rotate(120);
    forward(lenght);
    rotate(120);
    forward(lenght);
    rotate(120);
    penUp();
    forward(lenght / 2);
    penDown();
    rotate(60);
    forward(lenght / 2);
    rotate(120);
    forward(lenght / 2);
    rotate(120);
    forward(lenght / 2);
    rotate(240);
    penUp();
    forward(lenght / 2);
    penDown();
    rotate(150);
}

function sierpinski(len, dim) {
    const lenght = len;
    triangle(lenght)
    if (dim > 0 && lenght >= 10) {
        turtle.color = 'black';
        sierpinski(lenght / 2, dim - 1)
        rotate(30);
        forward(lenght);
        rotate(90);
        sierpinski(lenght / 2, dim - 1);
        rotate(30);
        forward(lenght);
        rotate(90);
        sierpinski(lenght / 2, dim - 1);
        rotate(30);
        forward(lenght);
        rotate(90);
    }
}

function firstGraph(lenght, dim) {
    var angle_poligon = 180 - (dim - 2) * 180 / dim
    var positions = []
    for (let i = 0; i < dim; i++) {
        penUp();
        forward(lenght);
        rotate(angle_poligon);
        penDown();
        let x1 = turtle.position.x;
        let y1 = turtle.position.y;
        context.fillRect(x1, y1, 6, 6);
        positions[i] = [x1, y1]
    }

    for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
            context.beginPath();
            context.moveTo(positions[i][0], positions[i][1]);
            context.lineTo(positions[j][0], positions[j][1]);
            context.strokeStyle = 'blue';
            context.stroke();
        }
    }
}

function secondGraph(point_one, point_two) {
    var positions = [];// [[ [x1,y1],[x2,y2],...], [[a1,b1],[a2,b2],...]]
    positions[0] = [];
    positions[1] = [];
    var lines = [];// [[X1,A1],[X1,A2],...,[X2,A1],...], X1=[x1,y1]

    for (let i = 0; i < point_one; i++) {
        let place = 400 / point_one;
        positions[0][i] = [150, i * place + 50];
        context.fillRect(143, i * place + 50, 6, 6);
    }

    for (let i = 0; i < point_two; i++) {
        let place = 400 / point_two;
        positions[1][i] = [350, i * place + 50];
        context.fillRect(350, i * place + 50, 6, 6);
    }

    for (let i = 0; i < point_one * point_two; i++) {
        for (let j = 0; j < point_one; j++) {
            for (let k = 0; k < point_two; k++) {
                lines[i] = [positions[0][j], positions[1][k]];

                context.beginPath();
                context.moveTo(positions[0][j][0], positions[0][j][1]);
                context.lineTo(positions[1][k][0], positions[1][k][1]);
                context.strokeStyle = 'blue';
                context.stroke();
            }
        }
    }
}

function polygon(lenght, dim) {
    var angle_poligon = 180 - (dim - 2) * 180 / dim
    for (let i = 0; i < dim; i++) {
        forward(lenght);
        rotate(angle_poligon);
    }
}


function cleanPlane() {
    context.clearRect(0, 0, 700, 700);
}


function drawRedSquare(x, y, size) {
    context.fillStyle = "red";
    context.fillRect(x, y, size, size);
}

function drawSomeSquares() {
    //Draw background color of main plane
    context.fillStyle = "#8095FF";
    context.fillRect(
        PLANE_DRAW_START_OFFSET, 
        PLANE_DRAW_START_OFFSET, 
        PLANE_SIZE - PLANE_DRAW_END_OFFSET, 
        PLANE_SIZE - PLANE_DRAW_END_OFFSET
    );


    //Draw Start Square
    context.fillStyle = "blue";
    context.fillRect(
        PLANE_DRAW_START_OFFSET, 
        PLANE_DRAW_START_OFFSET, 
        START_SQUARE_SIZE, 
        START_SQUARE_SIZE
    );

    //Draw End Square
    context.fillStyle = "green";
    context.fillRect(
        PLANE_SIZE - PLANE_DRAW_START_OFFSET - START_SQUARE_SIZE, 
        PLANE_SIZE - PLANE_DRAW_START_OFFSET - START_SQUARE_SIZE, 
        START_SQUARE_SIZE, 
        START_SQUARE_SIZE
    );
}

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function drawWinScreen() {
    cleanPlane();
    context.fillStyle = "green";
    goTo(PLANE_SIZE / 2, PLANE_SIZE / 2);
    context.font = '48px serif';
    context.fillText('Win', 60, 50);
}

function drawLoseScreen() {
    cleanPlane();
    context.fillStyle = "red";
    goTo(PLANE_SIZE / 2, PLANE_SIZE / 2);
    context.font = '48px serif';
    context.fillText('Lose', 80, 300);
}

function startGame(countOfRedSquares, lengthOfRedSquare) {
    cleanPlane();
    drawSomeSquares();
    lengthOfObstacleSquare = lengthOfRedSquare

    for (let i = 0; i < countOfRedSquares; i++) {
        let obstacleX = 0;
        let obstacleY = 0;
        while (true) {
            obstacleX = random(
                PLANE_DRAW_START_OFFSET, 
                (PLANE_SIZE - PLANE_DRAW_START_OFFSET) - lengthOfRedSquare
            );
            obstacleY = random(
                PLANE_DRAW_START_OFFSET, 
                (PLANE_SIZE - PLANE_DRAW_START_OFFSET) - lengthOfRedSquare
            );

            const inSmallSquare = (obstacleX <= 50 && obstacleY <= 50)
            const outsideBigSquare = (obstacleX >= 450 - lengthOfRedSquare && obstacleY >= 450 - lengthOfRedSquare)
            if (inSmallSquare || outsideBigSquare) {
                continue;
            } else {
                break;
            }
        }

        redSquares[i] = new Square(new Point(obstacleX, obstacleY), lengthOfRedSquare);
        drawRedSquare(obstacleX, obstacleY, lengthOfRedSquare);
    }

    isInGame = true;
    turtle.drawOnCanvas();
}


var command_list = [];
var current_command = 0;

// Historia "Command"
document.getElementById("command").addEventListener("keydown", (e) => {
    if (e.key == "ArrowUp") {
        current_command--;
        if (current_command < 0) current_command = 0;
        document.getElementById("command").value = command_list[current_command];
    } else if (e.key == "ArrowDown") {
        current_command++;
        if (current_command > command_list.length) current_command = command_list.length;
        var command = command_list[current_command] == undefined ? "" : command_list[current_command];
        document.getElementById("command").value = command;
    }
}, false);

// Wykonuje program kiedy użytkownik wciska "Enter"
document.querySelector('#command').addEventListener('change', function () {
    var command_text = this.value;
    command_list.push(command_text);
    var definitions_Text = document.querySelector('#definitions').value;
    try {
        eval(definitions_Text);
        // Wykonuje kod w "Command"
        eval(command_text);
    } catch (e) {
        alert('Exception thrown:\n' + e);
        throw e;
    } finally {
        // Czyści tekst w "Command"
        this.value = '';
    }
});

 document.onkeydown = function(event) {
     event.preventDefault()
     if (event.key == "ArrowUp") {
         forward(10);
     }
     if (event.key == "ArrowDown") {
         forward(-10);
     }
     if (event.key == "ArrowRight") {
         rotate(10)
     }
     if (event.key == "ArrowLeft") {
         rotate(-10)
     }
 }

