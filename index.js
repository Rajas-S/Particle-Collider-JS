// Particle Collider physics system by Rajas Sharma

// TODO: fix the particle fusion - particles "sticking" to each other
//       => the application of restitution on velocity is wrong... FIX IT -##### THE PHYSICS EQUATION FOR 1D COLLISION IS FOR ELASTIC COLLISION 
//                                                                               - ADJUST THE EQUATION FOR INELASTIC COLLISIONS WHERE 0<=RESTITUTION<=1 
//       stop dt from spiking if exit tab



const WIDTH = 1540, HEIGHT = 730;
const SCREENX1 = 300, SCREENX2 = 1200, SCREENY1 = 0, SCREENY2 = HEIGHT
const ctx = document.getElementById("myCanvas").getContext("2d");
ctx.font = "18px serif";

// add mouse event listeners
let mouseX, mouseY;
let mousedown = 0;
document.addEventListener('pointermove', function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
});
document.addEventListener('pointerdown', function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    mousedown = 1;
});
document.addEventListener('pointerup', function(event) {
    mousedown = 0;
});
document.addEventListener('pointercancel', function(event) {
    mousedown = 0;
});

let SIMSPEED = 1;
let restitution = 0.9;
let gridshow = 0;
let showparticlecolour = 0;
let particlerect = 1;

let MAXPARTICLERADIUS = 5;
const PARTICLECOLOURVALUE = 180;
const TICKINTERVAL = 5;

let pause = 0;

let n = 1000;
let p = Array(n);

let lasttime = performance.now()/1000;
let currenttime;
let dt;
let fps;
let ticks = 0;

let GnA = Array(n);
let iA = Array(n);
let numX = Math.ceil((SCREENX2-SCREENX1)/(2*MAXPARTICLERADIUS));
let numY = Math.ceil((SCREENY2-SCREENY1)/(2*MAXPARTICLERADIUS));
let POSALEN = numX*numY+1;
let posA = Array(POSALEN).fill(0);

// -------------------------------------

function setup() {
  ctx.lineWidth = 0.05;
  ctx.strokeStyle = "rgb(220,220,220)";
  // initalise n random particles with random attributes
  for(let i=0;i<n;i++){
    //let x = 900*Math.round(random(0,1))+300;
    //let y = 500*Math.round(random(0,1))+100;
    let x = Math.random()*(SCREENX2-SCREENX1)+SCREENX1;
    let y = Math.random()*(SCREENY2-SCREENY1)+SCREENY1;
    let r = Math.random()*MAXPARTICLERADIUS+0.1;
    let m = r*r;
    let vx = Math.random()*300-150;
    let vy = Math.random()*300-150;
    p[i]= new Particle(r,m,x,y,vx,vy,0,0);
  }

  // n+=1;
  // let x = random(0,WIDTH);
  // let y = random(0,HEIGHT);
  // let r = random(50,50);
  // let m = r*r;
  // let vx = random(-50,50);
  // let vy = random(-50,50);
  // p.push(new Particle(r,m,800,50,0,200,0,0))

}
function main(){

  ctx.fillStyle = "rgb(0,0,8)"
  ctx.fillRect(0,0,WIDTH,HEIGHT);
  drawGUI();


  SpatialPartitioning();
  
  
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
    p[i].draw(showparticlecolour,particlerect);
  }
}
function draw() {
  ticks++;
  ctx.fillRect(0,0,50,50);
    currenttime = performance.now()/1000;
    dt = currenttime-lasttime;
    if(ticks%TICKINTERVAL==0){fps = 1/dt;}
    lasttime=currenttime;
  
    main();
    GUI();

    // show grid
    if(gridshow){
      for(let x=0;x<numX;x++){
        for(let y=0;y<numY;y++){
          ctx.strokeRect(x*2*MAXPARTICLERADIUS+SCREENX1,y*2*MAXPARTICLERADIUS+SCREENY1,2*MAXPARTICLERADIUS,2*MAXPARTICLERADIUS);
        }
      }
    }

    // request new frame
    requestAnimationFrame(draw);
}


function SpatialPartitioning(){
  // fill out Grid number Array (GnA)
  GnA.fill(0);
  posA.fill(0);
  for(let i=0;i<n;i++){
    let xpos = Math.floor(p[i].x/(2*MAXPARTICLERADIUS));
    let ypos = Math.floor(p[i].y/(2*MAXPARTICLERADIUS));
    let cellNumber = xpos+ypos*numX
    GnA[i]=cellNumber; // cell position/hash
    posA[cellNumber]+=1;
  }

  // turn posA into partial sums array:
  let running_total = 0;
  for(let i=0;i<POSALEN;i++){
    running_total+=posA[i]
    posA[i]=running_total
  }

  // fill out particle array (iA)
  for(let i=0;i<n;i++){
    posA[GnA[i]]-=1;
    iA[posA[GnA[i]]]=i;
  }

  // do checks
  for(let i=0;i<POSALEN-1;i++){
    if(posA[i+1]-posA[i]>0){
      for(let k=posA[i];k<posA[i+1];k++){

        let i1 = clampMin(i-numX,0);
        let i2 = clamp(i+1-numX,0,POSALEN);

        const particleK = p[iA[k]];

        for(let j=posA[clampMin(i-1-numX,0)];j<posA[i1];j++){particleK.Collide(p[iA[j]]);}
        for(let j=posA[i1];j<posA[i2];j++){particleK.Collide(p[iA[j]]);}
        for(let j=posA[i2];j<posA[clamp(i+2-numX,0,POSALEN)];j++){particleK.Collide(p[iA[j]]);}
        for(let j=posA[clampMin(i-1,0)];j<posA[i];j++){particleK.Collide(p[iA[j]]);}
        for(let j=k+1;j<posA[clampMax(i+1,POSALEN)];j++){particleK.Collide(p[iA[j]]);}

      }
    }
  }
}

// ---------------------------
setup();
// initialise gui
initGUI();
draw();
