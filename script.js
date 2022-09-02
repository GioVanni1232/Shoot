/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const colision = document.getElementById('colision');
const colisionCtx = colision.getContext('2d');
colision.width = window.innerWidth;
colision.height = window.innerHeight;
ctx.font = '50px Impact';



let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let score = 0;

const sound = new Audio();
sound.src = "sound.wav";

let ravens = [];
class Raven {
  constructor(){
    this.timer = 0;
    this.sizeModifier = Math.random() * 2 ;
    this.width = 100 ;
    this.height = 100 ;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX =3;
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeletion = false;
    this.randomColor = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
    this.color = 'rgb(' + this.randomColor[0] + ',' + this.randomColor[1] + ',' + this.randomColor[2] + ')';
  }
  update(){
    if ( this.y < 0 ||this.y > canvas.height - this.height ){
      this.directionY = this.directionY * -1;
    }

  
    this.x -= this.directionX;
    this.y -= this.directionY;
    if (this.x < 0 - this.width){
      this.markedForDeletion = true;
  
    } 
  }
  draw(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function drawScore(){
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ' + score, 50, 75);
  ctx.fillStyle = 'white';
  ctx.fillText('Score: ' + score, 55, 80);
};

window.addEventListener('click', e=> {
  const detectPixelColor = ctx.getImageData(e.x, e.y, 1, 1);
  const pc = detectPixelColor.data;
  ravens.forEach(object =>{
    if(object.randomColor[0] === pc[0] && object.randomColor[1] === pc[1] && object.randomColor[2] === pc[2] ){
      object.markedForDeletion = true;
      score++;
    }
  })
  sound.play();
});

function animate(timestamp){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltaTime;
  if(timeToNextRaven > ravenInterval){
    ravens.push(new Raven());
    timeToNextRaven = 0;
    ravens.sort(function(a,b){
      return a.width - b.width;
    })
  };
  
  [...ravens].forEach(e => e.update());
  [...ravens].forEach(e => e.draw());
  ravens = ravens.filter(object => !object.markedForDeletion);
  requestAnimationFrame(animate);
  drawScore();
}

animate(0);

