import { Bodies, Body, Engine,Events, Render, Runner, World } from "matter-js"; 
import { FRUITS_BASE } from "./fruits";
const engine = Engine.create();
const render = Render.create({
  engine,
  element : document.body,
  options: {
    wireframes : false,
    background : "#F7F4C8",
    width: 620,
    height: 850,
  }
});

const world = engine.world;

const leftWall =  Bodies.rectangle(15, 395, 30, 790, {
  isStatic : true,
  render: {fillStyle: "#E6B143"}
});

const righttWall =  Bodies.rectangle(605, 395, 30, 790, {
  isStatic : true,
  render: {fillStyle: "#E6B143"}
});

const ground =  Bodies.rectangle(310, 820, 620, 60, {
  isStatic : true,
  render: {fillStyle: "#E6B143"}
});

const topLine = Bodies.rectangle(310, 150, 620, 2,{
  name: "topLine",
  isStatic : true,
  isSensor : true,
  render: {fillStyle: "#E6B143"}
})

World.add(world, [leftWall, righttWall, ground, topLine]);

Render.run(render);
Runner.run(engine); 

let currentBody = null;
let currentFruit = null;
let disableAction = false;
let interval = null;
let num_suika = 0;
function addFruit(){
  
  const index = Math.floor(Math.random() * 5);
  const fruit = FRUITS_BASE[index];

  const body = Bodies.circle(300, 50, fruit.radius, {
    index : index,
    isSleeping : true, //준비중
    render: {
      sprite: {texture: `${fruit.name}.png`}
    },
    restitution: 0.2 //탄성
  });

  currentBody = body;
  currentFruit = fruit;

  if(num_suika == 2){
    alert("game clear");
    return;
  }
  World.add(world, body);
}

window.onkeydown = (event) => {
  if (disableAction){
    return;
  }
  switch (event.code){
    case "KeyA" :
      if(interval)
        return;
      interval = setInterval(() =>{
        if(currentBody.position.x - currentFruit.radius > 30)
          Body.setPosition(currentBody, {
          x: currentBody.position.x - 1,
          y: currentBody.position.y,
      }, 5);
      })
      
      break;
    case "KeyD" :
      if(interval)
        return;
      interval = setInterval(() =>{
        if(currentBody.position.x + currentFruit.radius < 590)
      Body.setPosition(currentBody, {
        x: currentBody.position.x + 1,
        y: currentBody.position.y,
      },5);
      })
      break;
    case "KeyS" :
      if(num_suika == 2){``
        return;
      }
      currentBody.isSleeping = false;
      disableAction = true;

      setTimeout(() => {
        addFruit();
        disableAction = false;
      },1500);

      break;

  }
}

window.onkeyup = (event) => {
  switch(event.code){
    case "KeyA":
    case "KeyD":
      clearInterval(interval);
      interval = null;
  }
    
}

Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    if(collision.bodyA.index === collision.bodyB.index){
      const index = collision.bodyA.index;
      
      if(index === FRUITS_BASE.length -1){
        return;
      }
      World.remove(world, [collision.bodyA, collision.bodyB]);
      
      const newFruit = FRUITS_BASE[index + 1];

      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFruit.radius,
        {
          render: {
            sprite: {texture: `${newFruit.name}.png`}
          },
          index : index +1,
        }
      );
      console.log(index);
      if(index === 9)
      num_suika++;
      
      World.add(world, newBody);
      
    }

    if(!disableAction &&
      (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")){
      alert("game over");
    }
  })
})

addFruit();