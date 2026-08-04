const epsilon = 0.001;
const overlapThresh = -0.001;

class Particle{
  constructor(r,m,x,y,vx,vy,ax,ay){
    this.radius = r;
    this.mass = m;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.ax = ax;
    this.ay = ay;
  }

  update(deltaTime,SIMSPEED,VISC){
    this.x += this.vx*deltaTime * SIMSPEED;
    this.y += this.vy*deltaTime * SIMSPEED;
    this.vx += this.ax*deltaTime * SIMSPEED;
    this.vy += this.ay*deltaTime * SIMSPEED;
  }

  draw(showparticlecolour,particlerect){
    if(showparticlecolour){
      let speedSq = distSq(this.vx,this.vy);
      let KE = this.mass*speedSq*0.003;
      const r = clamp(KE,0,255);
      const g = clamp(180-KE*KE*0.0005,0,255);
      const b = clamp(255-KE*3,0,255);
      //fill(r,g,b);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
    }
    else{ctx.fillStyle = `rgb(${PARTICLECOLOURVALUE},${PARTICLECOLOURVALUE},${PARTICLECOLOURVALUE})`;}
    if(particlerect){ctx.fillRect(this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);}
    else{
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
      ctx.fill();
    }
  }

  CheckWallCollision(x1,y1,x2,y2){

    // application of velocity dampening is probably not correct but is good enough

    // if(this.x<this.radius+x1){this.x=this.radius+x1; this.vx*=-1}
    // if(this.x>x2-this.radius){this.x=x2-this.radius; this.vx*=-1}
    // if(this.y<this.radius+y1){this.y=this.radius+y1; this.vy*=-1}
    // if(this.y>y2-this.radius){this.y=y2-this.radius; this.vy*=-1} 

    if(this.x<this.radius+x1){this.x=this.radius+x1; this.vx*=-1*restitution; this.vy*=restitution;}
    if(this.x>x2-this.radius){this.x=x2-this.radius; this.vx*=-1*restitution; this.vy*=restitution;}
    if(this.y<this.radius+y1){this.y=this.radius+y1; this.vy*=-1*restitution; this.vx*=restitution;}
    if(this.y>y2-this.radius){this.y=y2-this.radius; this.vy*=-1*restitution; this.vx*=restitution;} 
  }

  Collide(other){
    // obtain vectors for projection and scaling using physics eq.
    const Bx = this.x-other.x;
    const By = this.y-other.y;
    let distanceSq = Bx*Bx+By*By;
    let target = (this.radius+other.radius);

    if(distanceSq>target*target){return;}
    // ensure particles dont occupy the same space
    if(distanceSq==0){return;}
    if(this.mass==0 || other.mass==0){return;}

    const this_mass = this.mass;
    const other_mass = other.mass;
    const mass_sum = this_mass+other_mass;

    

    const mag_B = Math.sqrt(distanceSq);
    const inv_mag_B = 1/mag_B;
    const B_norm_x = Bx*inv_mag_B;
    const B_norm_y = By*inv_mag_B;
    
    // apply correction along vectors for projection
    const overlap = target-mag_B;

    if(overlap>overlapThresh){
      const this_percentage = this_mass/mass_sum;
      const other_percentage = other_mass/mass_sum;
      
      const correction_this = overlap*other_percentage;
      const correction_other = overlap*this_percentage;
      
      const correction_v_this_x = B_norm_x*correction_this;
      const correction_v_this_y = B_norm_y*correction_this;
      const correction_v_other_x = B_norm_x*correction_other;
      const correction_v_other_y = B_norm_y*correction_other;
      
      this.x += correction_v_this_x + epsilon
      this.y += correction_v_this_y + epsilon
      
      other.x += -correction_v_other_x - epsilon
      other.y += -correction_v_other_y - epsilon
    }


    // ---------
  
    let proj_this = (this.vx*Bx+this.vy*By)/mag_B;
    let proj_other = (other.vx*Bx+other.vy*By)/mag_B;
    
    // let new_proj_this = ((this.mass-other.mass)/mass_sum)*proj_this + (2*other.mass/mass_sum)*proj_other
    // let new_proj_other = ((other.mass-this.mass)/mass_sum)*proj_other + (2*this.mass/mass_sum)*proj_this

    // a temperamental set of equations for inelastic equations - may require fixing because behaviour is not as expected 

    let new_proj_this = ((restitution*other_mass*(proj_other-proj_this))+this_mass*proj_this+other_mass*proj_other)/mass_sum;
    let new_proj_other = ((restitution*this_mass*(proj_this-proj_other))+this_mass*proj_this+other_mass*proj_other)/mass_sum;


    // find vector projections of scaled collision values

    let new_velocity_this_x = B_norm_x*new_proj_this-B_norm_x*proj_this;
    let new_velocity_this_y = B_norm_y*new_proj_this-B_norm_y*proj_this;
    
    let new_velocity_other_x = B_norm_x*new_proj_other-B_norm_x*proj_other;
    let new_velocity_other_y = B_norm_y*new_proj_other-B_norm_y*proj_other;
    
    // add new velocities
    
    this.vx += new_velocity_this_x;
    this.vy += new_velocity_this_y;
    
    other.vx += new_velocity_other_x;
    other.vy += new_velocity_other_y;

  }
  
}