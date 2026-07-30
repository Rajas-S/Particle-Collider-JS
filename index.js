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
  frameRate(2000)
  createCanvas(WIDTH, HEIGHT);
  // initalise n random particles with random attributes
  for(i=0;i<n;i++){
    x = i*WIDTH/(n);
    y = random(0,HEIGHT/4);
    r = random(1,4);
    m = r*r;
    vx = random(-100,80);
    vy = random(-100,80)
    append(p,new Particle(r,m,x,y,vx,vy,0,0,1))
  }

  n+=1;
  append(p,new Particle(50,2500,200,350,0,0,0,0,1))

}

function draw() {

    background(220);
    
    for(let j=0;j<n;j++){
      
      if(j<n/4){fill(255,0,0)}
      else{fill(0,0,255)}
      
      // each particle checks collision with every other particle 
      // => (make more efficient using grid system?)
      for(let k=j+1;k<n;k++){
        if(p[j].CheckCollision(p[k])){
              p[j].Collide(p[k])
            }
          }
          
          p[j].CheckWallCollision();
          
        // find time taken since the particle last updated
        currenttime = Date.now()/1000;
        dt = currenttime-lasttime;
        
        p[j].update(dt);
        p[j].draw(); 
        
      }
      fps = 1/(currenttime-lasttime);
      lasttime=currenttime;
}

