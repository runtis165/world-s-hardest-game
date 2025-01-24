let level = [[]];
let img = {};
let lvx = JSON.parse(lvs);
let tell = false;
let started = false;
let cheating = false;

let player = {
  x:-3,
  y:3,
  xvel:0,
  yvel:0,
  prev:0,
  lvv:-1,
  cp: {x:-1, y:-1, xvel:0, yvel:0
      }
};
    
function setup() {
  createCanvas(windowWidth, windowHeight);
  img.dirt = loadImage("dirt.png");
  img.sky = loadImage("sky.png");
  img.start = loadImage("start.png");
  img.finish = loadImage("finish.png");
  img.checkpoint = loadImage("checkpoint.png");
  img.setterOn = loadImage("cpsetteron.png");
  img.setterOff = loadImage("slow.png");
  img.start = loadImage("start.png");
  img.finish = loadImage("finish.png");
  
  let lv = new Array(200).fill(new Array(10).fill({ name: "sky" }));
  player.lvv = getItem("leve")-1;
  nextLevel();
  //level[0].push({ name: "dirt" });
}

function nextLevel() {
  player.cp = {x:-1, y:-1, xVel:0, yVel:0};
    player.lvv++;
  storeItem("leve", player.lvv);
  player.xvel = 0;
  player.yvel = 0;
  player.x = lvx[player.lvv%lvx.length].start.x;
  player.y = lvx[player.lvv%lvx.length].start.y;

  level = lvx[player.lvv%lvx.length].level;
}


function mouseClicked() {
  if(tell) {
     frameRate(10);
     } else {
  player.lvv--;
  nextLevel();
     }
}

function draw() {
  
  if(keyIsDown(82)) storeItem("leve", 0);
  
  background(220);
  if(started) {
  fill("white");
  //  draw map
    
  //visible sections:
  let visible = {
    yMin: -1*player.y,
    yMax: -1*player.y+height/30,
    xMin: player.x,
    xMax: player.x+width/30
  }; 
  if(visible.yMin<0) {
    visible.yMin = 0;
  }
  if(visible.xMin<0) {
    visible.xMin = 0;
  }
    
  //console.log(JSON.stringify(visible));
    
  // loop thorugh x and y of 2d array upon visible sections
//  level.map(function (i, x) {
    //x  
    for(x=floor(visible.xMin);x<visible.xMax && x<level.length;x++) {
      let i = level[x];
          // y
    for(y=floor(visible.yMin);y<visible.yMax && y<i.length;y++) {
      let j = i[y];
//    i.map(function (j, y) {
      let dx = 
      image(img[j.name], (x-player.x) * 30, (y+player.y) * 30, 30, 30);
      //text(j.name, x * 30, (y + 1) * 30);
    } //);
  } //);
  //  draw player
  circle(105,105, 5);
    
  // draw checkpoint if exists
  if(cheating && player.cp.x != -1) {
     image(img.checkpoint, (player.cp.x-player.x) * 30+100, (-player.cp.y+player.y) * 30+100, 10, 10);
  }
    
  // accept inputs and do physics

  
  // check horizontal collision
    player.x += player.xvel;
    // check horizontal collision
    if(level[
    round(player.x+3)
  ][
    round(-player.y+3)
  ].name == "dirt") {
    player.x = round(floor(player.x)+1)-0.5+(Math.sign(player.xvel)*-0.01)
    player.xvel = player.xvel*-0.9;
    //console.log(player.x);
  }

  player.yvel -= 0.0045;
  player.y += player.yvel;

  
  // check vertical collision
  if(level[
    round(player.x+3)
  ][
    round(-player.y+3)
  ].name == "dirt") {
    player.y = round(floor(player.y)+1)-0.5+(Math.sign(player.yvel)*-0.001)
    player.prev = player.yvel;
    player.yvel = 0;
    //console.log(player.y);
  }
    if(player.yvel == 0 && player.prev<0) {
    player.yvel = keyIsDown(UP_ARROW)*0.2;
      player.xvel *= 0.90;
  player.xvel += keyIsDown(LEFT_ARROW)*-0.02 + keyIsDown(RIGHT_ARROW)*0.02;
    }
  
      if(level[
    round(player.x+3)
  ][
    round(-player.y+3)
  ].name == "finish") {nextLevel();
  }
  
  if(keyIsDown(BACKSPACE) && player.cp.x != -1 && cheating) {
    player.x = player.cp.x;
    player.y = player.cp.y;
    player.xvel = player.cp.xvel;
    player.yvel = player.cp.yvel;
  } else if (keyIsDown(ENTER)) {
    player.cp.x = player.x;
    player.cp.y = player.y;
    player.cp.xvel = player.xvel;
    player.cp.yvel = player.yvel;
  } else if(keyIsDown(TAB)) {
    storeItem("lvl", 0);
  }
  } else {
    //check if mouse is over "Normal"
    if(mouseX>10 && mouseX<400 && mouseY>10 && mouseY<100) {
      fill("red");
      if(mouseIsPressed) {
        cheating = false;
        started = true;
      }
    } else {
      fill("white");
    }    
    rect(10,10,390,90);
    //same for "prcatice"
    if(mouseX>10 && mouseX<400 && mouseY>110 && mouseY<200) {
      fill("red");
      
      if(mouseIsPressed) {
        cheating = true;
        started = true;
      }
    } else {
      fill("white");
    }    
    rect(10,110,390,90);
    textSize(90);
    fill("black")
    text("Normal", 20,90);
    text("Practice", 20,190);
  }
  
}
