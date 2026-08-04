A simulation for perfectly elastic collisions  
  
web access: https://rajas-s.github.io/Particle-Collider-JS/  

TODO:  
-explore and experiment with multithreading to increase speed
-figure out how to implement hardware-acceleration
  
Optimisations in Place:  
-replaced vector2 objects with arrays and later variables.  
-refactored code multiple times to reduce expensive maths calculations  
-swtiched from p5.js library rendering to canvas API  
-added rendering quality options to give user ability to lower rendering cost  
-implemented spatial partitioning algorithm to reduce number of collision checks in most cases  


