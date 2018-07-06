# Fuelplanner
Fuelplanner with Flightgear FS interface to set/calc payload and fuel and map the flghtpath and current position of your flight remotely.

a320fuelcalc.html in the root directory is an completely integrated html file. So you don't have to mess around with additional css and js files. Currently this html is to be used for the FGFS IDX-A32x but the sources (e.g. inita320.js) can adapted to fit all the other aircrafts too.

Use the makemonolith.exe to make an integrated html file: 
makemonolith a320fuelcalc.html inita320.js 
This will create the file a320fuelcalc.html and is using the init values of inita320.js. 

If you won't trust that exe (sorry for that I just made it quick and dirty) you can always run the tool as it is in the source directory (use fuelcalc_src.html to start it). But you either have to store your init values in the initdefault.js file or you have to adjust the fuelcalc_src.html to load another init file. 
