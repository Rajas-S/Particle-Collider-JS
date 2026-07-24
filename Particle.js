class Particle{
  constructor(r,m,x,y,vx,vy,ax,ay,c){
    this.radius = r;
    this.mass = m;
    this.x = x;
    this.y = y;
    this.velocity = new Vector2(vx,vy);
    this.acceleration = new Vector2(ax,ay);
    this.collision_energy_efficiency = c;
  }

  update(){
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
  }

  draw(){
    ellipse(this.x,this.y,this.radius*2,this.radius*2);
  }

  CheckWallCollision(){
    if(this.x<this.radius){this.x=this.radius; this.velocity.x*=-1*this.collision_energy_efficiency; this.velocity.y*=this.collision_energy_efficiency;}
    if(this.x>WIDTH-this.radius){this.x=WIDTH-this.radius; this.velocity.x*=-1*this.collision_energy_efficiency; this.velocity.y*=this.collision_energy_efficiency;}
    if(this.y<this.radius){this.y=this.radius; this.velocity.y*=-1*this.collision_energy_efficiency; this.velocity.x*=this.collision_energy_efficiency;}
    if(this.y>HEIGHT-this.radius){this.y=HEIGHT-this.radius; this.velocity.y*=-1*this.collision_energy_efficiency; this.velocity.x*=this.collision_energy_efficiency;} 
  }

  CheckCollision(other){
    return dist(this.x,this.y,other.x,other.y)<this.radius+other.radius;
  }

  Collide(other){

    if(dist(this.x,this.y,other.x,other.y)==0){return;}
    let B = new Vector2(this.x-other.x,this.y-other.y);
    let A_this = this.velocity;
    
    let mag_B = (sqrt(B.x*B.x+B.y*B.y))
    let Uvelocity_B = new Vector2(B.x/mag_B,B.y/mag_B);
    
    let overlap = this.radius+other.radius-dist(this.x,this.y,other.x,other.y);
    let epsilon = 0.01

    if(overlap>-epsilon){
      let correction = overlap/2;
  
      let correction_v = new Vector2(Uvelocity_B.x*correction*(1+epsilon),Uvelocity_B.y*correction*(1+epsilon));
      
      this.x += correction_v.x 
      this.y += correction_v.y 
  
      other.x += -correction_v.x
      other.y += -correction_v.x 
    }

    // ---------
    
    let dot_this = B.x*A_this.x+B.y*A_this.y;
    let proj_this = dot_this/(sqrt(B.x*B.x+B.y*B.y));

    let A_other = other.velocity;
    let dot_other = B.x*A_other.x+B.y*A_other.y;
    let proj_other = dot_other/(sqrt(B.x*B.x+B.y*B.y));

    let mass_sum = this.mass+other.mass;
    
    let new_proj_this = ((this.mass-other.mass)/mass_sum)*proj_this + (2*other.mass/mass_sum)*proj_other
    let new_proj_other = ((other.mass-this.mass)/mass_sum)*proj_other + (2*this.mass/mass_sum)*proj_this

    
    let new_velocity_this = new Vector2(Uvelocity_B.x*new_proj_this,Uvelocity_B.y*new_proj_this);
    let old_velocity_this = new Vector2(Uvelocity_B.x*proj_this,Uvelocity_B.y*proj_this);

    // new_velocity_this; // new vector proj of this

    let mag_velocity_other = sqrt(other.velocity.x*other.velocity.x+other.velocity.y*other.velocity.y)
  
    let new_velocity_other = new Vector2(Uvelocity_B.x*new_proj_other,Uvelocity_B.y*new_proj_other);
    let old_velocity_other = new Vector2(Uvelocity_B.x*proj_other,Uvelocity_B.y*proj_other);

    // new_velocity_other; // new vector proj of other

    
    this.velocity.x += new_velocity_this.x-old_velocity_this.x
    this.velocity.y += new_velocity_this.y-old_velocity_this.y

    other.velocity.x += new_velocity_other.x-old_velocity_other.x
    other.velocity.y += new_velocity_other.y-old_velocity_other.y

    this.velocity.x *= this.collision_energy_efficiency
    this.velocity.y *= this.collision_energy_efficiency

    other.velocity.x *= this.collision_energy_efficiency
    other.velocity.y *= this.collision_energy_efficiency


  }
  
}