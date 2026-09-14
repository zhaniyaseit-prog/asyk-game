const questions=[
{type:"Математикалық есеп",q:"101₂ саны ондық жүйеде нешеге тең?",a:["3","4","5","6"],c:2},
{type:"Асық есебі",q:"1 КБ = 1024 байт болса, 4 КБ неше байт?",a:["2048","4096","5120","1024"],c:1},
{type:"Ақиқат / Жалған",q:"Алгоритм — есепті шешуге арналған реттелген әрекеттер тізбегі.",a:["Ақиқат","Жалған"],c:0},
{type:"Python",q:"Кодтың нәтижесін тап.",code:"a = 7\nb = 3\nprint(a + b * 2)",a:["20","13","17","10"],c:1},
{type:"Математикалық есеп",q:"x = 5 болса, 2x² − 3 өрнегінің мәні қанша?",a:["22","47","17","25"],c:1},
{type:"Сәйкестендіру",q:"RAM, CPU, HTML, CSS терминдерінің дұрыс қызметін тап.",a:["RAM — жедел жад","CPU — процессор","HTML — веб құрылымы","CSS — безендіру"],c:0},
{type:"Python",q:"Цикл неше рет орындалады?",code:"for i in range(2, 10, 2):\n    print(i)",a:["3 рет","4 рет","5 рет","8 рет"],c:2},
{type:"Математикалық есеп",q:"16₁₀ саны екілік жүйеде қалай жазылады?",a:["1000₂","1010₂","1111₂","10000₂"],c:3},
{type:"Ақиқат / Жалған",q:"Python тізімінің бірінші элементінің индексі 0-ден басталады.",a:["Ақиқат","Жалған"],c:0},
{type:"Реттеу",q:"Бағдарлама жасау кезеңдерін дұрыс ретпен ойша анықта.",a:["Тапсырманы талдау","Код жазу","Қатені түзету","Нәтижені тексеру"],c:0},
{type:"Математикалық есеп",q:"1101₂ санының ондық мәні қанша?",a:["11","12","13","14"],c:2},
{type:"Python",q:"Нәтижені тап.",code:"x = 4\nif x > 3:\n    print(x * 2)",a:["4","7","8","12"],c:2},
{type:"Логикалық есеп",q:"A = 1, B = 0. A AND B мәні қандай?",a:["0","1","2","10"],c:0},
{type:"Асық есебі",q:"Компьютер 1 секундта 1000 операция орындаса, 5 секундта қанша операция орындайды?",a:["500","1000","5000","10000"],c:2},
{type:"Финалдық асық",q:"Қай пароль ең қауіпсіз?",a:["12345678","qwerty123","Asem2000","Kz!7mQ#29x"],c:3}
];

let idx=0,score=0,name="Оқушы",drag=false,shot=false,startX=0,startY=0,arenaRect=null,asykX=0,asykY=0;
const $=id=>document.getElementById(id);

$("startBtn").onclick=()=>{
 name=$("playerName").value.trim()||"Оқушы";
 $("start").classList.add("hidden");$("play").classList.remove("hidden");setupQuestion();
};

function setupQuestion(){
 const q=questions[idx];scoreText();
 $("qCounter").textContent=`${idx+1} / 15`;$("qType").textContent=`АСЫҚ №${idx+1} • ${q.type}`;$("question").textContent=q.q;
 $("code").textContent=q.code||"";$("code").classList.toggle("hidden",!q.code);$("feedback").textContent="";$("nextBtn").classList.add("hidden");
 $("answers").innerHTML="";
 q.a.forEach((txt,n)=>{const b=document.createElement("button");b.className="answer";b.textContent=txt;b.dataset.index=n;$("answers").appendChild(b)});
 const a=$("asyk");a.className="asyk";a.style.left="50%";a.style.top="50%";a.style.transform="translate(-50%,-50%)";a.querySelector("span").textContent="ТАРТ";
 $("aimLine").style.opacity=0;$("arrowHead").style.opacity=0;$("power").classList.add("hidden");
 shot=false;drag=false;
}
function scoreText(){$("score").textContent=score}
function pointFromEvent(e){return{x:e.clientX,y:e.clientY}}
function beginDrag(e){
 if(shot)return;e.preventDefault();arenaRect=$("arena").getBoundingClientRect();const p=pointFromEvent(e);
 const cx=arenaRect.left+arenaRect.width/2,cy=arenaRect.top+arenaRect.height/2;
 startX=cx;startY=cy;drag=true;$("asyk").classList.add("drag");$("power").classList.remove("hidden");
 window.addEventListener("pointermove",moveDrag);window.addEventListener("pointerup",releaseDrag,{once:true});
}
function moveDrag(e){
 if(!drag)return;const p=pointFromEvent(e);const cx=arenaRect.left+arenaRect.width/2,cy=arenaRect.top+arenaRect.height/2;
 let dx=p.x-cx,dy=p.y-cy;const max=125;const len=Math.hypot(dx,dy)||1;if(len>max){dx=dx/len*max;dy=dy/len*max}
 // Slingshot pulls backward: finger direction is opposite launch direction.
 const ax=-dx,ay=-dy;
 $("asyk").style.left=`calc(50% + ${dx}px)`;$("asyk").style.top=`calc(50% + ${dy}px)`;
 const x1=arenaRect.width/2-dx,y1=arenaRect.height/2-dy,x2=arenaRect.width/2+ax*2,y2=arenaRect.height/2+ay*2;
 $("aimLine").setAttribute("x1",arenaRect.width/2-dx);$("aimLine").setAttribute("y1",arenaRect.height/2-dy);$("aimLine").setAttribute("x2",arenaRect.width/2+ax*2);$("aimLine").setAttribute("y2",arenaRect.height/2+ay*2);$("aimLine").style.opacity=.95;
 const ang=Math.atan2(ay,ax),lenArrow=18;const px=x2,py=y2;const p1=`${px-lenArrow*Math.cos(ang-.45)},${py-lenArrow*Math.sin(ang-.45)}`,p2=`${px-lenArrow*Math.cos(ang+.45)},${py-lenArrow*Math.sin(ang+.45)}`;$("arrowHead").setAttribute("points",`${px},${py} ${p1} ${p2}`);$("arrowHead").style.opacity=.95;
 $("power").querySelector("i").style.width=Math.min(100,len/max*100)+"%";
}
function releaseDrag(e){
 if(!drag)return;drag=false;$("asyk").classList.remove("drag");window.removeEventListener("pointermove",moveDrag);
 const p=pointFromEvent(e);const cx=arenaRect.left+arenaRect.width/2,cy=arenaRect.top+arenaRect.height/2;let dx=p.x-cx,dy=p.y-cy;const len=Math.hypot(dx,dy)||1;
 if(len<25){resetAim();return}
 const launchX=-dx/len,launchY=-dy/len;
 // Pick the answer whose center is closest to launch ray.
 const buttons=[...document.querySelectorAll(".answer")];let best=null,bestScore=Infinity;
 buttons.forEach(b=>{const r=b.getBoundingClientRect();const bx=r.left+r.width/2,by=r.top+r.height/2;const vx=bx-cx,vy=by-cy;const vlen=Math.hypot(vx,vy)||1;const cross=Math.abs(launchX*vy-launchY*vx);const behind=launchX*vx+launchY*vy;const s=cross/vlen+(behind<0?2:0);if(s<bestScore){bestScore=s;best=b}});
 shootAnimation(launchX,launchY,best);
}
function shootAnimation(lx,ly,target){
 shot=true;$("aimLine").style.opacity=0;$("arrowHead").style.opacity=0;$("power").classList.add("hidden");
 const a=$("asyk");a.style.transition="left .38s cubic-bezier(.15,.8,.3,1), top .38s cubic-bezier(.15,.8,.3,1), transform .38s";
 a.style.left=`calc(50% + ${lx*430}px)`;a.style.top=`calc(50% + ${ly*430}px)`;a.style.transform="translate(-50%,-50%) rotate(35deg) scale(.7)";
 setTimeout(()=>{if(target){const n=Number(target.dataset.index);target.classList.add(n===questions[idx].c?"correct":"wrong");if(n===questions[idx].c){score+=10;$("feedback").textContent="🎯 ДӘЛ ТИДІ! +10 ұпай"}else{$("feedback").textContent="❌ Мүлт кетті! Дұрыс жауап белгіленді.";document.querySelectorAll(".answer")[questions[idx].c].classList.add("correct")}$("score").textContent=score;$("nextBtn").classList.remove("hidden")}},420);
}
function resetAim(){$("asyk").style.left="50%";$("asyk").style.top="50%";$("asyk").style.transform="translate(-50%,-50%)";$("aimLine").style.opacity=0;$("arrowHead").style.opacity=0;$("power").classList.add("hidden")}
$("asyk").addEventListener("pointerdown",beginDrag);
$("nextBtn").onclick=()=>{idx++;if(idx<15){$("questionBox")?.classList.add("hidden");setupQuestion()}else finish()};
function finish(){$("play").classList.add("hidden");$("finish").classList.remove("hidden");$("resultName").textContent=`${name}, сенің нәтижең:`;$("finalScore").textContent=score;$("resultText").textContent=score>=130?"🌟 Нағыз мерген! Информатиканы өте жақсы меңгергенсің!":score>=100?"👏 Жақсы нәтиже!":score>=70?"👍 Жақсы, тағы жаттығ!":"📚 Тақырыптарды қайталап, қайта ат!";}


  

 
