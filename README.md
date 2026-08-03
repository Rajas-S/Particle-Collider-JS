A simulation for perfectly elastic collisions  
  
web access: https://rajas-s.github.io/Particle-Collider-JS/  

TODO:  
-fix the particle fusion - particles "sticking" to each other   
=> the application of restitution on velocity is wrong... FIX IT -##### THE PHYSICS EQUATION FOR 1D COLLISION IS FOR ELASTIC COLLISION   
-ADJUST THE EQUATION FOR INELASTIC COLLISIONS WHERE 0<=RESTITUTION<=1   
-stop dt from spiking if exit tab  
  
OPTIMIZE CODE:  
-refactor code  
-remove uneccesary heavy math items e.g. arrays  
-fix spatial partitioning algorithm 
-make the main draw loop more efficiently structured - possibly use multithreading?
-OPTIMIZE RENDERING - no rendering gives significant fps (5x increase at 100000 particles) so use better libraries or better methods.
  
UI:  
-add UI around main screen where user can change parameters during run time
-add UI where user can change initial condiitons on restart
