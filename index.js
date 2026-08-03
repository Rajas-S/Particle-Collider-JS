// Particle Collider physics system by Rajas Sharma

// TODO: fix the particle fusion - particles "sticking" to each other
//       => the application of restitution on velocity is wrong... FIX IT -##### THE PHYSICS EQUATION FOR 1D COLLISION IS FOR ELASTIC COLLISION 
//                                                                               - ADJUST THE EQUATION FOR INELASTIC COLLISIONS WHERE 0<=RESTITUTION<=1 
//       stop dt from spiking if exit tab


const WIDTH = 1520, HEIGHT = 708;
const SCREENX1 = 300, SCREENX2 = 1200, SCREENY1 = 0, SCREENY2 = HEIGHT

let SIMSPEED = 1;
let restitution = 0.9;
let gridshow = 0;
let showparticlecolour = 0;
let particlerect = 1;

const MAXPARTICLERADIUS = 2;
const PARTICLECOLOURVALUE = 180;

let pause = 0;

let n = 15000;
let p = Array(n);

let lasttime = performance.now()/1000;
let currenttime;
let dt;
let fps;

let GnA = Array(n);
let iA = Array(n);
const numX = Math.ceil((SCREENX2-SCREENX1)/(MAXPARTICLERADIUS));
const numY = Math.ceil((SCREENY2-SCREENY1)/(MAXPARTICLERADIUS));
const POSALEN = numX*numY+1;
let posA = Array(POSALEN).fill(0);

// -------------------------------------

function setup() {
  createCanvas(WIDTH, HEIGHT);
  noStroke();
  // initalise n random particles with random attributes
  for(let i=0;i<n;i++){
    //let x = 900*Math.round(random(0,1))+300;
    //let y = 500*Math.round(random(0,1))+100;
    let x = random(SCREENX1,SCREENX2);
    let y = random(SCREENY1,SCREENY2);
    let r = random(1.7,1.7);
    let m = r*r;
    let vx = random(-150,150);
    let vy = random(-150,150);
    p[i]=new Particle(r,m,x,y,vx,vy,0,100);
  }

  // n+=1;
  
  // let x = random(0,WIDTH);
  // let y = random(0,HEIGHT);
  // let r = random(50,50);
  // let m = r*r;
  // let vx = random(-50,50);
  // let vy = random(-50,50);
  // p.push(new Particle(r,m,800,50,0,200,0,0))


  // initialise gui
  initGUI();

  // start main func

}
function main(){
    //background(255,238,0);
    background(0,0,8);
    noStroke();
    drawGUI();
    // particles check and collide
    // for(let j=0;j<n;j++){
    //   for(let k=j+1;k<n;k++){
    //     if(p[j].CheckCollision(p[k])){
    //           p[j].Collide(p[k]);
    //     }
    //   }
    // }

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
  currenttime = performance.now()/1000;
  dt = currenttime-lasttime;
  fps = 1/dt;
  lasttime=currenttime;

  main();
  GUI();
  if(gridshow){
    for(let x=0;x<numX;x++){
      for(let y=0;y<numY;y++){
        stroke(255);
        strokeWeight(0.1);
        noFill();
        rect(x*MAXPARTICLERADIUS+SCREENX1,y*MAXPARTICLERADIUS+SCREENY1,MAXPARTICLERADIUS,MAXPARTICLERADIUS);
      }
    }
  }
}


function SpatialPartitioning(){
  // fill out Grid number Array (GnA)
  GnA.fill(0);
  posA.fill(0);
  for(let i=0;i<n;i++){
    let xpos = Math.floor(p[i].x/(MAXPARTICLERADIUS));
    let ypos = Math.floor(p[i].y/(MAXPARTICLERADIUS));
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
        for(let j=posA[i];j<posA[clampMax(i+1,POSALEN)];j++){particleK.Collide(p[iA[j]]);}

      }
    }
  }
}
