const epsilon = 0.001;
const overlapThresh = -0.001;

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

  update(deltaTime,SIMSPEED){
    this.x += this.vx*deltaTime * SIMSPEED;
    this.y += this.vy*deltaTime * SIMSPEED;
    this.vx += this.ax*deltaTime * SIMSPEED;
    this.vy += this.ay*deltaTime * SIMSPEED;
  }

  draw(){
    let speedSq = distSq(this.vx,this.vy);
    let KE = this.mass*speedSq*0.003;
    const r = clamp(KE,0,255);
    const g = clamp(180-KE*KE*0.0005,0,255);
    const b = clamp(255-KE*3,0,255);
    fill(r,g,b);
    ellipse(this.x,this.y,this.radius*2,this.radius*2);
  }

  CheckWallCollision(x1,y1,x2,y2){

    // application of velocity dampening is probably not correct but is good enough

    if(this.x<this.radius+x1){this.x=this.radius+x1; this.vx*=-1*this.restitution; this.vy*=this.restitution;}
    if(this.x>x2-this.radius){this.x=x2-this.radius; this.vx*=-1*this.restitution; this.vy*=this.restitution;}
    if(this.y<this.radius+y1){this.y=this.radius+y1; this.vy*=-1*this.restitution; this.vx*=this.restitution;}
    if(this.y>y2-this.radius){this.y=y2-this.radius; this.vy*=-1*this.restitution; this.vx*=this.restitution;} 
  }

  CheckCollision(other){
    return distSq(this.x-other.x,this.y-other.y)<=(this.radius+other.radius)*(this.radius+other.radius);
  }

  Collide(other){

    let distanceSq = distSq(this.x-other.x,this.y-other.y);
    let this_velocity = [this.vx,this.vy];
    let other_velocity = [other.vx,other.vy];

    const mass_sum = this.mass+other.mass;

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
      const this_percentage = this.mass/mass_sum;
      const other_percentage = other.mass/mass_sum;
      
      const correction_this = overlap*other_percentage;
      const correction_other = overlap*this_percentage;
      
      const correction_v_this = multA(B_norm,correction_this);
      const correction_v_other = multA(B_norm,correction_other);
      
      this.x += correction_v_this[0] + epsilon
      this.y += correction_v_this[1] + epsilon
      
      other.x += -correction_v_other[0] - epsilon
      other.y += -correction_v_other[1] - epsilon
    }


    // ---------
  
    let proj_this = dot(this_velocity,B)/mag_B;
    let proj_other = dot(other_velocity,B)/mag_B;
    
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