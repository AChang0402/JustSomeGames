var gamestate = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
]

var playerturn = 1;
getstartplayer();

function getstartplayer() {
    playerturn=(Math.floor(Math.random()*2))+1
    document.querySelector("#announcement").innerText = "Player "+playerturn+" Starts";
}

function choose(element) {
    document.querySelector("#announcement").innerText = "";
    var x = +element.nextElementSibling.firstElementChild.id.charAt(0);
    var y = +element.nextElementSibling.firstElementChild.id.charAt(1);
    if (gamestate[x][y] == 0){
        if (playerturn===1){
            element.nextElementSibling.firstElementChild.innerText = "X"
            element.nextElementSibling.firstElementChild.classList.add("red")
            gamestate[x][y]=1;
            if(checkwin()){
                setTimeout(disableonclick,50);
                document.querySelector("#announcement").innerText = "Player "+playerturn+" Wins!";
                document.getElementById("p1score").innerText++
            }
            else if(checktie()){
                
                setTimeout(disableonclick,50);
                document.querySelector("#announcement").innerText = "Tie!";
            }
            playerturn = 2;
        }
        else if (playerturn===2){
            element.nextElementSibling.firstElementChild.innerText = "O"
            element.nextElementSibling.firstElementChild.classList.add("blue")
            gamestate[x][y]=2;
            if(checkwin()){
                setTimeout(disableonclick,50);
                document.querySelector("#announcement").innerText = "Player "+playerturn+" Wins!";
                document.getElementById("p2score").innerText++
            }
            else if(checktie()){
                setTimeout(disableonclick,50);
                document.querySelector("#announcement").innerText = "Tie!";
            }
            playerturn = 1;
        }
    }
}

function checkwin(){
    var end = false
    for (var i=1;i<=2;i++){ //for each player
        for (var a = 0; a<=2; a++){ //checks rows
            if (gamestate[a][0]==i && gamestate[a][1]==i && gamestate[a][2]==i){
                end = true
                return end;
            }
        }
        for (var b=0; b<=2; b++){ //checks columns
            if (gamestate[0][b]==i && gamestate[1][b]==i && gamestate[2][b]==i){
                end = true
                return end;
            }
        }
        if ((gamestate[0][0]==i && gamestate[1][1]==i && gamestate[2][2]==i)||(gamestate[0][2]==i && gamestate[1][1]==i && gamestate[2][0]==i)){ //checks diagonals
            end = true
            return end;
        }
    }
    
    return end;
}

function checktie(){
    for (var i=0; i<=2; i++){
        for (var j=0; j<=2;j++){
            if (gamestate[i][j]==0){
                return false;
            }
        }
    }
    return true;
}

function disableonclick(){
    var boxes = document.querySelectorAll(".smallbox")
    for (i=0; i<boxes.length; i++){
        (boxes[i].onclick = null)
    }
    var flipcards = document.querySelectorAll(".flip-card-inner")
    for (j=0; j<flipcards.length; j++){
        (flipcards[j].onclick = null)
    }
}

function enableonclick(){
    var boxes = document.querySelectorAll(".smallbox")
    for (i=0; i<boxes.length; i++){
        boxes[i].setAttribute("onclick", "choose(this)");
    }
    var flipcards = document.querySelectorAll(".flip-card-inner")
    for (j=0; j<flipcards.length; j++){
        flipcards[j].setAttribute("onclick", "flip(this)");
    }
}

function reset(){
    flipback();
    setTimeout(resetgame,250);
}
function resetgame(){    
    gamestate = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ]

    var XOs = document.querySelectorAll(".XO")
    for (i=0; i<XOs.length; i++){
        XOs[i].innerText = null;
        XOs[i].classList.remove("blue","red");
    }

    document.querySelector("#announcement").innerText = "";
    getstartplayer();
    enableonclick();
}

function flip(element){
    element.classList.add("flip")
}

function flipback(){
    var flipped = document.querySelectorAll(".flip");
    for (var i=0;i<flipped.length;i++){
        flipped[i].classList.remove("flip")
    }
}