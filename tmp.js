//****************************************
//  Ball Object  
//****************************************  
function Ball(speed, startPosX, startPosY)
{
    this.x = startPosX;
    this.y = startPosY;
    this.vy = 1*1;
    this.vx =  0.5*1;
    this.radius = 8;        
    this.speed = 1;


    
}

// Define the draw function for the ball class
Ball.prototype.draw = function(canvas)
{
    canvas.beginPath();
    canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    canvas.fillStyle = "rgb(130,130,130)";
    canvas.fill();
    canvas.strokeStyle = "white";
    canvas.stroke();
    canvas.closePath();         
}

Ball.prototype.checkWallHits = function()
{
    if (this.y+this.vy-this.radius<0) {
        this.vy = -this.vy;
    }

    if (this.x+this.vx-this.radius<0 || this.x+this.vx+this.radius>game.width) {
        this.vx = -this.vx;
    }
}   

Ball.prototype.checkClubHit = function()
{
    if (this.y+this.vy+this.radius >= game.theClub.y && this.y+this.radius<=game.theClub.y){
        if (this.x+this.vx+this.radius >= game.theClub.x && this.x+this.vx-this.radius <= game.theClub.x+game.theClub.width){
            this.vy = -this.vy;            
            return ;  
        }
    }

    if ( (this.x+this.vx+this.radius>=game.theClub.x && this.x+this.radius<=game.theClub.x) || 
        (this.x+this.vx-this.radius<=game.theClub.x+game.theClub.width && this.x-this.radius>=game.theClub.x+game.theClub.width)){
        if ( (this.y+this.vy-this.radius<=game.theClub.y+game.theClub.height) && (this.y+this.y+this.radius>=game.theClub.y)){
            this.vx = -this.vx;
            return;
        }
    }

}     


Ball.prototype.update = function()
{

    // Check if the end of the screen is reached - eg. ball missed the club
    if(this.y >= Game.height)
    {           
        this.vy = 0;
        this.vx = 0;            
    }

    // Check if the ball hits an edge wall
    this.checkWallHits();       

    // Check if the ball hits the club
    this.checkClubHit();                

    // Update the ball position 
    this.x += this.vx * this.speed;
    this.y += this.vy * this.speed;
}
