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
-use spatial partitioning to make collsion checks more efficient  
-make the main draw loop more efficiently structured  
  
UI:  
-add UI around main screen where user can change parameters during run time
-add UI where user can start and stop main loop and change initial condiitons on restart
-add mouse interactivity to program where user can point and hold to "slosh" particles around or to move x,y towards mouse x,y in magnetic fashion
