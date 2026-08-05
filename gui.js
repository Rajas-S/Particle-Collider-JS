const PADDING = 10;
let GRABRADIUS = 100;
let SENSITIVITY = 2;
let x_prev, y_prev;
let stored_simspeed;

function initGUI(){
    pauseButton = new Button(30,20,50,30,"Pause",16,255,0,51,pausefunc);
    startButton = new Button(100,20,50,30,"Start",16,0,230,84,startfunc);
    resetButton = new Button(1240,70,50,30,"Reset",16,240,240,240,resetfunc);

    simSpeed = new Slider(30,100,90,20,"Simulation Speed",16,50,50,50,5,1,1,0);
    restitution_slider = new Slider(30,170,90,20,"Constant of Restitution",16,50,50,50,1.08,1,0.974,0.025);
    grabradius_slider = new Slider(30,240,90,20,"Grab Radius",16,50,50,50,200,100,100,0);
    sensitivity_slider = new Slider(30,310,90,20,"Sensitivity",16,50,50,50,5,2,2,0);
    gridwidth_slider = new Slider(30,510,90,20,"Grid Width",16,50,50,50,0.5,0.1,0.1,0);

    colour_toggle = new ToggleButton(30,380,"Colour",16,1);
    particlerect_toggle =  new ToggleButton(130,380,"ParticleRect",16,0);
    gridshow_toggle =  new ToggleButton(30,440,"ShowGrid",16,0);

    framerate_infotext = new InfoText(1240,30,"FPS");
    particlenumber_infotext = new InfoText(1240,60,"Number Of Particles");

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

    resetButton.draw();
    resetButton.click();

    simSpeed.draw();
    if(!pause){SIMSPEED=simSpeed.click();}
    restitution_slider.draw();
    restitution=restitution_slider.click();

    grabradius_slider.draw();
    GRABRADIUS = grabradius_slider.click()

    sensitivity_slider.draw();
    SENSITIVITY = sensitivity_slider.click();

    gridwidth_slider.draw();
    ctx.lineWidth = gridwidth_slider.click();

    colour_toggle.draw();
    showparticlecolour = colour_toggle.click();

    particlerect_toggle.draw();
    particlerect = particlerect_toggle.click();

    gridshow_toggle.draw();
    gridshow = gridshow_toggle.click();

    framerate_infotext.draw(fps);
    particlenumber_infotext.draw(n);

}

class Button{
    constructor(x,y,w,h,title,titlesize,r,g,b,func){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.title = title;
        this.ts=titlesize;
        this.colour = [r,g,b];
        this.func = func;
        this.downtoggle = 0;
    }

    draw(){
        ctx.fillStyle = `rgb(${this.colour[0]},${this.colour[1]},${this.colour[2]})`;
        ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillText(this.title,this.x+this.ts*0.25,this.y+this.height-this.ts*0.25);
    }

    click(){
        if(mousedown && !this.downtoggle && mouseX>this.x && mouseY>this.y && mouseX<this.x+this.width && mouseY<this.y+this.height){
            this.downtoggle=1;
            this.func();
        }
        else if (!mousedown && this.downtoggle){this.downtoggle=0;}
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
        this.downtoggle=0;
    }

    draw(){
        ctx.fillStyle = "rgb(220,220,220)";
        ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.fillStyle = `rgb(${this.colour[0]},${this.colour[1]},${this.colour[2]})`;
        ctx.fillRect(this.x,this.y,this.xs,this.height);
        ctx.fillStyle = "rgb(240,240,240)";
        ctx.fillText(this.title,this.x,this.y-this.ts*0.5);
        ctx.fillText(this.value.toFixed(3),this.x,this.y+this.ts*2.5);
    }

    click(){
        if(mousedown && mouseX>this.x && mouseY>this.y && mouseX<this.x+this.width && mouseY<this.y+this.height){

            this.downtoggle=1;
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

class ToggleButton{
    constructor(x,y,title,titlesize,start){
        this.x = x;
        this.y = y;
        this.title = title;
        this.ts = titlesize;
        this.value = start; 
        this.downtoggle = 0;
    }

    draw(){
        if(this.value){ctx.fillStyle = "rgb(0,200,255)";}
        else{ctx.fillStyle = "rgb(220,220,220)";}
        ctx.fillRect(this.x,this.y,20,20);
        ctx.fillText(`${this.title}: ${this.value}`,this.x,this.y-this.ts*0.5);
    }

    click(){
        if(mousedown && !this.downtoggle && mouseX>this.x && mouseY>this.y && mouseX<this.x+20 && mouseY<this.y+20){this.downtoggle=1; this.value = (this.value+1)%2;}
        else if(!mousedown && this.downtoggle){this.downtoggle=0;}
        return this.value;
    }
}

class InfoText{
    constructor(x,y,text){
        this.x=x;
        this.y=y;
        this.text=text;
    }
    draw(info){
        ctx.fillStyle="rgb(240,240,240)";
        ctx.fillText(`${this.text}: ${info}`,this.x,this.y);
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
        if(distSq(px[i]-x,py[i]-y) < (GRABRADIUS+pradius[i])*(GRABRADIUS+pradius[i])){
            px[i] += (x-x_prev);
            py[i] += (y-y_prev);
            pvx[i] = SENSITIVITY*(x-x_prev);
            pvy[i] = SENSITIVITY*(y-y_prev);
        }
    }
}

function resetfunc(){
    let new_n = document.getElementById("new_n").value;
    if(new_n!=""){n=new_n}
    pradius = new Float32Array(n);
    pmass = new Float32Array(n);
    px = new Float32Array(n);
    py = new Float32Array(n);
    pvx = new Float32Array(n);
    pvy = new Float32Array(n);
    pax = new Float32Array(n);
    pay = new Float32Array(n);
    new_MAXPARTICLERADIUS = document.getElementById("new_maxparticleradius").value;
    if(new_MAXPARTICLERADIUS!=""){MAXPARTICLERADIUS = new_MAXPARTICLERADIUS;}
    GnA = new Uint32Array(n);
    iA = new Uint32Array(n);
    numX = Math.ceil((SCREENX2-SCREENX1)/(2*MAXPARTICLERADIUS));
    numY = Math.ceil((SCREENY2-SCREENY1)/(2*MAXPARTICLERADIUS));
    POSALEN = numX*numY+1;
    posA = new Uint32Array(POSALEN);
    setup();
}