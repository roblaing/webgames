const images = { "background": new Image()
               , "debris": new Image()
               , "spaceship": new Image()
               , "asteroid": new Image()
               , "explosion": new Image()
               , "missile": new Image()
               };

images["background"].src = "nebula_blue.f2014.png";
images["debris"].src = "debris2_blue.png";
images["spaceship"].src = "double_ship.png";
images["asteroid"].src = "asteroid_blue.png";
images["missile"].src = "shot2.png";
images["explosion"].src = "explosion_alpha.png";

export { images };
