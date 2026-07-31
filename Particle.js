const epsilon = 0.001;
const overlapThresh = 0;

class Particle{
  constructor(r,m,x,y,vx,vy,ax,ay,e){
    this.radius = r;
    this.mass = m;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.ax = ax;
    this.ay = ay;
    this.restitution = e;
  }

  update(deltaTime){
    this.x += this.vx*deltaTime;
    this.y += this.vy*deltaTime;
    this.vx += this.ax*deltaTime;
    this.vy += this.ay*deltaTime;
  }

  draw(){
    ellipse(this.x,this.y,this.radius*2,this.radius*2);
  }

  CheckWallCollision(){

    // application of velocity dampening is probably not correct but is good enough

    if(this.x<this.radius){this.x=this.radius; this.vx*=-1*this.restitution; this.vy*=this.restitution;}
    if(this.x>WIDTH-this.radius){this.x=WIDTH-this.radius; this.vx*=-1*this.restitution; this.vy*=this.restitution;}
    if(this.y<this.radius){this.y=this.radius; this.vy*=-1*this.restitution; this.vx*=this.restitution;}
    if(this.y>HEIGHT-this.radius){this.y=HEIGHT-this.radius; this.vy*=-1*this.restitution; this.vx*=this.restitution;} 
  }

  CheckCollision(other){
    return distSq(this.x-other.x,this.y-other.y)<=(this.radius+other.radius)*(this.radius+other.radius);
  }

  Collide(other){

    let distanceSq = distSq(this.x-other.x,this.y-other.y);
    let this_velocity = [this.vx,this.vy];
    let other_velocity = [other.vx,other.vy];

    // ensure particles dont occupy the same space
    if(distanceSq==0){return;}
    if(this.mass==0 || other.mass==0){return;}
    
    // obtain vectors for projection and scaling using physics eq.
    const B = [this.x-other.x,this.y-other.y];
    
    const mag_B = magA(B);
    const B_norm = normA(B);
    
    // apply correction along vectors for projection
    const overlap = this.radius+other.radius-sqrt(distanceSq);

    if(overlap>overlapThresh){
      const correction = overlap/2;
      
      const correction_v = multA(B_norm,correction);
      
      this.x += correction_v[0] + epsilon
      this.y += correction_v[1] + epsilon
      
      other.x += -correction_v[0] - epsilon
      other.y += -correction_v[1] - epsilon
    }


    // ---------
  
    let proj_this = dot(this_velocity,B)/mag_B;
    let proj_other = dot(other_velocity,B)/mag_B;

    let mass_sum = this.mass+other.mass;
    
    let new_proj_this = ((this.mass-other.mass)/mass_sum)*proj_this + (2*other.mass/mass_sum)*proj_other
    let new_proj_other = ((other.mass-this.mass)/mass_sum)*proj_other + (2*this.mass/mass_sum)*proj_this

    // a temperamental set of equations for inelastic equations - may require fixing because behaviour is not as expected 

    // let restitution = (this.restitution+other.restitution)/2;
    // let new_proj_this = ((restitution*other.mass*(proj_other-proj_this))+this.mass*proj_this+other.mass*proj_other)/mass_sum;
    // let new_proj_other = ((restitution*this.mass*(proj_this-proj_other))+this.mass*proj_this+other.mass*proj_other)/mass_sum;


    // find vector projections of scaled collision values

    let new_velocity_this = multA(B_norm,new_proj_this);
    let old_velocity_this = multA(B_norm,proj_this);
    
    let new_velocity_other = multA(B_norm,new_proj_other);
    let old_velocity_other = multA(B_norm,proj_other);
    
    // add new velocities
    
    this.vx += new_velocity_this[0]-old_velocity_this[0];
    this.vy += new_velocity_this[1]-old_velocity_this[1];
    
    other.vx += new_velocity_other[0]-old_velocity_other[0];
    other.vy += new_velocity_other[1]-old_velocity_other[1];

  }
  
}