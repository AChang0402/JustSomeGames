var map= [];
var rows = 9;
var columns = 9;
var mines = 10;
var minelocations = [];
var userflags = [];
var wrongflags = [];
var firstmove = true;
var seconds = 0;
var timer = null;

setDifficulty();

function countseconds(){
  timer=setInterval(everySecond, 1000)
}

function everySecond(){
  seconds++;
  document.querySelector(".timer").innerText = seconds;
}

function stoptimer(){
  clearInterval(timer)
}

function render(map, rows, columns) {
  var result = "";
  for(var i=0; i<rows; i++) {
    for(var j=0; j<columns; j++) {
      result += `<button class="square" id = "${i}-${j}" onclick="leftClick(${i}, ${j}, this)" oncontextmenu="flag(this)"></button>`;
    }
  }
  return result;
}

function noRightClick(){
  var buttons = document.querySelectorAll(".square");
  for (var z=0;z<buttons.length;z++){
    buttons[z].addEventListener("contextmenu", e => e.preventDefault());
  }
}

function createDojo() {

  var newarr = [];
  var temparr=[];

  for (var x=0; x<rows; x++){
    for (var y=0; y<columns; y++){
      temparr.push(0);
    }
    newarr.push(temparr);
    temparr=[];
  }

  map = newarr;
}

function addMines(map, numMines){
  minelocations = [];
  var count = 0;
  var i = 0;
  var j = 0;
  while (count<numMines) {
    i = Math.floor(Math.random() * rows);
    j = Math.floor(Math.random() * columns);
    if (map[i][j]==0){
      map[i][j]=1;
      minelocations.push(i+"-"+j)
      count++;
    }
  }
}

function reset() {
  createDojo();
  addMines(map, mines);
  console.log(map)
  document.querySelector("#grid").innerHTML = render(map, rows, columns);
  document.getElementById("bombsleft").innerText = mines;
  noRightClick();
  userflags = [];
  wrongflags = [];
  document.getElementById("announcement").innerText="";
  document.getElementById("subtext").innerText="";
  firstmove=true;
  clearInterval(timer)
  seconds = 0;
  document.querySelector(".timer").innerText = seconds;
}

function setDifficulty() {
  var difficulty = document.getElementById("difficulty").value;
  if (difficulty=="Beginner"){
    mines=10;
    rows=9;
    columns=9;
  }
  else if(difficulty=="Intermediate"){
    mines=40
    rows=16;
    columns=16;
  }
  else if(difficulty=="Advanced"){
    mines=99
    rows=16;
    columns=30;
  }
  document.getElementById("grid").style.width = (columns*32)+"px";
  reset();
}

function leftClick(i, j, element){

  element.classList.add("square-clicked")
  element.classList.remove("square")

//Creates first move protection
  if (firstmove){
    countseconds()
    if (map[i][j] == 1){
      console.log(map)
      var removeat = minelocations.indexOf(i+"-"+j);
      minelocations.splice(removeat, 1);
      var count=0;
      while (count<1) {
        var a=Math.floor(Math.random() * rows);
        var b=Math.floor(Math.random() * columns);
        if (map[a][b]==0){
          map[a][b]=1;
          minelocations.push(a+"-"+b);
          count++;
        }
      }
      map[i][j]=0;
    }
  }
  firstmove=false;


//Check the Lose Condition
  if (map[i][j] == 1) {
    element.style.backgroundColor = "red"
    for (var z=0;z<minelocations.length;z++){
      document.getElementById(minelocations[z]).innerHTML = '<img class="buttonimg" src="./Images/bomb.png" alt="bomb">'
    }

    for (var x=0; x<userflags.length; x++){
      if(minelocations.includes(userflags[x])==false){
        wrongflags.push(userflags[x]);
      }
    }
    for (y=0; y<wrongflags.length; y++){
      document.getElementById(wrongflags[y]).style.backgroundColor = "orange";
    }
    stoptimer();
    document.getElementById("announcement").innerText="Oops! Try again!"
    disablebuttons();
    return;
  }

  if (element.classList.contains("flagged")){
    element.classList.remove("flagged");
    document.getElementById("bombsleft").innerText ++;
    var remove = userflags.indexOf(element.id);
    userflags.splice(remove, 1);
  }

  var howmanymines = howMany(i,j,element);
  if (howmanymines== 0){
    element.innerText = "";
    element.classList.add("zero")
    bloom();
  }
  else {
    element.innerText = howmanymines;
    element.classList.add("color"+howmanymines);
  }

  if (checkWin()){
    stoptimer();
    document.getElementById("announcement").innerText="You Won!";
    document.getElementById("subtext").innerText="You completed the "+document.getElementById("difficulty").value+" difficulty level in "+seconds+" seconds!";
    disablebuttons();
  };
}

function howMany(i, j) {
  var sum=0;
  var x1 = i-1;
  var x2 = i+1;
  var y1 = j-1;
  var y2 = j+1;

  if(x1<0){
    x1=0;
  }
  if(x2>rows-1){
    x2=rows-1;
  }
  if(y1<0){
    y1=0;
  }
  if(y2>columns-1){
    y2=columns-1;
  }

  var starty1 = y1;

  for (x1; x1<=x2; x1++){
    for (y1; y1<=y2; y1++){
      sum+=map[x1][y1];
    }
    y1=starty1;
  }

  return sum;
}

function bloom(){
  var clickedzeros = document.querySelectorAll(".zero")
  var checkat = [];

  for (i=0; i<clickedzeros.length; i++){
    checkat.push(clickedzeros[i].id);
  }


  for (j=0; j<checkat.length; j++){

    var x = +(checkat[j].split("-")[0]);
    var y = +(checkat[j].split("-")[1]);

    var x1 = x-1;
    var x2 = x+1;
    var y1 = y-1;
    var y2 = y+1;
  
    if(x1<0){
      x1=0;
    }
    if(x2>rows-1){
      x2=rows-1;
    }
    if(y1<0){
      y1=0;
    }
    if(y2>columns-1){
      y2=columns-1;
    }

    var starty1 = y1;

    for (x1; x1<=x2; x1++){
      for (y1; y1<=y2; y1++){
        var coordinates = x1+"-"+y1;
        document.getElementById(coordinates).classList.add("square-clicked")
        document.getElementById(coordinates).classList.remove("square")
        if (document.getElementById(coordinates).classList.contains("flagged")){
          document.getElementById(coordinates).innerHTML = '';
          document.getElementById(coordinates).classList.remove("flagged");
          document.getElementById("bombsleft").innerText ++;
          var remove = userflags.indexOf(document.getElementById(coordinates).id);
          userflags.splice(remove, 1);
        }
        if(howMany(x1,y1)!=0){
        document.getElementById(coordinates).innerText = howMany(x1,y1)
        document.getElementById(coordinates).classList.add("color"+howMany(x1,y1))
        }
        if (howMany(x1,y1) == 0 && checkat.includes(coordinates)==false){
          checkat.push(coordinates);
        }
      }
      y1=starty1;
    }
  }
}

function flag(element){
  if (element.classList.contains("square-clicked")==false && element.classList.contains("flagged")==false){
    element.innerHTML = '<img class="buttonimg" src="./Images/flag.png" alt="flag">';
    element.classList.add("flagged");
    document.getElementById("bombsleft").innerText --;
    userflags.push(element.id);
  }
  else if(element.classList.contains("square-clicked")==false && element.classList.contains("flagged")) {
    element.innerHTML = '';
    element.classList.remove("flagged");
    document.getElementById("bombsleft").innerText ++;
    var remove = userflags.indexOf(element.id);
    userflags.splice(remove, 1);
  }
}

function checkWin(){
  if (rows*columns-mines == document.getElementsByClassName("square-clicked").length){
    return true;
  }
  else {
    return false;
  }
}

function disablebuttons(){
  for (i=0; i<rows; i++){
    for (j=0; j<columns; j++){
      document.getElementById(i+"-"+j).onclick=null;
      document.getElementById(i+"-"+j).oncontextmenu=null;
    }
  }
}