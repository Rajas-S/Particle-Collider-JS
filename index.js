// Particle Collider physics system by Rajas Sharma

// TODO: fix the particle fusion - particles "sticking" to each other
//       => the application of restitution on velocity is wrong... FIX IT -##### THE PHYSICS EQUATION FOR 1D COLLISION IS FOR ELASTIC COLLISION 
//                                                                               - ADJUST THE EQUATION FOR INELASTIC COLLISIONS WHERE 0<=RESTITUTION<=1 
//       stop dt from spiking if exit tab


const WIDTH = 1000, HEIGHT = 600;

let n = 1000;
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
    let x = i*WIDTH/(n);
    let y = random(0,HEIGHT/4);
    let r = random(1,4);
    let m = r*r;
    let vx = random(-100,80);
    let vy = random(-100,80)
    p.push(new Particle(r,m,x,y,vx,vy,0,0,1))
  }

  n+=1;
  p.push(new Particle(50,2500,200,350,0,0,0,0,1))

}

function draw() {

    background(220);
    
    // particles check and collide
    for(let j=0;j<n;j++){
      for(let k=j+1;k<n;k++){
        if(p[j].CheckCollision(p[k])){
              p[j].Collide(p[k])
        }
      }
    }


      //particles check wall collision
    for(let i=0;i<n;i++){
       p[i].CheckWallCollision();
    }

      // particles update positions and velocities
    currenttime = Date.now()/1000;
    dt = currenttime-lasttime;

    for(let i=0;i<n;i++){
       p[i].update(dt);
    }

      // draw each particle
    for(let i=0;i<n;i++){
      fill(0,0,255);
      if(i<n/4){fill(255,0,0);}
       p[i].draw(); 
    }


   fps = 1/dt;
   lasttime=currenttime;
}

