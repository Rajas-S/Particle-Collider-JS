const PADDING = 10;
const GRABRADIUS = 100;
const SENSITIVITY = 2;
let x_prev, y_prev;

function initGUI(){
    pauseButton = new Button(30,20,50,20,"Pause",16,255,0,51,pausefunc);
    startButton = new Button(30,50,50,20,"Start",16,0,230,84,startfunc);
    simSpeed = new Slider(30,90,90,10,"Simulation Speed",16,50,50,50);

    x_prev = mouseX; y_prev = mouseY;

}

function drawGUI(){
    // draw main GUI frame
    fill(0,0,40);
    rect(SCREENX1-PADDING,SCREENY1-PADDING,SCREENX2-SCREENX1+2*PADDING,SCREENY2-SCREENY1+2*PADDING);

    let x = mouseX; let y = mouseY;
    if(x>SCREENX1 && x<SCREENX2 && y>SCREENY1 && y<SCREENY2){
        if(mouseIsPressed){
            fill(220,220,220,70);
            ellipse(x,y,2*GRABRADIUS,2*GRABRADIUS);
            if(mouseButton == LEFT){moveParticles(x,y,x_prev,y_prev);}
            else if(mouseButton == RIGHT){grabParticles();}
        }
    }
    x_prev = x; y_prev = y;
}
function GUI(){
    // do buttons
    pauseButton.draw();
    pauseButton.click();

    startButton.draw();
    startButton.click();

    simSpeed.draw();
    SIMSPEED=simSpeed.click();
}

class Button{
    constructor(x,y,w,h,title,titlesize,r,g,b,func){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.title = title;
        this.ts = titlesize;
        this.colour = [r,g,b];
        this.func = func;
    }

    draw(){
        fill(this.colour[0],this.colour[1],this.colour[2]);
        rect(this.x,this.y,this.width,this.height);
        textSize(this.ts);
        fill(0);
        text(this.title,this.x+this.ts*0.25,this.y+this.height-this.ts*0.25);
    }

    click(){
        let x = mouseX;
        let y = mouseY;
        if(x>this.x && y>this.y && x<this.x+this.width && y<this.y+this.height){
            if(mouseIsPressed && mouseButton == LEFT){this.func();}
        }
    }
}

class Slider{
    constructor(x,y,w,h,title,titlesize,r,g,b){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.title = title;
        this.ts = titlesize;
        this.colour = [r,g,b];
        this.xs = w*0.5;
    }

    draw(){
        fill(220);
        rect(this.x,this.y,this.width,this.height);
        fill(this.colour[0],this.colour[1],this.colour[2]);
        rect(this.x,this.y,this.xs,this.height);
        textSize(this.ts);
        fill(240);
        text(this.title,this.x,this.y+this.height-this.ts*0.75);
    }

    click(){
        let x = mouseX;
        let y = mouseY;
        if(x>this.x && y>this.y && x<this.x+this.width && y<this.y+this.height){
            if(mouseIsPressed && mouseButton == LEFT){
                this.xs = x-this.x;
            }
        }
        return this.xs*2/this.width;
    }
}

// button function pool
function pausefunc(){
    pause = 1;
}
function startfunc(){
    pause = 0;
}

function moveParticles(x,y,x_prev,y_prev){
    for(let i=0;i<n;i++){
        if(distSq(p[i].x-x,p[i].y-y) < (GRABRADIUS+p[i].radius)*(GRABRADIUS+p[i].radius)){
            p[i].x += (x-x_prev);
            p[i].y += (y-y_prev);
            p[i].vx = SENSITIVITY*(x-x_prev);
            p[i].vy = SENSITIVITY*(y-y_prev);
        }
    }
}

function grabParticles(){

}