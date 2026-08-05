"use client";

import { useEffect, useMemo, useState } from "react";

type Strand = "Number" | "Algebra" | "Measurement" | "Geometry" | "Statistics";
type Topic = {
  id: string;
  strand: Strand;
  title: string;
  chinese: string;
  summary: string;
  outcomes: string[];
  videoId: string;
  videoStart?: number;
  videoTitle: string;
  videoUrl?: string;
};
type Question = { prompt: string; choices: string[]; answer: string; hint: string };
type Progress = Record<string, { score: number; completedAt: string }>;

const STRANDS: Strand[] = ["Number", "Algebra", "Measurement", "Geometry", "Statistics"];
const CURRICULUM_URL = "https://www.education.govt.nz/parents-and-caregivers/schools-year-0-13/parent-portal/guide-for-the-new-zealand-curriculum-years-0-to-8/year-2-new-zealand-curriculum/mathematics-and-statistics-in-year-2";
const COMPILATION = "RdzCXBgB-9s";

const TOPICS: Topic[] = [
  { id:"numbers-120", strand:"Number", title:"Numbers to 120", chinese:"认识 0–120", summary:"Read, write, order and describe whole numbers up to 120.", outcomes:["Recognise, read and write numbers to 120","Order numbers from smallest to largest","Say the number before and after"], videoId:COMPILATION, videoStart:7, videoTitle:"Counting · Scratch Garden" },
  { id:"skip-counting", strand:"Number", title:"Counting & Skip Counting", chinese:"顺数、倒数与跳数", summary:"Count forwards and backwards in 1s, 2s, 5s and 10s from different starting points.", outcomes:["Count forwards and backwards","Skip count in 2s, 5s and 10s","Find missing numbers in a sequence"], videoId:"DhiklliLG80", videoTitle:"Skip Counting for Kids · Rock 'N Learn" },
  { id:"te-reo-numbers", strand:"Number", title:"Tau Māori to 100", chinese:"毛利语数字到 100", summary:"Use te reo Māori for familiar numbers and build tens up to 100.", outcomes:["Recognise tahi to tekau","Build multiples of ten","Match English and te reo Māori numbers"], videoId:COMPILATION, videoStart:7, videoTitle:"Counting foundations · Scratch Garden", videoUrl:"https://www.youtube.com/results?search_query=te+reo+M%C4%81ori+numbers+1+to+100+for+children" },
  { id:"place-value", strand:"Number", title:"Place Value", chinese:"位值与拆分", summary:"Show numbers as hundreds, tens and ones, then partition them in different ways.", outcomes:["Identify hundreds, tens and ones","Partition numbers such as 47 = 40 + 7","Explain the value of each digit"], videoId:"T5Qf0qSSJFI", videoTitle:"Place Value · Math Antics" },
  { id:"number-line", strand:"Number", title:"Number Lines & Comparing", chinese:"数轴、比较、奇偶与估算", summary:"Locate approximate values on a number line and compare numbers using mathematical language.", outcomes:["Place values approximately on a 0–120 line","Use <, > and =","Identify odd and even numbers"], videoId:COMPILATION, videoStart:344, videoTitle:"Estimating · Scratch Garden" },
  { id:"add-sub", strand:"Number", title:"Addition & Subtraction", chinese:"加减法与位值策略", summary:"Add and subtract by splitting numbers into tens and ones.", outcomes:["Add and subtract within 120","Use tens-and-ones strategies","Check whether an answer is reasonable"], videoId:"7J1OkxuyLD0", videoTitle:"Adding & Subtracting · Scratch Garden" },
  { id:"facts-doubles", strand:"Number", title:"Facts, Doubles & Halves", chinese:"20 以内事实、双倍与一半", summary:"Recall addition facts to 10 and explore related facts, doubles and halves to 20.", outcomes:["Recall addition facts to 10","Use related facts to 20","Find doubles and halves"], videoId:"7J1OkxuyLD0", videoStart:170, videoTitle:"Adding facts · Scratch Garden" },
  { id:"groups-sharing", strand:"Number", title:"Equal Groups & Sharing", chinese:"2、5、10 的乘除分组", summary:"Model multiplication and division using equal groups, sharing and skip counting.", outcomes:["Make equal groups of 2, 5 and 10","Connect repeated addition to multiplication","Share a set equally"], videoId:"DhiklliLG80", videoStart:0, videoTitle:"Skip counting and equal groups · Rock 'N Learn" },
  { id:"fractions", strand:"Number", title:"Fractions", chinese:"二分之一、三分之一、四分之一", summary:"Recognise, show and compare halves, thirds and quarters of wholes and sets.", outcomes:["Recognise ½, ⅓ and ¼","Know that fractional parts must be equal","Find fractions of a set"], videoId:"362JVVvgYPE", videoTitle:"Fractions! · Scratch Garden" },
  { id:"money", strand:"Number", title:"New Zealand Money", chinese:"新西兰钱币与 20 元以内金额", summary:"Order NZ coins and notes, group them and find totals up to $20.", outcomes:["Recognise NZ coin and note values","Make the same amount in different ways","Add money totals up to $20"], videoId:"p4KyWa-VJAY", videoTitle:"Coins and Their Values · Kids Academy", videoUrl:"https://www.youtube.com/results?search_query=New+Zealand+coins+and+notes+for+children" },
  { id:"equations", strand:"Algebra", title:"True Equations & Missing Numbers", chinese:"等式、比较与缺失数字", summary:"Understand equality, decide whether number sentences are true, and solve open equations.", outcomes:["Understand that = means both sides are equal","Use =, < and >","Find a missing number"], videoId:"7J1OkxuyLD0", videoStart:310, videoTitle:"Equations · Scratch Garden" },
  { id:"patterns", strand:"Algebra", title:"Repeating Patterns", chinese:"重复规律", summary:"Identify the repeating unit, predict what comes next and find missing elements.", outcomes:["Identify what repeats","Continue three-element patterns","Describe a pattern rule"], videoId:COMPILATION, videoStart:2431, videoTitle:"Patterns · Scratch Garden" },
  { id:"length", strand:"Measurement", title:"Length with Informal Units", chinese:"非标准单位测量长度", summary:"Estimate and measure length consistently using steps, string, pencils or paper clips.", outcomes:["Estimate before measuring","Measure with equal informal units","Compare longer, shorter, depth and width"], videoId:"2wUsdsae0ro", videoTitle:"Measuring! · Scratch Garden" },
  { id:"mass-capacity", strand:"Measurement", title:"Mass & Capacity", chinese:"重量与容量", summary:"Estimate and compare weight and capacity using blocks, cups and everyday containers.", outcomes:["Compare heavier and lighter","Compare shallow and deep","Measure capacity with equal cupfuls"], videoId:"2wUsdsae0ro", videoStart:145, videoTitle:"Mass and capacity · Scratch Garden" },
  { id:"turns", strand:"Measurement", title:"Turns", chinese:"顺逆时针与整、半、四分之一转", summary:"Describe clockwise and anti-clockwise full, half, quarter and three-quarter turns.", outcomes:["Name common fractions of a turn","Distinguish clockwise and anti-clockwise","Predict a finishing direction"], videoId:COMPILATION, videoStart:3344, videoTitle:"Location & directions · Scratch Garden" },
  { id:"calendar", strand:"Measurement", title:"Calendar & Duration", chinese:"月份、季节与时间跨度", summary:"Order months and seasons, and describe spans using years, months, weeks, days and hours.", outcomes:["Name and order the months","Match NZ seasons to months","Choose sensible duration units"], videoId:COMPILATION, videoStart:3344, videoTitle:"Time and everyday maths · Scratch Garden" },
  { id:"clock", strand:"Measurement", title:"Analogue Time", chinese:"整点、半点、一刻与差一刻", summary:"Tell analogue time to the hour, half-hour and quarter-hour.", outcomes:["Read o'clock and half past","Read quarter past and quarter to","Match analogue language to digital time"], videoId:COMPILATION, videoStart:3344, videoTitle:"Time in everyday maths · Scratch Garden", videoUrl:"https://www.youtube.com/results?search_query=telling+time+quarter+past+quarter+to+for+kids" },
  { id:"shapes", strand:"Geometry", title:"2D & 3D Shapes", chinese:"二维与三维形状", summary:"Recognise, describe and sort shapes by edges, corners, faces and vertices.", outcomes:["Name common 2D and 3D shapes","Describe edges, faces and vertices","Sort shapes by their features"], videoId:"CYVmmTaqIPU", videoTitle:"Faces, Edges and Vertices · Noodle Kidz" },
  { id:"shape-moves", strand:"Geometry", title:"Slide & Turn Shape Patterns", chinese:"平移、旋转与形状规律", summary:"Slide and turn 2D shapes to create and continue patterns.", outcomes:["Recognise a slide","Recognise a turn","Predict the next shape orientation"], videoId:COMPILATION, videoStart:2880, videoTitle:"Shapes · Scratch Garden" },
  { id:"position", strand:"Geometry", title:"Position & Directions", chinese:"位置、方向与路线", summary:"Follow and give movement instructions, including distances and turns, and read simple diagrams.", outcomes:["Use left, right, forward and backward","Follow multi-step directions","Describe an object's position"], videoId:COMPILATION, videoStart:3344, videoTitle:"Location & Directions · Scratch Garden" },
  { id:"collect-data", strand:"Statistics", title:"Collect & Represent Data", chinese:"收集与呈现数据", summary:"Sort and record data using tallies, tables, picture graphs and dot plots.", outcomes:["Choose a useful survey question","Record tally marks in groups of five","Read tables, picture graphs and dot plots"], videoId:COMPILATION, videoStart:3804, videoTitle:"Data · Scratch Garden" },
  { id:"interpret-data", strand:"Statistics", title:"Compare & Explain Data", chinese:"比较数据并形成结论", summary:"Compare results and choose or write the statement that best answers a statistical question.", outcomes:["Find most and least common categories","Answer how many more and total questions","Choose a conclusion supported by data"], videoId:COMPILATION, videoStart:3804, videoTitle:"Understanding Data · Scratch Garden" },
];

function hashText(text:string){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed:number){return()=>{seed+=0x6D2B79F5;let t=seed;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function shuffled<T>(items:T[], random:()=>number){return [...items].sort(()=>random()-.5)}
function numericChoices(correct:number, random:()=>number, suffix=""){const values=new Set<number>([correct]);let guard=0;while(values.size<4&&guard++<30){const jump=1+Math.floor(random()*Math.max(3,Math.min(10,Math.abs(correct)||3)));values.add(Math.max(0,correct+(random()>.5?jump:-jump)))}return shuffled([...values].map(v=>`${v}${suffix}`),random)}
function q(prompt:string, answer:string, choices:string[], hint:string, random:()=>number):Question{return{prompt,answer,choices:shuffled([...new Set([answer,...choices])].slice(0,4),random),hint}}
function maoriNumber(n:number){const ones=["kore","tahi","rua","toru","whā","rima","ono","whitu","waru","iwa"];if(n<10)return ones[n];if(n===10)return"tekau";if(n===100)return"kotahi rau";const tens=Math.floor(n/10),one=n%10;const lead=tens===1?"tekau":`${ones[tens]} tekau`;return one?`${lead} mā ${ones[one]}`:lead}

function makeQuestions(topic:Topic,setIndex:number):Question[]{
  const random=rng(hashText(`${topic.id}-${setIndex}`));
  const pick=<T,>(xs:T[])=>xs[Math.floor(random()*xs.length)];
  const out:Question[]=[];
  const shapes=[{n:"triangle",f:"3 sides"},{n:"square",f:"4 equal sides"},{n:"pentagon",f:"5 sides"},{n:"hexagon",f:"6 sides"},{n:"cube",f:"6 square faces"},{n:"cuboid",f:"6 rectangular faces"},{n:"cone",f:"1 flat face and 1 curved surface"},{n:"pyramid",f:"triangular faces meeting at a vertex"}];
  const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  for(let i=0;i<20;i++){
    if(topic.id==="numbers-120"){
      const n=2+Math.floor(random()*117); const mode=i%4;
      if(mode===0)out.push(q(`What number comes after ${n}?`,`${n+1}`,numericChoices(n+1,random),"Count forward one.",random));
      else if(mode===1)out.push(q(`What number comes before ${n}?`,`${n-1}`,numericChoices(n-1,random),"Count backward one.",random));
      else if(mode===2){const m=Math.min(120,n+1+Math.floor(random()*12));out.push(q(`Which number is greater: ${n} or ${m}?`,`${m}`,[`${n}`,`${Math.max(0,n-1)}`,`${Math.min(120,m+1)}`],"The greater number is farther along the counting sequence.",random))}
      else{const a=Math.floor(random()*100),b=Math.min(120,a+Math.floor(random()*18)+1);out.push(q(`Put these in order from smallest to largest: ${b}, ${a}, ${Math.floor((a+b)/2)}`,`${a}, ${Math.floor((a+b)/2)}, ${b}`,[`${b}, ${Math.floor((a+b)/2)}, ${a}`,`${a}, ${b}, ${Math.floor((a+b)/2)}`,`${Math.floor((a+b)/2)}, ${a}, ${b}`],"Start with the number closest to zero.",random))}
    } else if(topic.id==="skip-counting"){
      const step=pick([1,2,5,10]),start=Math.floor(random()*(121-step*3));const seq=[start,start+step,start+step*2,start+step*3];const missing=1+Math.floor(random()*2),answer=seq[missing];out.push(q(`Fill the gap: ${seq.map((v,j)=>j===missing?"__":v).join(", ")}`,`${answer}`,numericChoices(answer,random),`The pattern changes by ${step} each time.`,random));
    } else if(topic.id==="te-reo-numbers"){
      const n=1+Math.floor(random()*100);if(i%2===0)out.push(q(`Which te reo Māori number means ${n}?`,maoriNumber(n),[maoriNumber(Math.max(1,n-1)),maoriNumber(Math.min(100,n+1)),maoriNumber(Math.max(1,n-10))],"Listen for the tens and ones.",random));else{const ans=`${n}`;out.push(q(`What number is “${maoriNumber(n)}”?`,ans,numericChoices(n,random),"Tekau means ten; mā joins the ones.",random))}
    } else if(topic.id==="place-value"){
      const n=10+Math.floor(random()*111),h=Math.floor(n/100),t=Math.floor((n%100)/10),o=n%10;const answer=n>=100?`${h} hundred, ${t} tens, ${o} ones`:`${t} tens and ${o} ones`;out.push(q(`How is ${n} partitioned?`,answer,[`${Math.max(0,t-1)} tens and ${o+10} ones`,`${o} tens and ${t} ones`,`${t+1} tens and ${o} ones`],"Read each digit by its place.",random));
    } else if(topic.id==="number-line"){
      const n=Math.floor(random()*121);if(i%2===0)out.push(q(`Is ${n} odd or even?`,n%2?"odd":"even",[n%2?"even":"odd","both","neither"],"Even numbers can be shared into pairs with none left over.",random));else{const m=Math.floor(random()*121),answer=n>m?">":n<m?"<":"=";out.push(q(`Choose the sign: ${n} __ ${m}`,answer,["<",">","="].filter(x=>x!==answer),"Imagine both numbers on a number line.",random))}
    } else if(topic.id==="add-sub"){
      const add=i%2===0;if(add){const a=10+Math.floor(random()*70),b=1+Math.floor(random()*Math.min(40,120-a));const ans=a+b;out.push(q(`${a} + ${b} = ?`,`${ans}`,numericChoices(ans,random),`Split ${b} into tens and ones.`,random))}else{const a=20+Math.floor(random()*101),b=1+Math.floor(random()*Math.min(50,a));const ans=a-b;out.push(q(`${a} − ${b} = ?`,`${ans}`,numericChoices(ans,random),`Subtract the tens, then the ones.`,random))}
    } else if(topic.id==="facts-doubles"){
      if(i%2===0){const n=1+Math.floor(random()*10),ans=n*2;out.push(q(`Double ${n} is…`,`${ans}`,numericChoices(ans,random),`Add ${n} to itself.`,random))}else{const n=2*(1+Math.floor(random()*10)),ans=n/2;out.push(q(`Half of ${n} is…`,`${ans}`,numericChoices(ans,random),"Share the number into two equal groups.",random))}
    } else if(topic.id==="groups-sharing"){
      const size=pick([2,5,10]),groups=1+Math.floor(random()*8),total=size*groups;if(i%2===0)out.push(q(`${groups} equal groups of ${size} make…`,`${total}`,numericChoices(total,random),`Skip count by ${size}, ${groups} times.`,random));else out.push(q(`${total} objects are shared into ${groups} equal groups. How many in each group?`,`${size}`,numericChoices(size,random),"Each group must have the same amount.",random));
    } else if(topic.id==="fractions"){
      const den=pick([2,3,4]),unit=1+Math.floor(random()*5),total=den*unit,word=den===2?"half":den===3?"third":"quarter";out.push(q(`What is one ${word} of ${total}?`,`${unit}`,numericChoices(unit,random),`Share ${total} into ${den} equal groups.`,random));
    } else if(topic.id==="money"){
      const values=[10,20,50,100,200,500,1000,2000],a=pick(values),b=pick(values.filter(v=>v+a<=2000)),total=a+b;const fmt=(v:number)=>v<100?`${v}c`:`$${v/100}`;out.push(q(`${fmt(a)} + ${fmt(b)} = ?`,fmt(total),[fmt(Math.max(10,total-10)),fmt(Math.min(2000,total+10)),fmt(Math.max(10,total-a))],"Convert coins and notes to the same unit, then add.",random));
    } else if(topic.id==="equations"){
      const a=1+Math.floor(random()*15),b=1+Math.floor(random()*10),c=1+Math.floor(random()*15),ans=a+b-c;if(ans>=0&&ans<=20)out.push(q(`${a} + ${b} = ${c} + __`,`${ans}`,numericChoices(ans,random),"Both sides of the equals sign must have the same value.",random));else{i--;continue}
    } else if(topic.id==="patterns"){
      const sets=[["red","blue","green"],["circle","square","triangle"],["clap","stomp","jump"],["1","2","3"]],pat=pick(sets),offset=Math.floor(random()*3),seq=Array.from({length:6},(_,j)=>pat[(j+offset)%3]),ans=pat[(6+offset)%3];out.push(q(`What comes next? ${seq.join(", ")}, __`,ans,pat.filter(x=>x!==ans).concat(["stop"]),"Find the part that repeats.",random));
    } else if(topic.id==="length"){
      const a=3+Math.floor(random()*10),b=3+Math.floor(random()*10);if(a===b){i--;continue}out.push(q(`A pencil is ${a} paper clips long. A crayon is ${b} paper clips long. Which is longer?`,a>b?"the pencil":"the crayon",[a>b?"the crayon":"the pencil","they are equal","we cannot compare"],"Both objects were measured with the same unit.",random));
    } else if(topic.id==="mass-capacity"){
      const a=1+Math.floor(random()*10),b=1+Math.floor(random()*10);if(a===b){i--;continue}const capacity=i%2===0;out.push(q(capacity?`Bottle A holds ${a} cups. Bottle B holds ${b} cups. Which holds more?`:`Object A balances ${a} blocks. Object B balances ${b} blocks. Which is heavier?`,a>b?"A":"B",[a>b?"B":"A","They are equal","Not enough information"],"The greater count shows more capacity or mass when the units are equal.",random));
    } else if(topic.id==="turns"){
      const dirs=["north","east","south","west"],start=Math.floor(random()*4),quarters=pick([1,2,3,4]),clockwise=random()>.5,finish=(start+(clockwise?quarters:-quarters)+8)%4;const turn=quarters===1?"a quarter":quarters===2?"a half":quarters===3?"a three-quarter":"a full";out.push(q(`Face ${dirs[start]}. Make ${turn} turn ${clockwise?"clockwise":"anti-clockwise"}. Which way are you facing?`,dirs[finish],dirs.filter(d=>d!==dirs[finish]),"A quarter turn moves to the next direction; a half turn faces the opposite way.",random));
    } else if(topic.id==="calendar"){
      const m=Math.floor(random()*12);if(i%2===0)out.push(q(`Which month comes after ${months[m]}?`,months[(m+1)%12],months.filter(x=>x!==months[(m+1)%12]).slice(0,3),"Move one step forward through the months.",random));else{const season=pick([["summer","December"],["autumn","March"],["winter","June"],["spring","September"]]);out.push(q(`In Aotearoa New Zealand, which month begins ${season[0]}?`,season[1],months.filter(x=>x!==season[1]).sort(()=>random()-.5).slice(0,3),"New Zealand is in the Southern Hemisphere.",random))}
    } else if(topic.id==="clock"){
      const hour=1+Math.floor(random()*12),minute=pick([0,15,30,45]),next=hour===12?1:hour+1;const wording=minute===0?`${hour} o'clock`:minute===15?`quarter past ${hour}`:minute===30?`half past ${hour}`:`quarter to ${next}`;const answer=`${hour}:${String(minute).padStart(2,"0")}`;out.push(q(`Which digital time means “${wording}”?`,answer,[`${next}:${String(minute).padStart(2,"0")}`,`${hour}:${String((minute+15)%60).padStart(2,"0")}`,`${next}:${String((60-minute)%60).padStart(2,"0")}`],"Past uses the current hour; quarter to points to the next hour.",random));
    } else if(topic.id==="shapes"){
      const item=pick(shapes);out.push(q(`Which shape has ${item.f}?`,item.n,shapes.filter(s=>s.n!==item.n).sort(()=>random()-.5).slice(0,3).map(s=>s.n),"Use the shape's features, not only its appearance.",random));
    } else if(topic.id==="shape-moves"){
      const moves=["slide","quarter turn","half turn"],pat=[pick(moves),pick(moves)];if(pat[0]===pat[1])pat[1]=moves[(moves.indexOf(pat[0])+1)%3];const ans=pat[i%2];out.push(q(`Continue the movement pattern: ${pat[0]}, ${pat[1]}, ${pat[0]}, ${pat[1]}, __`,ans,moves.filter(x=>x!==ans).concat(["full stop"]),"The two movements repeat in the same order.",random));
    } else if(topic.id==="position"){
      const dirs=["left","right","forward","backward"],first=pick(dirs),second=pick(dirs);out.push(q(`Ryan moves ${first}, then ${second}. Which instruction did he follow first?`,first,dirs.filter(d=>d!==first),"Read movement instructions in order.",random));
    } else if(topic.id==="collect-data"){
      const total=1+Math.floor(random()*12);if(i%2===0)out.push(q(`A tally chart shows ${"||||/ ".repeat(Math.floor(total/5))}${"|".repeat(total%5)}. What is the total?`,`${total}`,numericChoices(total,random),"Count each crossed bundle as five, then add the extra marks.",random));else out.push(q("Which question would collect useful data about favourite fruit?","What is your favourite fruit?",["Do you like things?","How old is the fruit?","What day is today?"],"A statistical question should allow different answers that can be grouped.",random))
    } else {
      const cats=2+Math.floor(random()*8),dogs=1+Math.floor(random()*7),fish=1+Math.floor(random()*5),mode=i%3;if(mode===0){const vals={cats,dogs,fish},answer=Object.entries(vals).sort((a,b)=>b[1]-a[1])[0][0];out.push(q(`Survey results — cats: ${cats}, dogs: ${dogs}, fish: ${fish}. Which is most common?`,answer,["cats","dogs","fish"].filter(x=>x!==answer),"Compare the three counts and choose the greatest.",random))}else if(mode===1){const ans=Math.abs(cats-dogs);out.push(q(`Cats: ${cats}. Dogs: ${dogs}. How many more are in the larger group?`,`${ans}`,numericChoices(ans,random),"Subtract the smaller count from the larger count.",random))}else{const ans=cats+dogs+fish;out.push(q(`Cats: ${cats}, dogs: ${dogs}, fish: ${fish}. How many responses altogether?`,`${ans}`,numericChoices(ans,random),"Add every category to find the total.",random))}
    }
  }
  return out;
}

export default function MathsApp(){
  const [topicId,setTopicId]=useState(TOPICS[0].id);
  const [strand,setStrand]=useState<Strand>("Number");
  const [progress,setProgress]=useState<Progress>({});
  const [quiz,setQuiz]=useState<{set:number;index:number;answers:string[]}|null>(null);
  const [selected,setSelected]=useState<string|null>(null);
  const topic=TOPICS.find(t=>t.id===topicId)!;
  const questions=useMemo(()=>quiz?makeQuestions(topic,quiz.set):[],[topic,quiz?.set]);
  useEffect(()=>{try{const saved=localStorage.getItem("ryan-year2-maths-progress");if(saved)setProgress(JSON.parse(saved))}catch{}},[]);
  const completed=Object.keys(progress).length,totalSets=TOPICS.length*10;
  const selectTopic=(next:Topic)=>{setTopicId(next.id);setStrand(next.strand);setQuiz(null);setSelected(null);window.scrollTo({top:0,behavior:"smooth"})};
  const startSet=(set:number)=>{setQuiz({set,index:0,answers:[]});setSelected(null);window.scrollTo({top:0,behavior:"smooth"})};
  const choose=(answer:string)=>{if(!quiz||selected)return;setSelected(answer)};
  const next=()=>{if(!quiz||!selected)return;const answers=[...quiz.answers,selected];if(quiz.index===19){const score=answers.reduce((sum,a,j)=>sum+(a===questions[j].answer?1:0),0);const nextProgress={...progress,[`${topic.id}-${quiz.set}`]:{score,completedAt:new Date().toISOString()}};setProgress(nextProgress);localStorage.setItem("ryan-year2-maths-progress",JSON.stringify(nextProgress));setQuiz({...quiz,index:20,answers});setSelected(null)}else{setQuiz({...quiz,index:quiz.index+1,answers});setSelected(null)}};
  const current=quiz&&quiz.index<20?questions[quiz.index]:null;
  const finalScore=quiz&&quiz.index===20?quiz.answers.reduce((sum,a,j)=>sum+(a===questions[j].answer?1:0),0):0;
  const openVideo=topic.videoUrl||`https://www.youtube.com/watch?v=${topic.videoId}${topic.videoStart?`&t=${topic.videoStart}s`:""}`;

  if(quiz){
    return <main className="quiz-page"><header className="quiz-top"><button className="back" onClick={()=>{setQuiz(null);setSelected(null)}}>← Back to {topic.title}</button><div className="quiz-meta"><span>Set {quiz.set}</span><b>{Math.min(quiz.index+1,20)} / 20</b></div></header>{current?<section className="quiz-card"><div className="quiz-progress"><span style={{width:`${(quiz.index/20)*100}%`}} /></div><p className="question-label">QUESTION {quiz.index+1}</p><h1>{current.prompt}</h1><div className="answers">{current.choices.map(choice=><button key={choice} onClick={()=>choose(choice)} className={selected?choice===current.answer?"correct":choice===selected?"wrong":"dim":""}>{choice}</button>)}</div>{selected&&<div className={selected===current.answer?"feedback good":"feedback try"}><b>{selected===current.answer?"Ka pai! Correct.":"Not quite — keep learning."}</b><p>{current.hint}</p><button onClick={next}>{quiz.index===19?"See my result":"Next question →"}</button></div>}</section>:<section className="result-card"><div className="result-ring">{finalScore}<small>/20</small></div><p className="eyebrow">SET {quiz.set} COMPLETE</p><h1>{finalScore>=16?"Excellent exploring!":finalScore>=12?"Good progress!":"Let’s practise this trail again."}</h1><p>Your result is saved on this device. Try another set, or repeat this one to improve.</p><div className="result-actions"><button onClick={()=>startSet(quiz.set)}>Try set again</button><button className="primary" onClick={()=>{setQuiz(null);setSelected(null)}}>Choose another set</button></div></section>}</main>
  }

  return <main className="app-shell">
    <header className="site-header"><a className="identity" href="#top"><span className="mark">R</span><span><b>Ryan’s Maths Fieldbook</b><small>New Zealand Year 2</small></span></a><div className="overall"><span><b>{completed}</b> of {totalSets} sets complete</span><div><i style={{width:`${completed/totalSets*100}%`}} /></div></div><a className="curriculum-link" href={CURRICULUM_URL} target="_blank" rel="noreferrer">NZ Curriculum ↗</a></header>
    <div className="strand-bar" aria-label="Curriculum strands">{STRANDS.map(s=><button key={s} className={strand===s?"active":""} onClick={()=>{setStrand(s);const first=TOPICS.find(t=>t.strand===s)!;selectTopic(first)}}><span>{s==="Number"?"123":s==="Algebra"?"=":s==="Measurement"?"↔":s==="Geometry"?"◇":"▥"}</span>{s}</button>)}</div>
    <div className="workspace" id="top"><aside className="topic-list"><p className="list-label">{strand} trail</p>{TOPICS.filter(t=>t.strand===strand).map((t,index)=><button key={t.id} className={t.id===topic.id?"selected":""} onClick={()=>selectTopic(t)}><span className="topic-number">{String(index+1).padStart(2,"0")}</span><span><b>{t.title}</b><small>{t.chinese}</small></span><i>{Object.keys(progress).filter(k=>k.startsWith(`${t.id}-`)).length}/10</i></button>)}</aside>
      <section className="lesson"><div className="trail"><span>{topic.strand}</span><b>Knowledge point {TOPICS.indexOf(topic)+1} of {TOPICS.length}</b></div><h1>{topic.title}</h1><p className="chinese">{topic.chinese}</p><p className="summary">{topic.summary}</p>
        <div className="lesson-grid"><div className="video-card"><div className="video-frame"><iframe key={topic.id} src={`https://www.youtube-nocookie.com/embed/${topic.videoId}?rel=0${topic.videoStart?`&start=${topic.videoStart}`:""}`} title={topic.videoTitle} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div><div className="video-foot"><span><small>WATCH FIRST</small><b>{topic.videoTitle}</b></span><a href={openVideo} target="_blank" rel="noreferrer">Open on YouTube ↗</a></div></div>
          <div className="goals-card"><p className="eyebrow">RYAN WILL LEARN TO</p><ul>{topic.outcomes.map(x=><li key={x}><span>✓</span>{x}</li>)}</ul><div className="speak"><b>Explain it aloud</b><p>After practising, tell someone in English: “I worked it out by…”</p></div></div></div>
        <section className="practice-section"><div className="practice-heading"><div><p className="eyebrow">ONLINE PRACTICE</p><h2>10 sets · 20 questions each</h2><p>Choose any set. Questions change across the trail and give instant feedback.</p></div><span className="saved-note">Progress saves on this device</span></div><div className="set-grid">{Array.from({length:10},(_,i)=>i+1).map(set=>{const result=progress[`${topic.id}-${set}`];return <button key={set} onClick={()=>startSet(set)} className={result?"done":""}><span>{result?"✓":set}</span><b>Set {set}</b><small>{result?`${result.score}/20 · Try again`:"20 questions"}</small></button>})}</div></section>
      </section></div>
    <footer><p>Built around the Ministry of Education’s Year 2 Mathematics and Statistics expectations.</p><a href={CURRICULUM_URL} target="_blank" rel="noreferrer">View the official guide ↗</a></footer>
  </main>
}
