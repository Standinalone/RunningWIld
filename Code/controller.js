const Controller = function() {

    //this.down  = new Controller.ButtonInput();
    this.left  = new Controller.ButtonInput();
    this.right = new Controller.ButtonInput();
    this.up    = new Controller.ButtonInput();
    this.d    = new Controller.ButtonInput();
    this.esc    = new Controller.ButtonInput();
    this.r    = new Controller.ButtonInput();
  
    this.keyDownUp = function(type, key_code) {
  
      var down = (type == "keydown") ? true : false;

      switch(key_code) {
  
        case 82: this.r.getInput(down);  break;
        case 27: this.esc.getInput(down);  break;
        case 37: this.left.getInput(down);  break;
        case 38: this.up.getInput(down);    break;
        case 39: this.right.getInput(down); break;
        case 40: this.d.getInput(down);
  
      }
  
  
    };
  
    //this.handleKeyDownUp = (event) => { this.keyDownUp(event); }; // 01s
  
  };
  
  Controller.prototype = {
  
    constructor : Controller
  
  };
  
  Controller.ButtonInput = function() {
  
    this.active = this.down = false;
  
  };
  
  Controller.ButtonInput.prototype = {
  
    constructor : Controller.ButtonInput,
  
    getInput : function(down) {
  
      if (this.down != down) this.active = down;
      //  this.active = down;
      this.down = down;
  
    }
  
  };