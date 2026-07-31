// return magnitude of vector
function mag(x,y){
  return sqrt(x*x+y*y);
}
function magA(list){
  return sqrt(list[0]*list[0]+list[1]*list[1]);
}
  // return normalised vector (same direction but mag of 1)
function norm(x,y){
  mag = mag(x,y)
  return [x/mag,y/mag];
}
function normA(list){
  mag = magA(list)
  return [list[0]/mag,list[1]/mag];
}
  // scales the vector by k (multiply)
function mult(x,y,k){
   return [x*k,y*k];
}
function multA(v,k){
   return [v[0]*k,v[1]*k];
}

function dot(A,B){
    return A[0]*B[0]+A[1]*B[1];
}

function clamp(value, minimum, maximum){
  if(value>maximum){return maximum;}
  if(value<minimum){return minimum;}
  return value;
}

function distSq(a,b){
  return a*a+b*b;
}