const Game = function() {
    
    this.world = new Game.World();
    this.levels = new Array()
    this.current_level = undefined

    this.update = function() {

      this.world.update();

    };
    
};
  
Game.prototype = {

  constructor : Game,

};
Game.Stopwatch = function(display, results){
  this.running = false;
  this.display = display;
  this.results = results;
  this.laps = [];
  this.reset();
  this.print(this.times);
}
Game.Stopwatch.prototype = {
  constructor : Game.Stopwatch,
  reset : function(){
      this.times = [ 0, 0, 0 ];
  },
  
  start : function() {
      if (!this.time) this.time = performance.now();
      if (!this.running) {
          this.running = true;
          requestAnimationFrame(this.step.bind(this));
      }
  },
  
  stop : function(){
      this.running = false;
      this.time = null;
  },

  restart : function() {
      if (!this.time) this.time = performance.now();
      if (!this.running) {
          this.running = true;
          requestAnimationFrame(this.step.bind(this));
      }
      this.reset();
  },
  
  step : function(timestamp) {
      if (!this.running) return;
      this.calculate(timestamp);
      this.time = timestamp;
      this.print();
      requestAnimationFrame(this.step.bind(this));
  },
  
  calculate : function(timestamp) {
      var diff = timestamp - this.time;
      // Hundredths of a second are 100 ms
      this.times[2] += diff / 10;
      // Seconds are 100 hundredths of a second
      if (this.times[2] >= 100) {
          this.times[1] += 1;
          this.times[2] -= 100;
      }
      // Minutes are 60 seconds
      if (this.times[1] >= 60) {
          this.times[0] += 1;
          this.times[1] -= 60;
      }
  },
  
  print : function() {
      this.display.innerText = this.format(this.times);
  },
  
  format : function(times) {
      // return `\
      //   ${this.pad0(times[0], 2)}:\
      //   ${this.pad0(times[1], 2)}:\
      //   ${this.pad0(Math.floor(times[2]), 2)}`;
      return `\
        ${this.pad0(times[0], 2)}:\
        ${this.pad0(times[1], 2)}`
  },

  pad0 : function(value, count) {
    var result = value.toString();
    for (; result.length < count; --count)
        result = '0' + result;
    return result;
  }
}

Game.Level = function(prefix, suffix, urls_arr){
  this.default_room = '00' // index of default room
  this.prefix = prefix
  this.suffix = suffix
  this.urls_arr = urls_arr
  this.zones_arr = {}
}
Game.Level.prototype = {
  constructor : Game.Level
}
Game.World = function(friction = 0.8, gravity = 2) {
  this.collider = new Game.World.Collider()
  this.tile_set = new Game.World.TileSet(8, 32)

  this.friction = friction;
  this.gravity  = gravity;

  // this.player   = new Game.Player(420,50);
  this.player   = new Game.Player(420,50, "rabbit");
  
  //Default values

  this.columns   = 16;
  this.rows      = 16;

  this.rendered_columns = 16
  this.rendered_rows = 16


  this.rendered_height   = this.tile_set.tile_size * this.rendered_rows;
  this.rendered_width    = this.tile_set.tile_size * this.rendered_columns;
  this.height   = this.tile_set.tile_size * this.rows;
  this.width    = this.tile_set.tile_size * this.columns;

  this.center = this.rendered_width / 2

  if (this.player.x > this.center) this.player.x = this.center

  this.player.offset = this.player.getCenterX()-this.center
  this.offset = this.player.getCenterX()-this.center
  this.dist = this.columns * this.tile_set.tile_size - this.center * 2

  // this.zone_id = "02"
  this.doors = []
  this.door = undefined

  this.question_marks = []
  this.lava = []
  this.notes = []

  

};
Game.World.prototype = {

  constructor: Game.World,
  scroll : function(){
    if (this.player.getCenterX() < this.center){
      this.player.offset = this.player.getCenterX() - this.center
    }
    else{
      
      if (this.player.offset > this.dist){
        this.player.offset =  this.player.getCenterX() - this.center
      }
      else
        //if (!this.player.collidePlatformLeft() && !this.player.collidePlatformRight())
          this.player.offset += this.player.getCenterX() - this.player.getOldCenterX()
        //console.log(this.player.getCenterX() - this.player.getOldCenterX())
    }
    this.offset = this.player.offset
    //this.coef = this.player.offset < 0 ? 0 : this.player.offset > this.dist ? this.dist : this.player.offset
    this.player.coef = this.player.offset < 0 ? 0 : this.player.offset > this.dist ? this.dist : this.player.offset
  },

  collideObject: function (object){
    
    let coef = this.player.coef
    if      (object.getLeft()  < 0          ) { object.setLeft(0);             object.velocity_x = 0; }
    else if (object.getRight() - coef > this.rendered_width ) { object.setRight(this.width);   object.velocity_x = 0; }
    if      (object.getTop()    < 0          ) { object.setTop(0);              object.velocity_y = 0; }
    else if (object.getBottom() > this.rendered_height) { object.setBottom(this.rendered_height); object.velocity_y = 0; object.jumping = false; }
    
    var bottom, left, right, top, value;
    var radius = 3 // exprimental

    top    = Math.floor(object.getTop()    / this.tile_set.tile_size);
    left   = Math.floor((object.getLeft() )  / this.tile_set.tile_size);
    value  = this.collision_map[top * this.columns + left];
    this.collider.collide(value, object, left * this.tile_set.tile_size, top * this.tile_set.tile_size, this.tile_set.tile_size);
    this.discovered[top * this.columns + left] = true
    // console.log(top * this.columns + left)

    top    = Math.floor(object.getTop()    / this.tile_set.tile_size);
    right  = Math.floor((object.getRight()  ) / this.tile_set.tile_size);
    value  = this.collision_map[top * this.columns + right];
    this.collider.collide(value, object, right * this.tile_set.tile_size, top * this.tile_set.tile_size, this.tile_set.tile_size);
    this.discovered[top * this.columns + right] = true
    
    bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
    left   = Math.floor((object.getLeft()   ) / this.tile_set.tile_size);
    value  = this.collision_map[bottom * this.columns + left];
    this.collider.collide(value, object, left * this.tile_set.tile_size, bottom * this.tile_set.tile_size, this.tile_set.tile_size);
    this.discovered[bottom * this.columns + left] = true

    bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
    right  = Math.floor((object.getRight() ) / this.tile_set.tile_size);
    value  = this.collision_map[bottom * this.columns + right];
    this.collider.collide(value, object, right * this.tile_set.tile_size, bottom * this.tile_set.tile_size, this.tile_set.tile_size);
    this.discovered[bottom * this.columns + right] = true
  },


  update:function() {
    this.player.coef = this.player.offset < 0 ? 0 : this.player.offset > this.dist ? this.dist : this.player.offset
    this.player.updatePosition(this.gravity, this.friction, this.player.offset, this.dist);


    this.collideObject(this.player);
    
    this.scroll();

    for (let index = this.question_marks.length - 1; index > -1; -- index) {

      let question_mark = this.question_marks[index];

      question_mark.updatePosition(this.player);

      let distance = ((question_mark.x + this.player.coef - this.player.x) ** 2 + (question_mark.y - this.player.y) ** 2) ** (0.5)
      question_mark.animate_frame(distance>120?4:distance>100?3:distance>80?2:distance>60?1:0)
    
    }
    
    for (let index = this.lava.length - 1; index > -1; -- index) {

      let lava_cube = this.lava[index];
      lava_cube.updatePosition(this.player);
      lava_cube.animate()
      if (lava_cube.collideObject(this.player)){
        this.player.dead = true
      }
    }

    for (let index = this.doors.length - 1; index > -1; -- index) {

      let door = this.doors[index];
      door.updatePosition(this.player);
    }

    for (let index = this.notes.length - 1; index > -1; -- index) {

      let note = this.notes[index];
      note.updatePosition(this.player);
    }

    for (let index = this.keys.length - 1; index > -1; -- index) {

      let key = this.keys[index];
      key.updatePosition(this.player);
    }

    if (this.player.showAnimation)
      this.player.updateAnimation();

  },

  setup: function(zone){
    if (zone.hasOwnProperty('player_x') && zone.hasOwnProperty('player_y')){
      this.player.x           = zone.player_x
      this.player.y           = zone.player_y
    }
    if (zone.hasOwnProperty('rendered_columns') && zone.hasOwnProperty('rendered_rows')){
      this.rendered_columns = zone.rendered_columns
      this.rendered_rows = zone.rendered_rows
    }
    /* Get the new tile maps, the new zone, and reset the doors array. */
    this.layers             = zone.layers
    this.question_marks     = new Array()
    this.lava               = new Array()
    // this.graphical_map      = zone.graphical_map;
    this.collision_map      = zone.collision_map;

    this.discovered = new Array(this.collision_map.length).fill(0) // experimental

    this.columns            = zone.columns;
    this.rows               = zone.rows;

    this.height   = this.tile_set.tile_size * this.rows;
    this.width    = this.tile_set.tile_size * this.columns;

    this.doors              = new Array();
    this.keys              = new Array();
    this.notes              = new Array();
    this.zone_id            = zone.id;
    // this.rendered_height   = this.tile_set.tile_size * this.rows;
    // this.rendered_width    = this.tile_set.tile_size * this.columns;
    
    this.rendered_height   = this.tile_set.tile_size * this.rendered_rows;
    this.rendered_width    = this.tile_set.tile_size * this.rendered_columns;


    this.center = this.rendered_width / 2

    //if (this.player.x > this.center) this.player.x = this.center
  
    this.player.offset = this.player.getCenterX()-this.center
    this.offset = this.player.getCenterX()-this.center
    this.dist = this.columns * this.tile_set.tile_size - this.center * 2


    for (let index = zone.question_marks.length - 1; index > -1; -- index) {

      let question_mark = zone.question_marks[index];
      // this.question_marks[index] = new Game.QuestionMark(question_mark[0] * this.tile_set.tile_size + 5, question_mark[1] * this.tile_set.tile_size - 2, question_mark[2], this.player.offset, this.dist);
      this.question_marks[index] = new Game.QuestionMark(question_mark[0] * this.tile_set.tile_size + 5, question_mark[1] * this.tile_set.tile_size - 2, question_mark[2]);
      // console.log(question_mark.frame_set_image_index)
    }

    for (let index = zone.lava.length - 1; index > -1; -- index) {

      let lava_cube = zone.lava[index];
      this.lava[index] = new Game.Lava(lava_cube[0] * this.tile_set.tile_size, lava_cube[1] * this.tile_set.tile_size, this.player.offset, this.dist);
      // console.log(question_mark.frame_set_image_index)
    }

    /* Generate new doors. */
    for (let index = zone.doors.length - 1; index > -1; -- index) {

      let door = zone.doors[index];
      this.doors[index] = new Game.Door(door);

    }

    for (let index = zone.keys.length - 1; index > -1; -- index) {

      let key = zone.keys[index];
      // let destination_zone = key.destination_zone
      if (this.player.keys.filter(elem => elem.destination_zone == key.destination_zone).length == 0)
        this.keys[index] = new Game.Key(key);

    }
    
    if (zone.hasOwnProperty("notes"))
      for (let index = zone.notes.length - 1; index > -1; -- index) {

        let note = zone.notes[index];
        // let destination_zone = key.destination_zone
        // if (this.player.keys.filter(elem => elem.destination_zone == key.destination_zone).length == 0)
        this.notes[index] = new Game.Note(note);

      }

    /* If the player entered into a door, this.door will reference that door. Here
    it will be used to set the player's location to the door's destination. */
    if (this.door) {

      /* if a destination is equal to -1, that means it won't be used. Since each zone
      spans from 0 to its width and height, any negative number would be invalid. If
      a door's destination is -1, the player will keep his current position for that axis. */
      if (this.door.destination_x != -1) {

        this.player.setCenterX   (this.door.destination_x);
        this.player.setOldCenterX(this.door.destination_x);// It's important to reset the old position as well.
        // this.scroll()
      }

      if (this.door.destination_y != -1) {

        this.player.setCenterY   (this.door.destination_y);
        this.player.setOldCenterY(this.door.destination_y);

      }

      this.door = undefined;// Make sure to reset this.door so we don't trigger a zone load.

    }
  },


};

Game.World.Collider = function(){

  this.collide = function(value, object, tile_x, tile_y, tile_size) {

    switch(value) {

      /* All 15 tile types can be described with only 4 collision methods. These
      methods are mixed and matched for each unique tile. */

      case  1:     this.collidePlatformTop    (object, tile_y            ); break;
      case  2:     this.collidePlatformRight  (object, tile_x + tile_size); break;
      case  3: if (this.collidePlatformTop    (object, tile_y            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case  4:     this.collidePlatformBottom (object, tile_y + tile_size); break;
      case  5: if (this.collidePlatformTop    (object, tile_y            )) return;
                   this.collidePlatformBottom (object, tile_y + tile_size); break;
      case  6: if (this.collidePlatformRight  (object, tile_x + tile_size)) return;
                   this.collidePlatformBottom (object, tile_y + tile_size); break;
      case  7: if (this.collidePlatformTop    (object, tile_y            )) return;
               if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case  8:     this.collidePlatformLeft   (object, tile_x            ); break;
      case  9: if (this.collidePlatformTop    (object, tile_y            )) return;
                   this.collidePlatformLeft   (object, tile_x            ); break;
      case 10: if (this.collidePlatformLeft   (object, tile_x            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case 11: if (this.collidePlatformTop    (object, tile_y            )) return;
               if (this.collidePlatformLeft   (object, tile_x            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case 12: if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
                   this.collidePlatformLeft   (object, tile_x            ); break;
      case 13: if (this.collidePlatformTop    (object, tile_y            )) return;
               if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
                   this.collidePlatformLeft   (object, tile_x            ); break;
      case 14: if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
               if (this.collidePlatformLeft   (object, tile_x            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case 15: if (this.collidePlatformTop    (object, tile_y            )) return;
               if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
               if (this.collidePlatformLeft   (object, tile_x            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;

    }

  }
}

Game.World.Collider.prototype = {
  constructor: Game.World.Collider,

  collidePlatformBottom:function(object, tile_bottom) {

    if (object.getTop() < tile_bottom && object.getOldTop() >= tile_bottom) {

      object.setTop(tile_bottom);// Move the top of the object to the bottom of the tile.
      object.velocity_y = 0;     // Stop moving in that direction.
      return true;               // Return true because there was a collision.

    } return false;              // Return false if there was no collision.

  },

  collidePlatformLeft:function(object, tile_left) {

    if (object.getRight() > tile_left && object.getOldRight()  <= tile_left) {

    // if (object.getShiftedRight() > tile_left && object.getOldRight() + object.coef <= tile_left) {

      object.setRight(tile_left - 0.01);// -0.01 is to fix a small problem with rounding
      object.velocity_x = 0;
      return true;

    } return false;

  },

  collidePlatformRight:function(object, tile_right) {

    if (object.getLeft()< tile_right && object.getOldLeft() >= tile_right) {

      object.setLeft(tile_right);
      object.velocity_x = 0;
      return true;

    } return false;

  },

  collidePlatformTop:function(object, tile_top) {

    if (object.getBottom() > tile_top && object.getOldBottom() <= tile_top) {
      // if (object.velocity_y > 7.99) object.dead = true
      object.setBottom(tile_top - 0.01);
      object.velocity_y = 0;
      object.jumping    = false;
      return true;

    } return false;

  }

}
Game.Object = function(x, y, width, height) {

  this.height = height;
  this.width  = width;
  this.x      = x;
  this.y      = y;
  this.temp   = x

  this.coef = 0
  this.offset = 0

  this.dead = false
  this.showAnimation = true
};
  
Game.Object.prototype = {

  constructor:Game.World.Object,

  /* These functions are used to get and set the different side positions of the object. */
  getBottom:   function()  { return this.y     + this.height; },
  getLeft:     function()  { return this.x    },
  getRight:    function()  { return this.x     + this.width    },
  getTop:      function()  { return this.y;                   },
  getOldBottom:function()  { return this.y_old + this.height; },
  getOldLeft:  function()  { return this.x_old;               },
  getOldRight: function()  { return this.x_old + this.width;  },
  getOldTop:   function()  { return this.y_old                },
  getCenterX: function()  { return this.x + this.width  * 0.5; },
  getCenterY: function()  { return this.y + this.height * 0.5; },
  setBottom:   function(y) { this.y     = y    - this.height;  },
  setLeft:     function(x) { this.x     = x;                 },
  setRight:    function(x) { this.x     = x    - this.width; },
  setTop:      function(y) { this.y     = y;                  },
  setOldBottom:function(y) { this.y_old = y    - this.height; },
  setOldLeft:  function(x) { this.x_old = x;                  },
  setOldRight: function(x) { this.x_old = x    - this.width;  },
  setOldTop:   function(y) { this.y_old = y;                  },
  setCenterX: function(x) { this.x = x - this.width  * 0.5;    },
  setCenterY: function(y) { this.y = y - this.height * 0.5;    },
  
};
Game.MovingObject = function(x, y, width, height, velocity_max = 15) {

  Game.Object.call(this, x, y, width, height);

  this.jumping      = false;
  this.velocity_max = velocity_max;// added velocity_max so velocity can't go past 16
  this.velocity_x   = 0;
  this.velocity_y   = 0;
  this.x_old        = x;
  this.y_old        = y;

};
/* I added setCenterX, setCenterY, getCenterX, and getCenterY */
Game.MovingObject.prototype = {

  getOldBottom : function()  { return this.y_old + this.height;       },
  getOldCenterX: function()  { return this.x_old + this.width  * 0.5; },
  getOldCenterY: function()  { return this.y_old + this.height * 0.5; },
  getOldLeft   : function()  { return this.x_old;                     },
  getOldRight  : function()  { return this.x_old + this.width;        },
  getOldTop    : function()  { return this.y_old;                     },
  setOldBottom : function(y) { this.y_old = y    - this.height;       },
  setOldCenterX: function(x) { this.x_old = x    - this.width  * 0.5; },
  setOldCenterY: function(y) { this.y_old = y    - this.height * 0.5; },
  setOldLeft   : function(x) { this.x_old = x;                        },
  setOldRight  : function(x) { this.x_old = x    - this.width;        },
  setOldTop    : function(y) { this.y_old = y;                        }

};
Object.assign(Game.MovingObject.prototype, Game.Object.prototype);
Game.MovingObject.prototype.constructor = Game.MovingObject;

Game.Animator = function(delay, frame_set_index = 0, mode = "loop") {

  this.count       = 0;
  this.delay       = (delay >= 1) ? delay : 1;
  this.frame_set   = this.frame_sets[frame_set_index][0];
  this.frame_index = 0;
  this.frame_value = this.frame_sets[frame_set_index][0][0];
  
  this.frame_set_image_index   = this.frame_sets[frame_set_index][1];
  this.mode        = mode;

};

Game.Animator.prototype = {

  constructor:Game.Animator,

  animate:function() {

    switch(this.mode) {

      case "loop" : this.loop(); break;
      case "repeat_once" : this.loop(); break;
      case "pause":              break;

    }

  },
  animate_frame : function(frame_index){

    this.frame_value = this.frame_set[frame_index];
    
  },

  changeFrameSet(frame_set_index, mode, delay = 10, frame_index = 0) {

    if (this.frame_set === this.frame_sets[frame_set_index][0]) { return; }

    this.count       = 0;
    this.delay       = delay;
    this.frame_set   = this.frame_sets[frame_set_index][0];
    this.frame_set_image_index   = this.frame_sets[frame_set_index][1];
    this.frame_index = frame_index;
    this.frame_value = this.frame_set[frame_index];
    this.mode        = mode;

    this.frame_set_index = frame_set_index

  },

  loop:function() {
    this.count ++;

    while(this.count > this.delay) {

      this.count -= this.delay;

      this.frame_index = (this.frame_index < this.frame_set.length - 1) ? this.frame_index + 1 : 0;

      this.frame_value = this.frame_set[this.frame_index];

      if ((this.frame_index == this.frame_set.length - 1) && (this.mode == "repeat_once")){
        this.showAnimation = false
        break
      }
      
    }

  }

};


Game.Door = function(door) {

  Game.Object.call(this, door.x, door.y, door.width, door.height);
 
  this.destination_x    = door.destination_x;
  this.destination_y    = door.destination_y;
  this.destination_zone = door.destination_zone;
  this.needs_key        = door.needs_key
  this.zone             = door.zone
  this.base_x           = door.x
  this.base_y           = door.y

};
 Game.Door.prototype = {
 
  /* Tests for collision between this door object and a MovingObject. */
  collideObject(object) {
 
    let center_x = object.getCenterX() - object.coef;
    let center_y = object.getCenterY();
 
    if (center_x < this.getLeft() || center_x > this.getRight() ||
        center_y < this.getTop()  || center_y > this.getBottom()) return false;
 
    return true;
 
  },

  has_key(keys){
    for (let i = 0; i < keys.length; i++){
      if (this.destination_zone == keys[i].destination_zone || this.zone == keys[i].destination_zone) 
        return true
    }
    return false
  },
  updatePosition:function(object) {

    this.x = this.base_x - object.coef;

  },
 
 };
 Object.assign(Game.Door.prototype, Game.Object.prototype);
 Game.Door.prototype.constructor = Game.Door;


Game.Player = function(x, y, animation = "drago") {

  Game.MovingObject.call(this, x, y, 30, 30);
  // Game.MovingObject.call(this, x, y, 30, 30);
  Game.Animator.call(this, 10, Game.Player.prototype.frame_set_index);
  this.animation = animation
  this.coins = new Array()
  this.time = 0
  this.jumping     = true;
  this.direction_x = 1;
  this.velocity_x  = 0;
  this.velocity_y  = 0;

  this.keys = []
  this.coef = 0

};

Game.Player.prototype = {

    frame_sets: [
      [[0,1,2,3],1], // idle
      [[4,5,6,7,8,9,10,11],2], // jump
      [[12,13,14,15,16,17],3], // run-left
      [[18,19,20,21,22,23],4], // run
      [[24,25,26,27],5], // idle-left
      [[34,35,36,37,38,39,40,41],8], // death

      // [[53],12], //idle-right
      // [[54],12], //jemp-left
      // [[49, 50, 51, 52], 12], //walk-left
      // [[55, 56, 57, 58], 12], //walk-right
      // [[47],12], //idle-left
      // [[48],12], //jump -left
    ],
    jump:function() {
  
      if (!this.jumping) {
  
        this.jumping     = true;
        this.velocity_y -= 45;  
  
      }
  
    },
  
    moveLeft: function() {

      this.direction_x = -1;// Make sure to set the player's direction.
      this.velocity_x -= 1.55;
  
    },
  
    moveRight:function(frame_set) {
  
      this.direction_x = 1;
      this.velocity_x += 1.55;
  
    },

    moveDown:function() {
    },

    updatePosition:function(gravity, friction, offset, dist) {

      this.x_old = this.x
      this.y_old = this.y
      this.velocity_y += gravity;
      this.x    += this.velocity_x
      this.y    += this.velocity_y;
      
      this.velocity_x *= friction;
      this.velocity_y *= friction;

  
    },
    updateAnimation:function() {

      if (!this.dead){
        if (this.velocity_y > 0) {
    
          if (this.direction_x < 0) this.changeFrameSet(1, "loop", 5);
          else this.changeFrameSet(1, "loop", 10);
    
        } else if (this.direction_x < 0) {
    
          if (this.velocity_x < -0.1) this.changeFrameSet(2, "loop", 5);
          else this.changeFrameSet(4, "loop");
    
        } else if (this.direction_x > 0) {
    
          if (this.velocity_x > 0.1) this.changeFrameSet(3, "loop", 5);
          else this.changeFrameSet(0, "loop");
    
        }
      }
      else
        this.changeFrameSet(5, "repeat_once", 3)
      
      this.animate();
  
    },
}

Object.assign(Game.Player.prototype, Game.MovingObject.prototype);
Object.assign(Game.Player.prototype, Game.Animator.prototype);
Game.Player.prototype.constructor = Game.Player;

Game.World.TileSet = function(columns, tile_size){

  this.columns    = columns;
  this.tile_size  = tile_size;

  let fr = Game.World.TileSet.Frame;
  let offset_x = 0
  let offset_y = 0
  this.frames = [
    // Idle
    new fr(0,0,32,32, offset_x, offset_y),
    new fr(32,0,32,32, offset_x, offset_y),
    new fr(64,0,32,32, offset_x,  offset_y),
    new fr(96,0,32,32, offset_x,  offset_y),

    // Jump
    new fr(0,0,32,32, offset_x,  offset_y),
    new fr(32,0,32,32, offset_x,  offset_y),
    new fr(64,0,32,32, offset_x,  offset_y),
    new fr(96,0,32,32, offset_x,  offset_y),
    new fr(128,0,32,32, offset_x,  offset_y),
    new fr(160,0,32,32, offset_x,  offset_y),
    new fr(192,0,32,32, offset_x,  offset_y),
    new fr(224,0,32,32, offset_x,  offset_y),

    // Run-left
    new fr(0,0,32,32, offset_x,  offset_y),
    new fr(32,0,32,32, offset_x, offset_y),
    new fr(64,0,32,32, offset_x, offset_y),
    new fr(96,0,32,32, offset_x, offset_y),
    new fr(128,0,32,32, offset_x, offset_y),
    new fr(160,0,32,32, offset_x, offset_y),

    // Run
    new fr(0,0,32,32, offset_x,  offset_y),
    new fr(32,0,32,32, offset_x, offset_y),
    new fr(64,0,32,32, offset_x, offset_y),
    new fr(96,0,32,32, offset_x, offset_y),
    new fr(128,0,32,32, offset_x, offset_y),
    new fr(160,0,32,32, offset_x, offset_y),

    // Idle-left
    new fr(0,0,32,32, offset_x, offset_y),
    new fr(32,0,32,32, offset_x, offset_y),
    new fr(64,0,32,32, offset_x,  offset_y),
    new fr(96,0,32,32, offset_x,  offset_y),

    // Question Mark
    new fr(0,0,32,32, offset_x,  offset_y),

    // Question Mark 2
    new fr(0,0,32,32, offset_x,  -32),
    new fr(32,0,32,32, offset_x,  -32),
    new fr(64,0,32,32, offset_x,  -32),
    new fr(96,0,32,32, offset_x,  -32),
    new fr(128,0,32,32, offset_x,  -32),

    // Death
    new fr(0,0,32,32, offset_x,  offset_y),
    new fr(32,0,32,32, offset_x,  offset_y),
    new fr(64,0,32,32, offset_x,  offset_y),
    new fr(96,0,32,32, offset_x,  offset_y),
    new fr(128,0,32,32, offset_x,  offset_y),
    new fr(160,0,32,32, offset_x,  offset_y),
    new fr(192,0,32,32, offset_x,  offset_y),
    new fr(224,0,32,32, offset_x,  offset_y),

    // Lava
    new fr(0,0,32,32, offset_x,  offset_y),
    new fr(32,0,32,32, offset_x,  offset_y),
    new fr(64,0,32,32, offset_x,  offset_y),

    // Key
    new fr(0,0,32,32, offset_x,  offset_y),
    
    // Note
    new fr(0,0,32,32, offset_x,  offset_y),

    new fr(230,  192, 26, 32, 0, -2), // idle-left
    new fr( 100,  192, 26, 32, 0, -2), // jump-left
    new fr(204,  192, 26, 32, 0, -2), new fr(178, 192, 26, 32, 0, -2), new fr(152, 192, 26, 32, 0, -2), new fr(126, 192, 26, 32, 0, -2), // walk-left
    new fr(  0, 224, 26, 32, 0, -2), // idle-right
    new fr( 130, 224, 26, 32, 0, -2), // jump-right
    new fr( 26, 224, 26, 32, 0, -2), new fr(52, 224, 26, 32, 0, -2), new fr(78, 224, 26, 32, 0, -2), new fr(104, 224, 26, 32, 0, -2) // walk-right
     
  ]

}

Game.World.TileSet.prototype = { 

  constructor: Game.World.TileSet

};

Game.World.TileSet.Frame = function(x, y, width, height, offset_x, offset_y) {

  this.x        = x;
  this.y        = y;
  this.width    = width;
  this.height   = height;
  this.offset_x = offset_x;
  this.offset_y = offset_y;

};

Game.World.TileSet.Frame.prototype = { 

  constructor: Game.World.TileSet.Frame 

};

Game.QuestionMark = function(x, y, text) {

  Game.Object.call(this, x, y, 32, 32);
  Game.Animator.call(this, 10, Game.QuestionMark.prototype.frame_set_index, "loop");

  this.frame_index = Math.floor(Math.random() * 2);

  this.base_x     = x;
  this.base_y     = y;
  this.position_x = Math.random() * Math.PI * 2;
  this.position_y = this.position_x * 2;
  this.text       = text

};
Game.QuestionMark.prototype = {

  collideObject(object) {
    let center_x = object.getCenterX() - object.coef;
    let center_y = object.getCenterY();
    
    if (center_x < this.getLeft()  || center_x > this.getRight()  ||
        center_y < this.getTop()   || center_y > this.getBottom()) return false;
 
    return true;
 
  },
  frame_sets: [
    [[29,30,31,32,33],7]
  ],
  
  frame_set_index : 0,

  updatePosition:function(object) {

    this.position_x += 0.1;
    this.position_y += 0.2;

    this.x = this.base_x + Math.cos(this.position_x) * 2 - object.coef;
    this.y = this.base_y + Math.sin(this.position_y);

  },
};

Object.assign(Game.QuestionMark.prototype, Game.Animator.prototype);
Object.assign(Game.QuestionMark.prototype, Game.Object.prototype);
Game.QuestionMark.prototype.constructor = Game.QuestionMark

Game.Lava = function(x, y) {

  Game.Object.call(this, x, y, 32, 32);
  Game.Animator.call(this, 6, Game.Lava.prototype.frame_set_index, "loop");

  this.base_x     = x;
  this.base_y     = y;

};
Game.Lava.prototype = {

  collideObject(object) {
    let center_x = object.getCenterX() - object.coef;
    let center_y = object.getCenterY();
    
   
    if (center_x < this.getLeft()  || center_x > this.getRight()  ||
        center_y < this.getTop()   || center_y > this.getBottom()) return false;
 
    return true;
 
  },
  frame_sets: [
    [[42, 43, 44],9]
  ],
  
  frame_set_index : 0,

  updatePosition:function(object) {

    this.x = this.base_x - object.coef;

  },
};

Object.assign(Game.Lava.prototype, Game.Animator.prototype);
Object.assign(Game.Lava.prototype, Game.Object.prototype);
Game.Lava.prototype.constructor = Game.Lava

Game.Key = function(key) {

  Game.Object.call(this, key.x, key.y, key.width, key.height);
  Game.Animator.call(this, 10, Game.Key.prototype.frame_set_index, "pause");

  this.destination_zone = key.destination_zone;
  this.base_x = key.x
  this.base_y = key.y

  };
  Game.Key.prototype = {

  frame_sets: [
    [[45],10]
  ],

  frame_set_index : 0,
  /* Tests for collision between this door object and a MovingObject. */
  collideObject(object) {

    let center_x = object.getCenterX() - object.coef;
    let center_y = object.getCenterY();

    if (center_x < this.getLeft() || center_x > this.getRight() ||
        center_y < this.getTop()  || center_y > this.getBottom()) return false;

    return true;

  },
  updatePosition:function(object) {

    this.x = this.base_x - object.coef;

  },

};
Object.assign(Game.Key.prototype, Game.Object.prototype);
Game.Key.prototype.constructor = Game.Key;


 Game.Note = function(note) {

  Game.Object.call(this, note.x, note.y, note.width, note.height);
  Game.Animator.call(this, 10, Game.Note.prototype.frame_set_index, "pause");
 
  this.text = note.text
  this.base_x = note.x
  this.base_y = note.y
 
 };
 Game.Note.prototype = {
 
  frame_sets: [
    [[46],11]
  ],
  
  frame_set_index : 0,

  collideObject(object) {
 
    let center_x = object.getCenterX() - object.coef;
    let center_y = object.getCenterY();
 
    if (center_x < this.getLeft() || center_x > this.getRight() ||
        center_y < this.getTop()  || center_y > this.getBottom()) return false;
 
    return true;
 
  },
  updatePosition:function(object) {

    this.x = this.base_x - object.coef;

  },
 
 };
 Object.assign(Game.Note.prototype, Game.Object.prototype);
 Game.Note.prototype.constructor = Game.Note;