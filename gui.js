const PADDING = 10;
let GRABRADIUS = 100;
let SENSITIVITY = 2;
let x_prev, y_prev;
let stored_simspeed;

function initGUI(){
    pauseButton = new Button(30,20,50,20,"Pause",16,255,0,51,pausefunc);
    startButton = new Button(30,50,50,20,"Start",16,0,230,84,startfunc);
    simSpeed = new Slider(30,100,90,10,"Simulation Speed",16,50,50,50,2,1,1,0);
    restitution_slider = new Slider(30,170,90,10,"Constant of Restitution",16,50,50,50,1.08,1,0.974,0.025);
    grabradius_slider = new Slider(30,240,90,10,"Grab Radius",16,50,50,50,200,100,100,0);
    sensitivity_slider = new Slider(30,310,90,10,"Sensitivity",16,50,50,50,5,2,2,0);
    

    x_prev = mouseX; y_prev = mouseY;

}

function drawGUI(){
    // draw main GUI frame
    ctx.fillStyle = "rgb(0,0,40)";
    ctx.fillRect(SCREENX1-PADDING,SCREENY1-PADDING,SCREENX2-SCREENX1+2*PADDING,SCREENY2-SCREENY1+2*PADDING);
}
function GUI(){
    // mouse grab
    if(mousedown && mouseX>SCREENX1 && mouseX<SCREENX2 && mouseY>SCREENY1 && mouseY<SCREENY2){
        ctx.fillStyle = "rgb(220 220 220 / 50%)";
        ctx.beginPath();
        ctx.arc(mouseX,mouseY,GRABRADIUS,0,2*Math.PI);
        ctx.fill();
        moveParticles(mouseX,mouseY,x_prev,y_prev);
    }
    x_prev = mouseX; y_prev = mouseY;

    // do buttons
    pauseButton.draw();
    pauseButton.click();

    startButton.draw();
    startButton.click();

    simSpeed.draw();
    if(!pause){SIMSPEED=simSpeed.click();}
    restitution_slider.draw();
    restitution=restitution_slider.click();

    grabradius_slider.draw();
    GRABRADIUS = grabradius_slider.click()

    sensitivity_slider.draw();
    SENSITIVITY = sensitivity_slider.click();
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
        ctx.fillStyle = `rgb(${this.colour[0]},${this.colour[1]},${this.colour[2]})`;
        ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillText(this.title,this.x+this.ts*0.25,this.y+this.height-this.ts*0.25);
    }

    click(){
        if(mousedownX>this.x && mousedownY>this.y && mousedownX<this.x+this.width && mousedownY<this.y+this.height){
            this.func();
        }
    }
}

class Slider{
    constructor(x,y,w,h,title,titlesize,r,g,b,max,default_,start,radius){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.title = title;
        this.ts = titlesize;
        this.colour = [r,g,b];
        this.default_xs =  w*default_/max;
        this.xs = w*start/max;
        this.max=max;
        this.value = start;
        this.radius = radius;
        this.default = default_;
    }

    draw(){
        ctx.fillStyle = "rgb(220,220,220)";
        ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.fillStyle = `rgb(${this.colour[0]},${this.colour[1]},${this.colour[2]})`;
        ctx.fillRect(this.x,this.y,this.xs,this.height);
        ctx.fillStyle = "rgb(240,240,240)";
        ctx.fillText(this.title,this.x,this.y-this.ts*0.5);
        ctx.fillText(this.value.toFixed(3),this.x,this.y+this.ts*1.75);
    }

    click(){
        if(mousedown && mouseX>this.x && mouseY>this.y && mouseX<this.x+this.width && mouseY<this.y+this.height){

            this.xs = mouseX-this.x;
            this.value = this.xs*this.max/this.width;
            if((this.default-this.value)*(this.default-this.value)<this.radius*this.radius){
                //this.xs=this.width*this.default/this.max;
                this.xs = this.default_xs;
            }
        }
        this.value = this.xs*this.max/this.width;
        return this.value;
    }
}

// button function pool
function pausefunc(){
    stored_simspeed = SIMSPEED;
    SIMSPEED = 0;
    pause=1;
}
function startfunc(){
    SIMSPEED = stored_simspeed;
    pause=0;
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