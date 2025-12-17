let studentName = "";
let score = 0;
let qIndex = 1;
let totalQuestions = 10;

const startBtn = document.getElementById("startBtn");
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const qBox = document.getElementById("questionBox");
const qNum = document.getElementById("questionNum");
const scoreTxt = document.getElementById("scoreTxt");

startBtn.onclick = () => {
  const name = document.getElementById("studentName").value.trim();
  if (!name) {
    alert("Атыңды жаз!");
    return;
  }
  studentName = name;
  menu.classList.add("hidden");
  game.classList.remove("hidden");
  startGame();
};

let engine, ball, answers = [], correctAnswer = "";

function startGame() {
  engine = Matter.Engine.create();

  const render = Matter.Render.create({
    canvas: document.getElementById("world"),
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,
      background: "#f4f8ff"
    }
  });

  ball = Matter.Bodies.circle(
    window.innerWidth / 2,
    window.innerHeight - 150,
    30,
    {
      restitution: 0.9,
      render: { fillStyle: "#38bdf8" }
    }
  );

  const ground = Matter.Bodies.rectangle(
    window.innerWidth / 2,
    window.innerHeight,
    window.innerWidth,
    40,
    { isStatic: true }
  );

  Matter.Composite.add(engine.world, [ball, ground]);

  Matter.Runner.run(engine);
  Matter.Render.run(render);

  loadQuestion();
}

const questions = [
  { q: "1 байт неше бит?", a: "8", w1: "4", w2: "16" },
  { q: "Компьютердің миы?", a: "Процессор", w1: "Монитор", w2: "Тінтуір" },
  { q: "Ақпарат өлшем бірлігі?", a: "Бит", w1: "Метр", w2: "Герц" }
];

function loadQuestion() {
  qNum.innerText = `Сұрақ: ${qIndex}/${totalQuestions}`;
  scoreTxt.innerText = `Ұпай: ${score}`;

  const item = questions[Math.floor(Math.random() * questions.length)];
  qBox.innerText = item.q;
  correctAnswer = item.a;

  answers.forEach(a => Matter.Composite.remove(engine.world, a));
  answers = [];

  [item.a, item.w1, item.w2].sort(() => Math.random() - 0.5)
    .forEach((txt, i) => {
      const body = Matter.Bodies.circle(
        window.innerWidth / 2 + (i - 1) * 140,
        200,
        45,
        {
          isStatic: true,
          render: {
            sprite: {
              texture: "images/asyk.png",
              xScale: 0.18,
              yScale: 0.18
            }
          }
        }
      );
      body.answer = txt;
      Matter.Composite.add(engine.world, body);
      answers.push(body);
    });
}
