// Particle Collider physics system by Rajas Sharma

// TODO: fix the particle fusion - particles "sticking" to each other
//       => the application of restitution on velocity is wrong... FIX IT -##### THE PHYSICS EQUATION FOR 1D COLLISION IS FOR ELASTIC COLLISION 
//                                                                               - ADJUST THE EQUATION FOR INELASTIC COLLISIONS WHERE 0<=RESTITUTION<=1 
//       stop dt from spiking if exit tab


const WIDTH = 1520, HEIGHT = 708;
const SCREENX1 = 300, SCREENX2 = 1200, SCREENY1 = 0, SCREENY2 = HEIGHT

let SIMSPEED = 1;

let restitution = 0.9;


let pause = 0;

let n = 3500;
let p = [];

let lasttime = Date.now()/1000;
let currenttime;
let dt;
let fps;

// -------------------------------------

function setup() {
  createCanvas(WIDTH, HEIGHT);
  noStroke();
  // initalise n random particles with random attributes
  for(let i=0;i<n;i++){
    let x = 900*Math.round(random(0,1))+300;
    let y = 500*Math.round(random(0,1))+100;
    let r = random(0.1,2.5);
    let m = r*r;
    let vx = random(-150,0);
    let vy = random(-100,0)
    p.push(new Particle(r,m,x,y,vx,vy,0,0))
  }

  n+=1;
  
  let x = random(0,WIDTH);
  let y = random(0,HEIGHT);
  let r = random(25,30);
  let m = r*r;
  let vx = random(-50,50);
  let vy = random(-50,50)
  p.push(new Particle(r,m,x,y,vx,vy,0,0))


  // initialise gui
  initGUI();

  // start main func

}
function main(){
    //background(255,238,0);
    background(0,0,8);
    drawGUI();
    // particles check and collide
    for(let j=0;j<n;j++){
      for(let k=j+1;k<n;k++){
        if(p[j].CheckCollision(p[k])){
              p[j].Collide(p[k]);
        }
      }
    }
  
  
    //particles check wall collision
    for(let i=0;i<n;i++){
       p[i].CheckWallCollision(SCREENX1,SCREENY1,SCREENX2,SCREENY2);
    }
  
    // particles update positions and velocities
  
    for(let i=0;i<n;i++){
       p[i].update(dt,SIMSPEED);
    }
  
    // draw each particle
    for(let i=0;i<n;i++){
       p[i].draw(); 
    }
}
function draw() {
  currenttime = Date.now()/1000;
  dt = currenttime-lasttime;
  fps = 1/dt;
  lasttime=currenttime;

  if(!pause){main();}
  GUI();
}

