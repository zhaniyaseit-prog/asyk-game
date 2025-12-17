let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events;

let engine, render, runner;
let ball;
let answers = [];
let correctAnswer = "";
let score = 0;
let qIndex = 1;
const total = 5;

const questions = [
  {q:"1 байт неше бит?", a:"8", w1:"4", w2:"16"},
  {q:"Компьютердің миы?", a:"Процессор", w1:"Монитор", w2:"Тінтуір"},
  {q:"HTML деген не?", a:"Белгілеу тілі", w1:"ОЖ", w2:"Редактор"}
];

document.getElementById("startBtn").onclick = () => {
  const name = document.getElementById("studentName").value.trim();
  if(!name){ alert("Атыңды жаз"); return; }

  document.getElementById("menu").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  startGame();
};

function goTeacher(){
  window.location.href = "teacher.html";
}

function startGame(){
  engine = Engine.create();

  render = Render.create({
    canvas: document.getElementById("world"),
    engine: engine,
    options:{
      width: window.innerWidth,
      height: window.innerHeight-50,
      wireframes:false,
      background:"#f4f8ff"
    }
  });

  const ground = Bodies.rectangle(
    window.innerWidth/2,
    window.innerHeight,
    window.innerWidth,
    40,
    { isStatic:true }
  );

  ball = Bodies.circle(
    window.innerWidth/2,
    window.innerHeight-100,
    30,
    {
      restitution:0.9,
      render:{
        sprite:{
          texture:"images/asyk.png",
          xScale:0.2,
          yScale:0.2
        }
      }
    }
  );

  Composite.add(engine.world,[ground,ball]);

  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine,{ mouse });
  Composite.add(engine.world, mouseConstraint);

  Events.on(engine,"collisionStart", e=>{
    e.pairs.forEach(p=>{
      answers.forEach(a=>{
        if(p.bodyA===a || p.bodyB===a){
          checkAnswer(a.answer);
        }
      });
    });
  });

  runner = Runner.create();
  Runner.run(runner,engine);
  Render.run(render);

  loadQuestion();
}

function loadQuestion(){
  document.getElementById("qText").innerText = `Сұрақ ${qIndex}/${total}`;
  document.getElementById("scoreText").innerText = `Ұпай: ${score}`;

  answers.forEach(a=>Composite.remove(engine.world,a));
  answers=[];

  const item = questions[Math.floor(Math.random()*questions.length)];
  correctAnswer = item.a;

  const arr = [item.a,item.w1,item.w2].sort(()=>Math.random()-0.5);

  arr.forEach((txt,i)=>{
    const body = Bodies.circle(
      window.innerWidth/2 + (i-1)*120,
      160,
      40,
      {
        isStatic:true,
        render:{
          sprite:{
            texture:"images/asyk.png",
            xScale:0.18,
            yScale:0.18
          }
        }
      }
    );
    body.answer = txt;
    Composite.add(engine.world,body);
    answers.push(body);
  });
}

function checkAnswer(ans){
  if(ans===correctAnswer) score++;
  qIndex++;
  if(qIndex>total){
    alert("Ойын бітті! Ұпай: "+score);
  } else {
    Matter.Body.setPosition(ball,{x:window.innerWidth/2,y:window.innerHeight-100});
    loadQuestion();
  }
}
