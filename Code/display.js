const Display = function(canvas) {
  this.loginButtons = [
    { lineWidth : 2, colour: '#000000', width: 5, height: 5, text : "X", top: 0, left: 0 },
    { lineWidth : 2, colour: '#000000', width: 30, height: 7, text : "Войти", top : 80, left : 60 },
  ],
  this.signupButtons = [
    { lineWidth : 2, colour: '#000000', width: 5, height: 5, text : "X", top: 0, left: 0 },
    { lineWidth : 2, colour: '#000000', width: 30, height: 7, text : "Войти", top : 80, left : 60 },
  ],
  this.rectangles = [
    { lineWidth : 2, colour: '#000000', width: 30, height: 7, text : "Log In" },
    { lineWidth : 2, colour: '#000000', width: 30, height: 7, text : "Sign Up" },
  ],
  this.menuItems = [
    { lineWidth : 2, colour: '#000000', width: 42, height: 7, text : "Log Out" },
    { lineWidth : 2, colour: '#000000', width: 42, height: 7, text : "Help" },
    { lineWidth : 2, colour: '#000000', width: 42, height: 7, text : "Leaderboard", },
    { lineWidth : 2, colour: '#000000', width: 42, height: 7, text : "Main Menu", }
  ],
  this.helpItems = [
    { lineWidth : 2, colour: '#000000', width: 42, height: 7, text : "standinalone96@mgail.com" },
    { lineWidth : 2, colour: '#000000', width: 42, height: 7, text : "Restart level - R" },
    { lineWidth : 2, colour: '#000000', width: 42, height: 7, text : "Move - Arrow Keys" },
    { lineWidth : 2, colour: '#000000', width: 42, height: 7, text : "Menu - Esc", },
  ],

  this.levels = [],
  this.DOM = [],
  this.completed_levels = 0
  this.loadLevel_function = undefined

  this.initialize = function(){
    let input1 = document.createElement('input')
    input1.type = 'text'
    input1.style.position = "fixed"
    input1.style.top = "100px"
    input1.style.border = "none"
    input1.style.borderBottom = "2px solid white"
    input1.style.backgroundColor = "transparent"
    input1.style.baseTop = "300px"
    input1.style.baseLeft = "40px"
    input1.style.baseWidth = "200px"
    input1.style.baseHeight = "20px"
    input1.style.display = "none"
    input1.id = "login"
    this.DOM.push(input1)
    
    let input2 = document.createElement('input')
    input2.type = 'password'
    input2.style.position = "fixed"
    input2.style.top = "120px"
    input2.style.border = "none"
    input2.style.borderBottom = "2px solid white"
    input2.style.backgroundColor = "transparent"
    input2.style.baseTop = "330px"
    input2.style.baseLeft = "40px"
    input2.style.baseWidth = "200px"
    input2.style.baseHeight = "20px"
    input2.style.display = "none"
    input2.id = "password1"
    this.DOM.push(input2)
    
    let input3 = document.createElement('input')
    input3.type = 'password'
    input3.style.position = "fixed"
    input3.style.top = "140px"
    input3.style.border = "none"
    input3.style.borderBottom = "2px solid white"
    input3.style.backgroundColor = "transparent"
    input3.style.baseTop = "360px"
    input3.style.baseLeft = "40px"
    input3.style.baseWidth = "200px"
    input3.style.baseHeight = "20px"
    input3.style.display = "none"
    input3.id = "password2"
    this.DOM.push(input3)
    
    let p1 = document.createElement('p')
    p1.innerHTML = "test"
    p1.style.baseWidth = "10px"
    p1.style.baseTop = "10px"
    p1.style.baseLeft = "10px"
    p1.style.fontSize = "30px"
    p1.style.baseFontSize = "30px"
    p1.style.display = "none"
    this.DOM.push(p1)
    
    let p2 = document.createElement('p')
    p2.style.fontSize = "30px"
    p2.style.textAlign = "center"
    p2.style.baseWidth = "10px"
    p2.style.baseTop = "10px"
    p2.style.baseLeft = "350px"
    p2.style.baseFontSize = "40px"
    p2.classList.add("stopwatch")
    p2.style.position = "fixed"
    p2.style.fontFamily = "pixel"
    p2.style.color = "#FFFFFF"
    p2.style.display = "none"
    this.DOM.push(p2)

    let table = document.createElement('table')
    table.style.border = "1px solid black"
    table.style.baseTop = "10px"
    table.style.baseLeft = "10px"
    table.style.baseFontSize = "20px"
    table.style.display = "none"
    table.style.position = "fixed"
    this.DOM.push(table)


    this.DOM.forEach(element => {
      document.body.appendChild(element)
    })
      
  }
  
  this.initialize()
  // this.stopwatch = new Game.Stopwatch(this.DOM[4]);

  this.buffer  = document.createElement("canvas").getContext("2d"),
  this.context = canvas.getContext("2d");

  this.activeMenu = "firstMenu"
  this.ratio = 1 // Context size over buffer size
  this.tint = 5

  this.updateDOMPositioning = function(){
    this.DOM.forEach(element => {
      if (element.style.hasOwnProperty('baseHeight')){
        element.style.width = Number(element.style.baseWidth.slice(0, -2)) * this.ratio + "px"
        element.style.height = Number(element.style.baseHeight.slice(0, -2)) * this.ratio + "px"
        element.style.left = Number(element.style.baseLeft.slice(0, -2)) * this.ratio + this.context.canvas.offsetLeft + "px"
        element.style.top = Number(element.style.baseTop.slice(0, -2)) * this.ratio + this.context.canvas.offsetTop + "px"
      }
      
      if (element.style.hasOwnProperty('baseFontSize')){
        element.style.top = Number(element.style.baseTop.slice(0, -2)) * this.ratio + this.context.canvas.offsetTop + "px"
        element.style.left = Number(element.style.baseLeft.slice(0, -2)) * this.ratio + this.context.canvas.offsetLeft + "px"
        element.style.fontSize = Math.round(Number(element.style.baseFontSize.slice(0, -2)) * this.ratio) + "px"
      }
    });
  }

  // Different windows 

  this.drawLeadersBoard = function(leaders){
    // console.log(leaders)


    this.buffer.fillStyle = "#A3E7DA";
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    let table = this.DOM[5]
    table.innerHTML = "" 
    table.style.display = "block"

    let th = table.insertRow()
    let td = th.insertCell()
    td.style.border = "1px solid black"
    td.innerHTML = "Name"
    td = th.insertCell()
    td.style.border = "1px solid black"
    td.innerHTML = "Minutes"
    td = th.insertCell()
    td.style.border = "1px solid black"
    td.innerHTML = "Seconds"
    td = th.insertCell()
    td.style.border = "1px solid black"
    td.innerHTML = "Miliseconds"

    for (let i = 0; i < leaders.length; i++){
      let tr = table.insertRow()
      for (let j = 0; j < 4; j++){
        let td = tr.insertCell()
        td.style.border = "1px solid black"
      }
      tr.cells[0].innerHTML = leaders[i].user.login
      tr.cells[1].innerHTML = leaders[i].minutes
      tr.cells[2].innerHTML = leaders[i].seconds
      tr.cells[3].innerHTML = Math.round(leaders[i].ms)
    }


  }
  this.showMenu = function(){
    this.stopwatch.stop()
    this.buffer.fillStyle = "#A3E7DA";
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

    let gap = 0.05 * this.buffer.canvas.height // gap between options
    let height = this.buffer.canvas.height * this.rectangles[0].height / 100
    let option_area_y = this.menuItems.length * height + (this.menuItems.length - 1) * gap
    
    // this.buffer.beginPath()
    // this.buffer.rect(10, this.buffer.canvas.height / 2 - option_area_y / 2, 80, option_area_y)
    // this.buffer.stroke()
    for (let i = 0; i < this.menuItems.length; i++){
      let rectangle = this.menuItems[i]

      let rec_width = this.buffer.canvas.width * rectangle.width / 100
      let rec_height = this.buffer.canvas.height * rectangle.height / 100
      let offset_x = this.buffer.canvas.width / 2 - rec_width / 2
      let offset_y = this.buffer.canvas.height / 2 - option_area_y / 2 + i * rec_height + gap * i

      this.buffer.lineWidth = rectangle.lineWidth
      this.buffer.strokeStyle = rectangle.colour
      this.buffer.beginPath()
      this.buffer.rect(offset_x, offset_y, rec_width, rec_height)
      this.buffer.stroke()
      
      rectangle.rec_left = offset_x * this.ratio
      rectangle.rec_top = offset_y * this.ratio
      rectangle.rec_width = rec_width * this.ratio
      rectangle.rec_height = rec_height * this.ratio

      if (rectangle.text){
        let text_width = rectangle.text.length * 13
        this.buffer.font = "40px pixel";
        this.buffer.fillStyle = "rgb(183,124,34,1)";
        this.buffer.fillText(rectangle.text, offset_x + rec_width / 2 - text_width / 2, offset_y + rec_height / 2 + 3)
      }
    }

  }
  this.drawLoginPage = function(){
    this.buffer.fillStyle = "#E2CB26";
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    this.DOM[0].style.display = "block"
    this.DOM[1].style.display = "block"

    let text_width = "Login".length * 10
    this.buffer.font = "40px pixel";
    this.buffer.fillStyle = "rgb(183,124,34,1)";

    let offset_x = this.buffer.canvas.width / 2 + 50
    let offset_y = this.buffer.canvas.height / 2 + 50

    this.buffer.fillText("Login", offset_x, offset_y)
    this.buffer.fillText("Password", offset_x, offset_y + 40)

    for (let i = 0; i < this.loginButtons.length; i++){
      let button = this.loginButtons[i]

      let rec_width = this.buffer.canvas.width * button.width / 100
      let rec_height = this.buffer.canvas.height * button.height / 100
      let offset_x = this.buffer.canvas.width * button.left / 100
      let offset_y = this.buffer.canvas.height * button.top / 100

      this.buffer.lineWidth = button.lineWidth
      this.buffer.strokeStyle = button.colour
      this.buffer.beginPath()
      this.buffer.rect(offset_x, offset_y, rec_width, rec_height)
      this.buffer.stroke()
      
      button.rec_left = offset_x * this.ratio
      button.rec_top = offset_y * this.ratio
      button.rec_width = rec_width * this.ratio
      button.rec_height = rec_height * this.ratio

      if (button.text){
        let text_width = button.text.length * 13
        let text_height = 5 * this.ratio 
        this.buffer.font = "40px pixel";
        this.buffer.fillStyle = "rgb(183,124,34,1)";
        this.buffer.fillText(button.text, offset_x + rec_width / 2 - text_width / 2, offset_y + rec_height / 2 - text_height / 2 + 5)
      }
    }

  }
  this.closeLoginPage = function(){
    this.DOM[0].style.display = "none"
    this.DOM[1].style.display = "none"
  }
  this.closeSignupPage = function(){
    this.DOM[0].style.display = "none"
    this.DOM[1].style.display = "none"
    this.DOM[2].style.display = "none"
  }
  this.drawSignupPage = function (){
    this.buffer.fillStyle = "#E2CB26";
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    this.DOM[0].style.display = "block"
    this.DOM[1].style.display = "block"

    let text_width = "Login".length * 10
    this.buffer.font = "40px pixel";
    this.buffer.fillStyle = "rgb(183,124,34,1)";

    let offset_x = this.buffer.canvas.width / 2 + 50
    let offset_y = this.buffer.canvas.height / 2 + 50

    this.buffer.fillText("Login", offset_x, offset_y)
    this.buffer.fillText("Password", offset_x, offset_y + 40)

    for (let i = 0; i < this.signupButtons.length; i++){
      let button = this.signupButtons[i]

      let rec_width = this.buffer.canvas.width * button.width / 100
      let rec_height = this.buffer.canvas.height * button.height / 100
      let offset_x = this.buffer.canvas.width * button.left / 100
      let offset_y = this.buffer.canvas.height * button.top / 100

      this.buffer.lineWidth = button.lineWidth
      this.buffer.strokeStyle = button.colour
      this.buffer.beginPath()
      this.buffer.rect(offset_x, offset_y, rec_width, rec_height)
      this.buffer.stroke()
      
      button.rec_left = offset_x * this.ratio
      button.rec_top = offset_y * this.ratio
      button.rec_width = rec_width * this.ratio
      button.rec_height = rec_height * this.ratio

      if (button.text){
        let text_width = button.text.length * 10
        let text_height = 5 * this.ratio 
        this.buffer.font = "40px pixel";
        this.buffer.fillStyle = "rgb(183,124,34,1)";
        this.buffer.fillText(button.text, offset_x + rec_width / 2 - text_width / 2, offset_y + rec_height / 2 - text_height / 2 + 5)
      }
    }
  }
  this.drawLevelsMenu = async function(levels){
    let response = await levels
    let levels_completed = response.completed_levels
    // console.log(levels_completed)
    //this.levels_completed = levels_completed
    //console.log(this.levels_completed)


    this.buffer.fillStyle = "#A3E7DA";
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

    this.buffer.font = "40px pixel";
    let width = 10 // percantage of level option width
    let gap = 30 // percatnage of gap
    let x_area = this.levels.length * (this.buffer.canvas.width * width / 100) + (this.levels.length - 1) * (this.buffer.canvas.width * gap / 100)
    let offset_y = this.buffer.canvas.width * 20 / 100
    let size = this.buffer.canvas.width * width / 100
    for (let i = 0; i < this.levels.length; i++){
      let offset_x = this.buffer.canvas.width / 2 - x_area / 2 + i * this.buffer.canvas.width * gap / 100 + i * size
      
      i - 1 < levels_completed ? this.buffer.fillStyle = "#BFBDAF" : this.buffer.fillStyle = "#F1E2DF"
      if ((i - 1) >= levels_completed){
        this.levels[i].callback = () => {alert('Нет так быстро')}
      }
      else
        this.levels[i].callback = () => {this.loadLevel_function(i)}
      
      
        

      this.buffer.fillRect(offset_x, offset_y, size, size)
      this.buffer.fillStyle = "#000000";
      this.buffer.fillText((i+1), offset_x + size / 2, offset_y + size / 2)
      this.levels[i].rec_top = offset_y * this.ratio
      this.levels[i].rec_left = offset_x * this.ratio
      this.levels[i].rec_width = size * this.ratio
      this.levels[i].rec_height = size * this.ratio
    }
  }
  this.drawOptions = function(){
    
    this.buffer.fillStyle = "#A3E7DA";
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

    let gap = 0.05 * this.buffer.canvas.height // gap between options
    let height = this.buffer.canvas.height * this.rectangles[0].height / 100
    let option_area_y = this.rectangles.length * height + (this.rectangles.length - 1) * gap

    for (let i = 0; i < this.rectangles.length; i++){
      let rectangle = this.rectangles[i]

      let rec_width = this.buffer.canvas.width * rectangle.width / 100
      let rec_height = this.buffer.canvas.height * rectangle.height / 100
      let offset_x = this.buffer.canvas.width / 2 - rec_width / 2
      let offset_y = this.buffer.canvas.height / 2 - option_area_y / 2 + i * rec_height + gap * i

      this.buffer.lineWidth = rectangle.lineWidth
      this.buffer.strokeStyle = rectangle.colour
      this.buffer.beginPath()
      this.buffer.rect(offset_x, offset_y, rec_width, rec_height)
      this.buffer.stroke()
      
      rectangle.rec_left = offset_x * this.ratio
      rectangle.rec_top = offset_y * this.ratio
      rectangle.rec_width = rec_width * this.ratio
      rectangle.rec_height = rec_height * this.ratio

      if (rectangle.text){
        let text_width = rectangle.text.length * 10
        this.buffer.font = "40px pixel";
        this.buffer.fillStyle = "rgb(183,124,34,1)";
        this.buffer.fillText(rectangle.text, offset_x + rec_width / 2 - text_width / 2, offset_y + rec_height / 2 + 3 )
      }
    }
  }
  this.drawHelpMenu = function(){
    
    this.buffer.fillStyle = "#A3E7DA";
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

    let gap = 0.05 * this.buffer.canvas.height // gap between options
    let height = this.buffer.canvas.height * this.rectangles[0].height / 100
    let option_area_y = this.helpItems.length * height + (this.helpItems.length - 1) * gap

    for (let i = 0; i < this.helpItems.length; i++){
      let rectangle = this.helpItems[i]

      let rec_width = this.buffer.canvas.width * rectangle.width / 100
      let rec_height = this.buffer.canvas.height * rectangle.height / 100
      let offset_x = this.buffer.canvas.width / 2 - rec_width / 2
      let offset_y = this.buffer.canvas.height / 2 - option_area_y / 2 + i * rec_height + gap * i

      // this.buffer.lineWidth = rectangle.lineWidth
      // this.buffer.strokeStyle = rectangle.colour
      // this.buffer.beginPath()
      // this.buffer.rect(offset_x, offset_y, rec_width, rec_height)
      // this.buffer.stroke()
      
      rectangle.rec_left = offset_x * this.ratio
      rectangle.rec_top = offset_y * this.ratio
      rectangle.rec_width = rec_width * this.ratio
      rectangle.rec_height = rec_height * this.ratio

      if (rectangle.text){
        let text_width = rectangle.text.length * 10
        this.buffer.font = "40px pixel";
        this.buffer.fillStyle = "rgb(183,124,34,1)";
        this.buffer.fillText(rectangle.text, offset_x + rec_width / 2 - text_width / 2, offset_y + rec_height / 2 + 3 )
      }
    }
  }

  // Repeating functions

  this.drawMap = function(image, image_columns, layers, map_columns, map_rendered_columns, tile_size, offset, front, ...items) {
    let discovered = items[1]
    this.buffer.font = "35px pixel";
    this.buffer.fillStyle = "rgb(183,124,34,1)";

    this.buffer.fillText("Menu - esc, R - Restart", this.buffer.canvas.width - 280, this.buffer.canvas.height - 30)
    for (let i = 0; i < layers.length; i ++){
      let layer = layers[i]
      let map = layer.graphical_map
      let inFront = layer.inFront
      let discoverable = layer.discoverable
      if ((front && inFront) || (!inFront && !front)){
        // for (let index = map.length - 1; index > -1; -- index) {
        for (let index = 0; index < map.length; index++) {

          let value = map[index] - 1 ;
          let source_x =           (value % image_columns) * tile_size;
          let source_y = Math.floor(value / image_columns) * tile_size;
          let destination_x =           (index % map_columns) * tile_size;
          let destination_y = Math.floor(index / map_columns) * tile_size;

          destination_x = offset < 0 ? destination_x : offset > map_columns * tile_size - map_rendered_columns*tile_size ? destination_x - map_columns * tile_size+map_rendered_columns * tile_size : destination_x - offset
          // console.log('index ' + map.length - index)
          if (destination_x < map_rendered_columns * tile_size && destination_x > -tile_size)
            if (discoverable == undefined || (discoverable && discovered[index]==true))  
              this.buffer.drawImage(image, source_x, source_y, tile_size, tile_size, destination_x, destination_y, tile_size, tile_size);
    

          // this.buffer.beginPath()
          // this.buffer.lineWidth = "1";
          // this.buffer.strokeStyle = "gray";
          // this.buffer.rect(destination_x,destination_y,tile_size, tile_size)
          // this.buffer.stroke()

          // this.buffer.font = "20px Arial"
          // this.buffer.fillStyle = "rgb(183,124,34,0.5 )";
          // let digit = items[0][index].toString()
          // if (destination_x < map_rendered_columns * tile_size && destination_x > -tile_size && digit === "15")
          //   this.buffer.fillText(digit, destination_x, destination_y)

          
          // this.buffer.font = "10px Arial"
          // this.buffer.fillStyle = "rgb(255,255,255,1 )";
          // let digit1 = (destination_x / tile_size + 1)  
          // let digit2 = (destination_y / tile_size) 
          // if (destination_x < map_rendered_columns * tile_size && destination_x > -tile_size)
          //   this.buffer.fillText(digit1 + "/ " + digit2, destination_x, destination_y)
        }
      }

    }
    

  }
  this.drawObject = function(images, source_x, source_y, destination_x, destination_y, width, height, image_index = 1, offset, dist) {

    let koef = offset < 0 ? 0 : offset > dist ? dist : offset
    // console.log(image_index)
    // if (image_index == 9)
      // console.log(source_x)
    this.buffer.drawImage(images[image_index], source_x, source_y, width, height, Math.round(destination_x) - koef, Math.round(destination_y), width, height);

  }
  this.drawMessage = function (text, width, height){
    let table_x = 500
    let table_y = 300
    let border = 10

    let p = this.DOM[3]
    let par_width = (this.buffer.canvas.width * 80 / 100) * this.ratio
    p.style.width =  par_width + "px"
    p.style.left = (this.buffer.canvas.width / 2 - par_width / this.ratio / 2) * this.ratio + this.context.canvas.offsetLeft + "px"
    p.style.display = "block"
    p.style.fontFamily = "pixel"
    p.style.color = "#FFFFFF"
    p.style.top = (this.buffer.canvas.height / 2 - table_y / 2 + 10) * this.ratio + "px"
    p.innerHTML = text
    p.style.position = "fixed"
    
    this.buffer.fillStyle = "rgb(183,124,34,0.8)";
    this.buffer.fillRect(width/2 - table_x/2,height/2 - table_y/2,table_x,table_y)
    this.buffer.fillStyle = "rgb(183,124,34,0.5 )";
    this.buffer.fillRect(width/2 - table_x/2 - border,height/2 - table_y/2 - border,table_x + border*2,table_y + border*2)
    
  }
  this.showGameOver = function (){
    let image_data = this.buffer.getImageData(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    let data = image_data.data;

    for (let index = data.length - 4; index > -1; index -= 4) {

      data[index] += this.tint;
      data[index+1] += this.tint;
      data[index+2] += this.tint;

    }

    this.buffer.putImageData(image_data, 0, 0);

    this.buffer.font = "70px pixel";
    this.buffer.fillStyle = "rgb(183,124,34,1)";
    this.buffer.fillText("Ты победил", this.buffer.canvas.width/2-120, this.buffer.canvas.height/2)
  }
  this.drawBorders = function(destination_x, destination_y){
    this.buffer.beginPath()
    this.buffer.lineWidth = "2";
    this.buffer.strokeStyle = "red";
    this.buffer.rect(destination_x,destination_y,32,32)
    this.buffer.stroke()
  }
  this.drawDoors = function(doors){
    for (let i = 0; i < doors.length; i++){
      this.buffer.beginPath()
      this.buffer.lineWidth = "2";
      this.buffer.strokeStyle = "blue";
      this.buffer.rect(doors[i].x,doors[i].y,doors[i].width, doors[i].height)
      this.buffer.stroke()
    }
  }
  this.fill = function(color) {

    this.buffer.fillStyle = color;
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

  };
  this.resize = function(width, height, height_width_ratio) {

      if (height / width > height_width_ratio) {

          this.context.canvas.height = width * height_width_ratio;
          this.context.canvas.width = width;
    
        } else {
    
          this.context.canvas.height = height;
          this.context.canvas.width = height / height_width_ratio;
    
        }
    
        this.ratio = this.context.canvas.width / this.buffer.canvas.width 
        this.context.imageSmoothingEnabled = false;
        this.updateDOMPositioning()

  };
  
  this.drawOptions()
}

  
Display.prototype = {

  constructor : Display,

  //render:function() { this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height); },
  render:function() { this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height); },

};