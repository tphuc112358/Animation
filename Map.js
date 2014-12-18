//****************************************
//  Maps
//****************************************  
//Initialize the map
function Map(width, height,blockWidth,blockHeight) {
    this.width = width; 
    this.height = height;
    this.blockWidth = blockWidth;
    this.blockHeight = blockHeight;
    //the array of the map. 0 means no obstacle. 1-4 means different color. Multiple maps
    this.maparray = [  
    [   //map1
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [   //map2
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 2, 1, 0, 0, 0],
    [0, 0, 1, 2, 3, 3, 2, 1, 0, 0],
    [0, 1, 2, 3, 0, 0, 3, 2, 1, 0],
    [1, 2, 3, 0, 0, 0, 0, 3, 2, 1],
    [2, 3, 0, 0, 0, 0, 0, 0, 3, 2],
    [3, 0, 0, 0, 3, 3, 0, 0, 0, 3],
    [0, 0, 0, 4, 0, 0, 4, 0, 0, 0],
    [0, 0, 4, 0, 4, 4, 0, 4, 0, 0],
    [0, 4, 0, 0, 0, 0, 0, 0, 4, 0],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
    ];   
    //take the second map as example

    this.map = this.maparray[1];
    //initialize the array of brick
    this.brick = [];
    for (var i=0;i<30;i++) {
        for (var j=0;j<30;j++) {
            this.brick[i]=[];
            this.brick[i][j]=0;
        }
    }
}

//Drawing the map
Map.prototype.draw = function(canvas) {
    //checking the map data
    for (var i = 0; i < this.map.length; i++) { 
        for (var j=0; j < this.map[i].length;j++){
            if (this.map[i][j] > 0) {//when the tile has obstacle
                //take the pixel
                var blockX = j * this.blockWidth;
                var blockY = i * this.blockHeight;               

                //draw the brick
                this.brick[i][j] = new Brick(blockX, blockY, this.blockWidth, this.blockHeight, this.map[i][j] );
                this.brick[i][j].draw(canvas);
            } else  if ( this.map[i][j] < 0) { //when the brick disappear

                var blockX = j * this.blockWidth;
                var blockY = i * this.blockHeight;              
                //fading the brick
                this.brick[i][j].fade(canvas,i,j);             
                //delete the brick
                if (this.brick[i][j].flag <= 0) {
                    this.map[i][j]=0;
                }
            } 
        }
    }
    

}

Map.prototype.update = function() {
    //checking the result
    var result = 1;

    //update the map for collision
    for (var i = 0; i < this.map.length; i++) { 
        for (var j=0; j < this.map[i].length;j++){
            if ( this.map[i][j] !== 0) {
                this.brick[i][j].update(i,j);                
                result = 0;//there are still obstacle left
            }
        }
    }
    if (result == 1 ) game.result = 1;//if no obstacle player wins
};


//Initialize object brick
function Brick(x,y,width, height,color, flag) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    //change color base on the map data
    switch  (color)  {
        case 1:
        this.color = "rgba(214,255,255,";
        break;
        case 2:
        this.color = "rgba(111,222,15,";
        break;
        case 3:
        this.color = "rgba(32,222,15,";
        break;
        case 4:
        this.color = "rgba(231,22,15,";
        break;
    }
    //flag for brick destruction
    this.flag = flag;
}

Brick.prototype.draw = function(canvas) { //draw brick
    //make the opacity of brick 1
    canvas.fillStyle = this.color+"1)";
    canvas.lineWidth = 0.75;
    canvas.strokeStyle = "#000005";
    canvas.beginPath();
    canvas.rect(this.x, this.y, this.width, this.height);
    canvas.closePath();     
    canvas.fill();
    canvas.stroke();   
};

Brick.prototype.fade = function(canvas,i,j) {
    //decrease opacity of brick over time
    canvas.fillStyle = this.color+this.flag+")";
    this.flag -=0.05;
    canvas.lineWidth = 0.75;
    canvas.strokeStyle = "#000005";
    canvas.beginPath();
    canvas.rect(this.x, this.y, this.width, this.height);
    canvas.closePath();     
    canvas.fill();
    canvas.stroke();   
};

Brick.prototype.update = function(i,j) {
    //checking the ball touch the left or right
    if ( ( (game.theBall.x+game.theBall.vx+game.theBall.radius>=this.x) && (game.theBall.x+game.theBall.radius<=this.x))
        || ( (game.theBall.x+game.theBall.vx-game.theBall.radius<=this.x+this.width) && (game.theBall.x-game.theBall.radius>=this.x+this.width) ) ){
        if ( (game.theBall.y+game.theBall.vy-game.theBall.radius<= this.y+this.height)&&(game.theBall.y+game.theBall.vy+game.theBall.radius>=this.y) ){
            //change the ball velocity
            game.theBall.vx = -game.theBall.vx;
            //marking the obstacle on the map
            game.theMap.map[i][j]=-1;  
            this.flag=1;
        }        
    }
    
    //checking the ball touch up or down
    if ( ( (game.theBall.y+game.theBall.vy-game.theBall.radius<=this.y+this.height) && (game.theBall.y-game.theBall.radius>=this.y+this.height) )
        || ( (game.theBall.y+game.theBall.vy+game.theBall.radius>=this.y) && (game.theBall.y+game.theBall.radius<= this.y) ) ) {
        if (game.theBall.x+game.theBall.vx+game.theBall.radius>=this.x && game.theBall.x+game.theBall.vx-game.theBall.radius<=this.x+this.width) {

            game.theBall.vy = -game.theBall.vy;
            game.theMap.map[i][j]=-1;  
            this.flag=1;
        }
    }
};

