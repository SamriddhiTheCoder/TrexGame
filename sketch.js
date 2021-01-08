var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud_img;
var ob_img;
var gameOver_img;
var reset_img;

localStorage["HighestScore"] = 0;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloud_img = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")

  gameOver_img = loadImage("gameOver.png");
  reset_img = loadImage("restart.png");

}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  gameState = 1;

  obstacleGroup = new Group();
  cloudGroup = new Group();

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOver_img);
  gameOver.scale = 0.5;

  reset = createSprite(300, 140);
  reset.addImage(reset_img);
  reset.scale = 0.5;
  
  score = 0;
}

function draw() {
  background("white");

  console.log(trex.y);
  
  text("Score: "+ score, 500,50);
  
  text("Hi:"+localStorage["HighestScore"],500,20);

  if (gameState === 1) {

    if (keyDown("space") && trex.y > 160) {
      trex.velocityY = -12;
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    spawnClouds();
    spawnObstacles();

    if (trex.isTouching(obstacleGroup)) {
      gameState = 0;
    }

    gameOver.visible = false;
    reset.visible = false;
    
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  } 
  
  else if (gameState === 0) {
    ground.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    
    trex.velocityY = 0;

    //change the trex animation 
    trex.changeAnimation("collided", trex_collided);

    //set lifetime of the game objects so that they are never destroyed 
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);

    gameOver.visible = true;
    reset.visible = true;

    if (mousePressedOver(reset)) {
      restart();
    }
  }

  trex.collide(invisibleGround);
  drawSprites();

}

function spawnClouds() {
  if (frameCount % 80 === 0) {
    clouds = createSprite(600, Math.round(random(50, 100)))
    clouds.velocityX = -4;
    clouds.addImage(cloud_img);
    clouds.scale = 0.7;
    clouds.lifetime = 134;

    clouds.depth = trex.depth;
    trex.depth = trex.depth + 1;

    cloudGroup.add(clouds);
  }
}

function spawnObstacles() {
  if (frameCount % 120 === 0) {
    obstacle = createSprite(600, 160);
    obstacle.scale = 0.7;
    obstacle.velocityX = -(6 + 3*score/100);
    obstacle.lifetime = 300;

    var rand = Math.round(random(1, 2))
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1)
        break;
      case 2:
        obstacle.addImage(obstacle2)
        break;
      case 3:
        obstacle.addImage(obstacle3)
        break;
      case 4:
        obstacle.addImage(obstacle4)
        break;
      case 5:
        obstacle.addImage(obstacle5)
        break;
      case 6:
        obstacle.addImage(obstacle6)
        break;
    }
    obstacleGroup.add(obstacle);
  }
}

function restart() {
  gameState = 1;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  
  
  if(localStorage["HighestScore"] < score){   
    localStorage["HighestScore"] = score; 
  }
      
  score = 0;
}