const epsilon = 0.001;
const overlapThresh = -0.001;

function pupdate(_this,deltaTime,SIMSPEED){
  px[_this] += pvx[_this]*deltaTime * SIMSPEED;
  py[_this] += pvy[_this]*deltaTime * SIMSPEED;
  pvx[_this] += pax[_this]*deltaTime * SIMSPEED;
  pvy[_this] += pay[_this]*deltaTime * SIMSPEED;
}

function pdraw(_this){
  if(showparticlecolour){
    let speedSq = distSq(pvx[_this],pvy[_this]);
    let KE = pmass[_this]*speedSq*0.003;
    const r = clamp(KE,0,255);
    const g = clamp(180-KE*KE*0.0005,0,255);
    const b = clamp(255-KE*3,0,255);
    //fill(r,g,b);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
  }
  else{ctx.fillStyle = `rgb(${PARTICLECOLOURVALUE},${PARTICLECOLOURVALUE},${PARTICLECOLOURVALUE})`;}
  if(particlerect){ctx.fillRect(px[_this]-pradius[_this],py[_this]-pradius[_this],pradius[_this]*2,pradius[_this]*2);}
  else{
    ctx.beginPath();
    ctx.arc(px[_this],py[_this],pradius[_this],0,2*Math.PI);
    ctx.fill();
  }
}

function pCheckWallCollision(_this,x1,y1,x2,y2){

  // application of velocity dampening is probably not correct but is good enough

  // if(px[_this]<pradius[_this]+x1){px[_this]=pradius[_this]+x1; pvx[_this]*=-1}
  // if(px[_this]>x2-pradius[_this]){px[_this]=x2-pradius[_this]; pvx[_this]*=-1}
  // if(py[_this]<pradius[_this]+y1){py[_this]=pradius[_this]+y1; pvy[_this]*=-1}
  // if(py[_this]>y2-pradius[_this]){py[_this]=y2-pradius[_this]; pvy[_this]*=-1} 

  if(px[_this]<pradius[_this]+x1){px[_this]=pradius[_this]+x1; pvx[_this]*=-1*restitution; pvy[_this]*=restitution;}
  if(px[_this]>x2-pradius[_this]){px[_this]=x2-pradius[_this]; pvx[_this]*=-1*restitution; pvy[_this]*=restitution;}
  if(py[_this]<pradius[_this]+y1){py[_this]=pradius[_this]+y1; pvy[_this]*=-1*restitution; pvx[_this]*=restitution;}
  if(py[_this]>y2-pradius[_this]){py[_this]=y2-pradius[_this]; pvy[_this]*=-1*restitution; pvx[_this]*=restitution;} 
}

function pCollide(_this,_other){
  // obtain vectors for projection and scaling using physics eq.
  const Bx = px[_this]-px[_other];
  const By = py[_this]-py[_other];
  let distanceSq = Bx*Bx+By*By;
  let target = (pradius[_this]+pradius[_other]);

  if(distanceSq>target*target){return;}
  // ensure particles dont occupy the same space
  if(distanceSq==0){return;}
  //if(pmass[_this]==0 || pmass[_other]==0){return;}

  const this_mass = pmass[_this];
  const other_mass = pmass[_other];
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
    
    const correction_vx_this = B_norm_x*correction_this;
    const correction_vy_this = B_norm_y*correction_this;
    const correction_vx_other = B_norm_x*correction_other;
    const correction_vy_other = B_norm_y*correction_other;
    
    px[_this] += correction_vx_this + epsilon
    py[_this] += correction_vy_this + epsilon
    
    px[_other] += -correction_vx_other - epsilon
    py[_other] += -correction_vy_other - epsilon
  }


  // ---------

  let proj_this = (pvx[_this]*Bx+pvy[_this]*By)/mag_B;
  let proj_other = (pvx[_other]*Bx+pvy[_other]*By)/mag_B;
  
  // let new_proj_this = ((pmass[_this]-pmass[_other])/mass_sum)*proj_this + (2*pmass[_other]/mass_sum)*proj_other
  // let new_proj_other = ((pmass[_other]-pmass[_this])/mass_sum)*proj_other + (2*pmass[_this]/mass_sum)*proj_this

  // a set of equations for inelastic equations solving for new volocities

  let new_proj_this = ((restitution*other_mass*(proj_other-proj_this))+this_mass*proj_this+other_mass*proj_other)/mass_sum;
  let new_proj_other = ((restitution*this_mass*(proj_this-proj_other))+this_mass*proj_this+other_mass*proj_other)/mass_sum;


  // find vector projections of scaled collision values

  let new_velocity_x_this = B_norm_x*new_proj_this-B_norm_x*proj_this;
  let new_velocity_y_this = B_norm_y*new_proj_this-B_norm_y*proj_this;
  
  let new_velocity_x_other = B_norm_x*new_proj_other-B_norm_x*proj_other;
  let new_velocity_y_other = B_norm_y*new_proj_other-B_norm_y*proj_other;
  
  // add new velocities
  
  pvx[_this] += new_velocity_x_this;
  pvy[_this] += new_velocity_y_this;
  
  pvx[_other] += new_velocity_x_other;
  pvy[_other] += new_velocity_y_other;

}


