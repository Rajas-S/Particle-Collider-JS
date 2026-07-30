class Vector2{
  constructor(x,y){
    this.x=x;
    this.y=y;
  }
  // return magnitude of vector
  mag(){
    return sqrt(this.x*this.x+this.y*this.y);
  }
  // return normalised vector (same direction but mag of 1)
  norm(){
    return new Vector2(this.x/this.mag(),this.y/this.mag());
  }
  // scales the vector by k (multiply)
  mult(k){
    return new Vector2(this.x*k, this.y*k);
  }
}

function dot(A,B){
    return A.x*B.x+A.y*B.y;
}

function clamp(value, minimum, maximum){
  if(value>maximum){return maximum;}
  if(value<minimum){return minimum;}
  return value;

}