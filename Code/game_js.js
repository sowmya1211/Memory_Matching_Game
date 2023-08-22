// Initialize variables
let score = 0;
let level = 0;
var random_show, time, random_close; //Variables to repeat something
var timeLeft;
var game_start = false;
var prvs = 0; //To match pairs
let count = 0;

const image_map = { 
  '1' : "images/img1.jpg",
  '2' : "images/img2.jpg",
  '3' : "images/img3.jpg",
  '4' : "images/img4.jpg",
  '5' : "images/img5.jpg",
  '6' : "images/img6.jpg",
  '7' : "images/img7.jpg",
  '8' : "images/img8.jpg"
}
var image_grid = new Array();

function select_level(){
  level = document.getElementById('levelchoice').value;
  document.getElementById('levelchosen').innerHTML = "LEVEL: "+level;
  console.log(level+' level');
}
function clear_board(){
  for(let i=1;i<=16;i++){
      document.getElementById("img"+i).src="images/tile.jpg";
  }
}
//Helper functions to randomly show tiles while loading the page
function clear_tile(indx){
  document.getElementById("img"+indx).src="images/tile.jpg"; 
}
function toggle(){ 
  let i = Math.floor(Math.random() * 16); //0-15
  let j = Math.floor(Math.random()*8); //0-7
  document.getElementById("img"+(i+1)).src=image_map[j+1];
  random_close = setInterval(clear_tile,2000,i+1); //Calls clear_tile every 2s with param i+1  
}

//Display when page is loaded
function clear() {
  level=0; score=0; count=0; prvs=0;
  document.getElementById('levels').style.display="block";
  var sel = document.getElementsByClassName('gamedet');
  for(var i=0;i<sel.length;i++)
    sel[i].style="display:none";
  game_start = false;  
  clear_board();
  random_show = setInterval(toggle,2000); //1000ms - 1s Every 2s calls toggle
}
function restartt(){ clear();}

//Function to display all cards
function display(){
  for(let i=1;i<=16;i++){
      document.getElementById("img"+i).src=image_map[image_grid[i-1]];
  }
}

//Shuffle the cards before the game
function shuffle()
{
  var unique_indices = new Array();
  for(let i=1;i<=8;i++)
  {
    //Insert images as pairs
    for(let j=1;j<=2;j++)
    {
     var random_index; 
     do{
        random_index = Math.floor(Math.random()*16); //0 to n-1
       }while(unique_indices.includes(random_index));
     unique_indices.push(random_index);  
     image_grid[random_index] = i; //Store only the index
    }
  }
  for(let i=0;i<image_grid.length;i++)
     console.log(i,image_grid[i]);
}

//Function to execute when game is over
function gameover(content){
  clearInterval(time); //Buitltin function - stop timer started by setinterval
  game_start = false;
  document.getElementById("gameover").style="display:block";
  document.getElementById("gameover").innerHTML=content;
  var sel = document.getElementsByClassName('gamedet');
  for(var i=0;i<sel.length;i++)
    sel[i].style="display:none";
  document.getElementById('play_btn').style.display="none"; 
  document.getElementById('restart_btn').style="position:relative; top:-20px; left:50px;";  
}

//Function to display and check time left
function timer(){
  document.getElementById("timer").innerHTML=timeLeft+" seconds";
  timeLeft--;
  if(timeLeft < 0) //If time is over
  {
     gameover("You LOST!!!<br>TIME OVER<br>Level: "+level+"<br>Final Score is "+score);
     display();
  }
}

//Function that runs when player hits play
function start_game()
{
  if (level==0)
  {
    document.getElementById('levelchosen').innerHTML = "Warning! Choose a level";
    return;
  }   
  document.getElementById('levels').style.display="none";
  clearInterval(random_show); //Stop randomly showing cards
  clearInterval(random_close);
  shuffle();
  game_start=true;
  //Select Time based on level
  if (level == 1) timeLeft = 75; 
  else if (level == 2) timeLeft = 60;
  else timeLeft = 30;
  document.getElementById('level').innerHTML = level;
  //Display Timer and Score
  var sel = document.getElementsByClassName('gamedet');
  for(var i=0;i<sel.length;i++)
    sel[i].style="display:block";
  clear_board();
  time = setInterval(timer, 1000); //Start Timer - calls every 1s
}

//Function to reveal and match cards
function reveal_card(id)
{
  if(game_start == false)
      return;
  console.log(count);
 
  //Use count to reveal 2 cards at a time
  if(count==0) { //1st reveal
      if((document.getElementById(id).alt).localeCompare('revealed')==0) //If image is already revealed- do ntng
      {  
        console.log('Revealed');
        return;
      }  
      var imgno = id.substring(3); //imgn
      console.log(imgno);
      prvs = image_grid[parseInt(imgno)-1];
      document.getElementById(id).src=image_map[prvs];
      prvs_id = id;
      count = 1;
  }
  else { //2nd reveal
      var imgno = id.substring(3); //imgn
      console.log(imgno);
      var curr = image_grid[parseInt(imgno)-1];
      if(curr == prvs){
          document.getElementById(id).src=image_map[curr]; //reveal 2nd card only when they are equal
          update_score();
          document.getElementById(prvs_id).alt = 'revealed'; //Reveal cards
          document.getElementById(id).alt = 'revealed';
          prvs=0;
        }
        else
          document.getElementById(prvs_id).src="images/tile.jpg"; //close 1st reveal too
      count = 0; 
  }
}
//Function to update score
function update_score(){
  score++;
  document.getElementById("score").innerHTML=score;
  if(score>=8)
    gameover("You WON!!!<br>Level: "+level+"<br>Time Left: "+timeLeft+" s<br>Final Score is "+score);
}