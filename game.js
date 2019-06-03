const MAX_NUMBER = 20;
const MIN_NUMBER = -20;
const MAX_TIME = 300;
const MAX_RADIUS = 80


let particles = [];
let numbers =[];
let bubbles = [];

let clicked = 0;
let bubblesClicked = 0;
let myfont;
let r= MAX_RADIUS;

let time;

let question = [];
let badAnswer = Infinity;
let score = 0;
let level;
let firstOp;
let secondOp;
let operation;
let buttonNiv1;
let buttonNiv2;

let state = 0;

function preload() {
    
    screen = createGraphics(400, 600);
	screen.background(5, 0, 12);
    myFont = loadFont('assets/singlesleeve.ttf');
    for (let i = 0; i < 600; i++) {
		randomChord(0.5 * screen.height, 1.2 * screen.width);
	}
    
}

function setup() {
    createCanvas(400,600);
    background(20);
    init();
    
    
}

function init() {

    buttonNiv1 = new Button(0.5 * width, 200, "1", true);
    buttonNiv2 = new Button(0.7 * width, 200, "2");

    buttonAdd = new Button(0.5 * width, 300, "Add", true);
    buttonSub = new Button(0.7 * width, 300, "Sous");
    buttonMix = new Button(0.9 * width, 300, "Mix");

    buttonOk = new Button(width / 2, 0.75 * height, "GO!");
    buttonRestart = new Button(width /2, 0.8 * height, "GO!");

    timer = MAX_TIME;
    bubbles = [];
    particles = [];
    numbers =[];
    bubbles = [];
    question = [];
    badAnswer = Infinity;
    score = 0;
    clicked = 0;
    bubblesClicked = 0;
    for (let i = 0; i < level * level; i++) {
        bubbles.push(new Bubble((6 - level) * 40 + 80 * (i % level),80 + Math.floor(i/level) * 80 ,round(random(MIN_NUMBER, MAX_NUMBER))));
    }
    to = round(millis() / 1000);
    question = genQuestion();
}

function draw() {
    clear();
    image(screen, 0,0);
    
    switch(state) {
        case 0:
            stateZero();
            break;
        case 1:
            stateOne();
            break;
        case 2:
            stateTwo();
            break;
    }
    
}

function genQuestion() {
    let op1 = round(random(0,bubbles.length -1));
    let op2 = op1;
    while (op2 == op1) {
        op2 = round(random(0,bubbles.length -1));
    }
    switch(operation) {
        case 1:
            return [bubbles[op1].val + bubbles[op2].val, 2];
            break;
        case 2:
            return [bubbles[op1].val - bubbles[op2].val, 1];
        case 3:
            let n = round(random(1,2))
            return [bubbles[op1].val  + pow(-1, n) *  bubbles[op2].val, n];
    }
}

function mouseClicked() {
    switch(state) {
        case 0:
            if (dist(mouseX, mouseY, buttonNiv1.x, buttonNiv1.y)< buttonNiv1.r && !buttonNiv1.clicked) {
                buttonNiv1.clicked = true;
                buttonNiv2.clicked = false;
            } else if (dist(mouseX, mouseY, buttonNiv2.x, buttonNiv2.y)< buttonNiv2.r && !buttonNiv2.clicked) {
                buttonNiv2.clicked = true;
                buttonNiv1.clicked = false;
            }

            if (dist(mouseX, mouseY, buttonAdd.x, buttonAdd.y)< buttonAdd.r && !buttonAdd.clicked) {
                buttonAdd.clicked = true;
                buttonSub.clicked = false;
                buttonMix.clicked = false;
            } else if (dist(mouseX, mouseY, buttonSub.x, buttonSub.y)< buttonSub.r && !buttonSub.clicked) {
                buttonSub.clicked = true;
                buttonAdd.clicked = false;                
                buttonMix.clicked = false;

            } else if (dist(mouseX, mouseY, buttonMix.x, buttonMix.y)< buttonMix.r && !buttonMix.clicked) {
                buttonMix.clicked = true;
                buttonAdd.clicked = false;                
                buttonSub.clicked = false;

            }

            if (dist(mouseX, mouseY, buttonOk.x, buttonOk.y)< buttonOk.r && !buttonOk.clicked) {
                init();
                state = 1;
                
            }
            break;
        case 1:
            for (bub of bubbles) {
                if (dist(mouseX, mouseY, bub.x, bub.y)< bub.r && !bub.clicked) {
                    bub.clicked = true;
                    bubblesClicked +=1;
                    if (bubblesClicked == 1) {
                        firstOp = bub.val;
                    } else {
                        secondOp = bub.val;
                    }
                } else if (dist(mouseX, mouseY, bub.x, bub.y)< bub.r && bub.clicked){
                    bub.clicked = false;
                    bubblesClicked -=1;
                }
            }
            break;
        case 2:
            if (dist(mouseX, mouseY, buttonOk.x, buttonRestart.y)< buttonRestart.r && !buttonRestart.clicked) {
                state = 0;
            }
            break;
    }
    
}

function stateZero() {
    level = 4;
    fill(255);
    textFont(myFont);
    textSize(24);
    textAlign(LEFT, TOP);
    text('Trouvez les deux nombres qui donnent le résultat\nindiqué avec l\'opération proposée.\nVous avez 5 minutes', 10,10);
    textSize(48);
    textAlign(LEFT,CENTER);
    text('Niveau', 10, 200);
    buttonNiv1.show();
    buttonNiv2.show();

    fill(255);
    textFont(myFont);
    textSize(48);
    textAlign(LEFT, CENTER);
    text('Operations', 10, 300);
    buttonAdd.show();
    buttonSub.show();
    buttonMix.show();
    buttonOk.show();
    if (buttonNiv1.clicked) {
        level = 4;
    } else if (buttonNiv2.clicked) {
        level = 5;
    }

    if (buttonAdd.clicked) {
        operation = 1;
    } else if (buttonSub.clicked) {
        operation = 2;
    } else if (buttonMix.clicked) {
        operation = 3;
    }
}

function stateOne() {
    
    
    fill(255);
    textFont(myFont);
    textSize(24);
    time = round(millis() / 1000) - to;
    text( time, 0.025 * width, 0.025 * height);
    text(score, 0.975 * width, 0.025 * height);
    if (time > MAX_TIME) {
        state = 2;
    }

    for (let bub of bubbles) {
        bub.show();
    }
    for (part of particles) {
        if (part.active) {
            part.update(1/frameRate());
            part.show();
        }
    }
    for (let i = 0; i < particles.length; i++) {
        if(!particles[i].active) {
            particles.splice(i,1);
        }
    }

    // show badAnswer
    if (badAnswer != Infinity) {
        fill(255,0,0,200);
        let x = width / 2;
        let y = height / 2;
        ellipse(x, y, r * 2);
        r -= 30/frameRate();
        fill(255)
        textSize(56);
        text(badAnswer, x,y);
    
    }
    if (r < 24) {
        r = MAX_RADIUS;
        badAnswer = Infinity;
    }

    fill(250,150,180,200);
    textFont(myFont);
    textAlign( CENTER, BASELINE)
    textStyle(BOLD);
    textSize(100);
    
    switch(question[1]) {
        case 1:
            text("Soustraction", width / 2, 0.98 * height);
            break;
        case 2: 
            text("Addition", width / 2, 0.98 * height);
            break;
    }


    fill(255);
    textFont(myFont);
    textSize(48);
    text(question[0], width / 2, 0.8 * height);

    if (bubblesClicked == 2) {
        if (question[0] == firstOp + pow(-1, question[1]) * secondOp) {
            background(0,255,0);
            score +=1;
            genNewBubble();
            question = genQuestion();
            
        } else {
            background(255,0,0);
            for (let bub of bubbles) {
                let op = [];
                if(bub.clicked) {
                    op.push(bub.val);
                    bub.clicked = false;
                    bubblesClicked -=1;
                }
                badAnswer =firstOp + pow(-1, question[1]) * secondOp;
            }
        }
    }
}

function stateTwo() {
    fill(255);
    textFont(myFont);
    textSize(56);
    textAlign(CENTER,CENTER);
    text("Game Over", width / 2, height /2);
    textSize(36);
    text("Total : " + score + " points", width / 2, 0.65 * height);
    buttonRestart.show();
}

function genNewBubble() {
    for (let bub of bubbles) {
        if(bub.clicked) {
            bub.val = round(random(MIN_NUMBER,MAX_NUMBER));
            bub.r = random(30,40);
            bub.clicked = false;
            bubblesClicked -=1;
            rainOfPatricles(bub.x, bub.y);
        }
    }
    
}

function rainOfPatricles(x,y) {
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle(x, y, random(80, 160), i * PI / 40 ));
    }
}

function star(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }

function randomChord(x,y) {
    // find a random point on a circle
    let angle1 = random(0, 2 * PI);
    let xpos1 = x + y * cos(angle1);
    let ypos1 = x + y * sin(angle1);

    // find another random point on the circle
    let angle2 = random(0, 2 * PI);
    let xpos2 = x + y * cos(angle2);
    let ypos2 = x + y * sin(angle2);

    // draw a line between them
    screen.stroke(255, 255, 255, 15);
    screen.line(xpos1, ypos1, xpos2, ypos2);
}  

class Bubble {
    constructor(x, y, val) {
        this.x = x;
        this.y = y;
        this.val = val;
        this.r = random(30,40);
        this.clicked = false;
        this.over = false;
        this.off = random(1,100);
    }

    show() {
        if (this.clicked && !this.over) {
            fill(250,150,150);
        } else if (this.over) {
            fill(150,250,150,200);
        } else {
            fill(150,150,250,200);
        }
        noStroke();
        let noiseX =  noise(this.x + this.off) * 5;
        let noiseY = noise(this.y + this.off) * 5;
        this.off +=0.01
        ellipse(this.x + noiseX, this.y + noiseY, this.r * 2);
        textSize(48);
        textFont(myFont);
        textAlign(CENTER, CENTER);
        fill(20);
        text(this.val, this.x +noiseX, this.y + noiseY);

    }
}

class Particle {
	constructor(x,y, speed, theta) {
		this.pos = createVector(x,y);
		this.speed = createVector(speed * cos(theta), speed * sin(theta));
		this.acc = createVector(0,300) // Gravity
		this.radius = random(2,4);
		this.active = true;
	}

    update(t) {
		this.speed.add(p5.Vector.mult(this.acc, t));
		this.pos.add(p5.Vector.mult(this.speed, t));
		if (this.pos.y >  height) {
			this.active = false;
		}
	}

	show() {
		noStroke();
		fill(255,255 * random(0.5,1),20);
		ellipse(this.pos.x, this.pos.y, this.radius*2 + random(-1,1));
	}
}

class Button {
    constructor(x,y, text, state) {
        this.x = x;
        this.y = y;
        this.clicked = state;
        this.r = 30;
        this.color = color(150,150,250,200);
        this.colorClicked =  color(250,150,150, 200);
        this.text = text
    }

    show() {
        if (this.clicked) {
            fill(this.colorClicked);
        } else {
            fill(this.color);
        }
        noStroke();
        ellipse(this.x, this.y, this.r * 2);
        fill(0);
        textSize(36);
        textAlign(CENTER, CENTER);
        text(this.text, this.x, this.y);
    }
}