// Particle Collider physics system by Rajas Sharma

//-----------------------------------------------------

const WIDTH = 1580, HEIGHT = 728;
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
    x_prev=mouseX;
    y_prev=mouseY;
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

let pause = 0;

let n = 1000;
let pradius = new Float32Array(n);
let pmass = new Float32Array(n);
let px = new Float32Array(n);
let py = new Float32Array(n);
let pvx = new Float32Array(n);
let pvy = new Float32Array(n);
let pax = 0;
let pay = 0;

let lasttime = performance.now()/1000;
let lastfpstimestamp = lasttime;
let currenttime;
let dt;
let fps;

let GnA = new Uint32Array(n);
let iA = new Uint32Array(n);
let numX = Math.ceil((SCREENX2-SCREENX1)/(2*MAXPARTICLERADIUS));
let numY = Math.ceil((SCREENY2-SCREENY1)/(2*MAXPARTICLERADIUS));
let POSALEN = numX*numY+1;
let posA = new Uint32Array(POSALEN);

// -------------------------------------

function setup() {
  ctx.lineWidth = 0.05;
  ctx.strokeStyle = "rgb(220,220,220)";
  // initalise n random particles with random attributes
  for(let i=0;i<n;i++){
    px[i] = Math.random()*(SCREENX2-SCREENX1)+SCREENX1;
    py[i] = Math.random()*(SCREENY2-SCREENY1)+SCREENY1;
    pradius[i] = Math.random()*MAXPARTICLERADIUS*0.8+0.1;
    pmass[i] = pradius[i]*pradius[i];
    pvx[i] = Math.random()*300-150;
    pvy [i]= Math.random()*300-150;
  }
}

function SpatialPartitioning(){
  // fill out Grid number Array (GnA)
  GnA.fill(0);
  posA.fill(0);
  for(let i=0;i<n;i++){
    let xpos = Math.floor((px[i]-SCREENX1)/(2*MAXPARTICLERADIUS));
    let ypos = Math.floor((py[i]-SCREENY1)/(2*MAXPARTICLERADIUS));
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


        //ctx.fillStyle = "rgb(255 0 0 / 50%)"
        const particleK = iA[k];

        let ix = i%numX;
        let i_minus_numX = i-numX;

        if(i_minus_numX>0 && ix>0){
          for(let j=posA[i-1-numX];j<posA[i-numX];j++){pCollide(particleK,iA[j]);} // nw
          //if(particleK==0){ctx.fillRect((i-1-numX)%numX*2*MAXPARTICLERADIUS+SCREENX1,Math.floor((i-1-numX)/numX)*2*MAXPARTICLERADIUS+SCREENY1,2*MAXPARTICLERADIUS,2*MAXPARTICLERADIUS);}
        }
        if(i_minus_numX>=0){
          for(let j=posA[i-numX];j<posA[i+1-numX];j++){pCollide(particleK,iA[j]);} // n
          //if(particleK==0){ctx.fillRect((i-numX)%numX*2*MAXPARTICLERADIUS+SCREENX1,Math.floor((i-numX)/numX)*2*MAXPARTICLERADIUS+SCREENY1,2*MAXPARTICLERADIUS,2*MAXPARTICLERADIUS);}
        }
        if(i_minus_numX>=0 && ix<numX-1){
          for(let j=posA[i+1-numX];j<posA[i+2-numX];j++){pCollide(particleK,iA[j]);} // ne
          //if(particleK==0){ctx.fillRect((i+1-numX)%numX*2*MAXPARTICLERADIUS+SCREENX1,Math.floor((i+1-numX)/numX)*2*MAXPARTICLERADIUS+SCREENY1,2*MAXPARTICLERADIUS,2*MAXPARTICLERADIUS);}
        }
        if(ix>0){
          for(let j=posA[i-1];j<posA[i];j++){pCollide(particleK,iA[j]);} // w
          //if(particleK==0){ctx.fillRect((i-1)%numX*2*MAXPARTICLERADIUS+SCREENX1,Math.floor((i-1)/numX)*2*MAXPARTICLERADIUS+SCREENY1,2*MAXPARTICLERADIUS,2*MAXPARTICLERADIUS);}
        }
        for(let j=k+1;j<posA[i+1];j++){pCollide(particleK,iA[j]);} // current
        //if(particleK==0){ctx.fillRect((i)%numX*2*MAXPARTICLERADIUS+SCREENX1,Math.floor(i/numX)*2*MAXPARTICLERADIUS+SCREENY1,2*MAXPARTICLERADIUS,2*MAXPARTICLERADIUS);}


      }
    }
  }
}

function DoPhysics(){
  //particles check wall collision
  for(let i=0;i<n;i++){pCheckWallCollision(i,SCREENX1,SCREENY1,SCREENX2,SCREENY2);}

  SpatialPartitioning();

  // particles update positions and velocities
  for(let i=0;i<n;i++){pupdate(i,dt,SIMSPEED);}
}
function Render(){
  ctx.fillStyle = "rgb(0,0,8)"
  ctx.fillRect(0,0,WIDTH,HEIGHT);
  drawGUI();
  GUI();

  // draw each particle
  for(let i=0;i<n;i++){pdraw(i,showparticlecolour,particlerect);}

  // show grid
  if(gridshow){
    ctx.strokeStyle = "rgb(240,240,240)";
    for(let x=0;x<numX;x++){
      for(let y=0;y<numY;y++){
        ctx.strokeRect(x*2*MAXPARTICLERADIUS+SCREENX1,y*2*MAXPARTICLERADIUS+SCREENY1,2*MAXPARTICLERADIUS,2*MAXPARTICLERADIUS);
      }
    }
  }
}

function main(){
  currenttime = performance.now()/1000;
  dt = currenttime-lasttime;
  if(currenttime-lastfpstimestamp>0.2){fps = 1/dt; lastfpstimestamp=currenttime;}
  lasttime=currenttime;

  DoPhysics();
  Render();

  // request new frame
  requestAnimationFrame(main);

}

// ---------------------------
setup();
// initialise gui needs to be out of setup so that gui isnt reset.
initGUI();
main();
