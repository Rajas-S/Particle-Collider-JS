const epsilon = 0.001;
const overlapThresh = 0;

class Particle{
  constructor(r,m,x,y,vx,vy,ax,ay,e){
    this.radius = r;
    this.mass = m;
    this.x = x;
    this.y = y;
    this.velocity = new Vector2(vx,vy);
    this.acceleration = new Vector2(ax,ay);
    this.restitution = e;
  }

  update(deltaTime){
    this.x += this.velocity.x*deltaTime;
    this.y += this.velocity.y*deltaTime;
    this.velocity.x += this.acceleration.x*deltaTime;
    this.velocity.y += this.acceleration.y*deltaTime;
  }

  draw(){
    ellipse(this.x,this.y,this.radius*2,this.radius*2);
  }

  CheckWallCollision(){

    // application of velocity dampening is probably not correct but is good enough

    if(this.x<this.radius){this.x=this.radius; this.velocity.x*=-1*this.restitution; this.velocity.y*=this.restitution;}
    if(this.x>WIDTH-this.radius){this.x=WIDTH-this.radius; this.velocity.x*=-1*this.restitution; this.velocity.y*=this.restitution;}
    if(this.y<this.radius){this.y=this.radius; this.velocity.y*=-1*this.restitution; this.velocity.x*=this.restitution;}
    if(this.y>HEIGHT-this.radius){this.y=HEIGHT-this.radius; this.velocity.y*=-1*this.restitution; this.velocity.x*=this.restitution;} 
  }

  CheckCollision(other){
    return distSq(this.x-other.x,this.y-other.y)<=(this.radius+other.radius)*(this.radius+other.radius);
  }

  Collide(other){

    let distanceSq = distSq(this.x,this.y,other.x,other.y);

    // ensure particles dont occupy the same space
    if(distanceSq==0){return;}
    if(this.mass==0 || other.mass==0){return;}
    
    // obtain vectors for projection and scaling using physics eq.
    const B = new Vector2(this.x-other.x,this.y-other.y);
    
    const mag_B = B.mag();
    const B_norm = B.norm();
    
    // apply correction along vectors for projection
    const overlap = this.radius+other.radius-sqrt(distanceSq);

    if(overlap>overlapThresh){
      const correction = overlap/2;
      
      const correction_v = B_norm.mult(correction);
      
      this.x += correction_v.x + epsilon
      this.y += correction_v.y + epsilon
      
      other.x += -correction_v.x - epsilon
      other.y += -correction_v.y - epsilon
    }


    // ---------
  
    let proj_this = dot(this.velocity,B)/mag_B;
    
    let proj_other = dot(other.velocity,B)/mag_B;

    let mass_sum = this.mass+other.mass;
    
    let new_proj_this = ((this.mass-other.mass)/mass_sum)*proj_this + (2*other.mass/mass_sum)*proj_other
    let new_proj_other = ((other.mass-this.mass)/mass_sum)*proj_other + (2*this.mass/mass_sum)*proj_this

    // a temperamental set of equations for inelastic equations - may require fixing because behaviour is not as expected 

    // let restitution = (this.restitution+other.restitution)/2;
    // let new_proj_this = ((restitution*other.mass*(proj_other-proj_this))+this.mass*proj_this+other.mass*proj_other)/mass_sum;
    // let new_proj_other = ((restitution*this.mass*(proj_this-proj_other))+this.mass*proj_this+other.mass*proj_other)/mass_sum;


    // find vector projections of scaled collision values

    let new_velocity_this = B_norm.mult(new_proj_this);
    let old_velocity_this = B_norm.mult(proj_this);
    
    let new_velocity_other = B_norm.mult(new_proj_other);
    let old_velocity_other = B_norm.mult(proj_other);
    
    // add new velocities
    
    this.velocity.x += new_velocity_this.x-old_velocity_this.x
    this.velocity.y += new_velocity_this.y-old_velocity_this.y
    
    other.velocity.x += new_velocity_other.x-old_velocity_other.x
    other.velocity.y += new_velocity_other.y-old_velocity_other.y

  }
  
}