// TODO;
//    fix the particle fusion - particles "sticking" to each other


const WIDTH = 400, HEIGHT = 400;

let n = 1000;
let p = [];

class Vector2{
  constructor(x,y){
    this.x=x;
    this.y=y;
  }
}


function setup() {
  frameRate(2000)
  createCanvas(WIDTH, HEIGHT);
  // noprotect
  for(i=0;i<n;i++){
    x = i*WIDTH/(n);
    y= random(0,HEIGHT/4);
    r = random(2,2);
    m = r*r;
    vx = random(-4,0);
    vy = random(-4,0);
    append(p,new Particle(r,m,x,y,vx,vy,0,0,1))
  }
}

function draw() {
    background(220);

    for(let j=0;j<n;j++){

        if(j<n/2){fill(255,0,0)}
        else{fill(0,0,255)}

        for(let k=j+1;k<n;k++){
        if(p[j].CheckCollision(p[k])){
            //fill(random(0,255));
            p[j].Collide(p[k])
        }
        }
        
        p[j].CheckWallCollision();
        p[j].update()
        p[j].draw() 

    }
}

