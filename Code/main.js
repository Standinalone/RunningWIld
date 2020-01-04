window.addEventListener("load", function(event){

    "use strict"

    const ZONE_PREFIX = "rooms/zone_";
    const ZONE_SUFFIX = ".json";

    const AssetsManager = function() {

        this.tile_set_images = []
        this.rooms = []

    };

    AssetsManager.prototype = {

        constructor: Game.AssetsManager,

        loadRooms: async function (url){
            let self = this
            let request = new XMLHttpRequest()
            
            // for (let i = 0; i < rooms.length; i++){
                let response = await fetch(url, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                    },
                });
                let result = await response.json();
                return result

        },

        loadImages: async function (images, index, callback){
            let self = this
            let image = new Image()
            
            image.addEventListener ("load", function(){
                self.tile_set_images.push(image)
                if (index++ < images.length - 1) self.loadImages(images, index, callback)
                else return 
            })
            image.src = images[index]

        },
    };

    var resize = function(event) {
        display.resize(document.documentElement.clientWidth, document.documentElement.clientHeight, game.world.rendered_height / game.world.rendered_width);
        display.render();
    };

    var render = function() {
        console.log(display.activeMenu)
        if (display.activeMenu == "map"){
        // switch (display.activeMenu){
        //     case "firstMenu"    :
        //         display.drawOptions()
        //         break
        //     case "login"        :
        //         display.drawLoginPage()
        //         break
        //     case "signup"       :
        //         display.drawSignupPage()
        //         break
        //     case "levelsMenu"   :
        //         display.drawLevelsMenu(game.levels)
        //         break
        //     case "pauseMenu"    :
        //         display.showMenu()
        //         break
        //     case "help"         :
        //         display.drawHelpMenu()
        //         break
        //     case "map"    :
                if (!game.world.player.dead){
                    display.fill("rgb(163, 231, 218)"); // Clear background to game's background color.
                    
                    display.drawMap   (assets_manager.tile_set_images[0], 
                        game.world.tile_set.columns, game.world.layers, game.world.columns, game.world.rendered_columns,  game.world.tile_set.tile_size, game.world.player.offset, false, game.world.collision_map, game.world.discovered);
                    }
                    let frame = game.world.tile_set.frames[game.world.player.frame_value];
                
                    // This function is responding for drawing objects with the beggining animation set to object's frame_set_index
                    display.drawObject(assets_manager.tile_set_images,
                        frame.x, frame.y,
                        game.world.player.x + Math.floor(game.world.player.width * 0.5 - frame.width * 0.5) + frame.offset_x,
                        game.world.player.y + frame.offset_y, frame.width, frame.height, game.world.player.frame_set_image_index, game.world.player.offset, game.world.dist);
                    
                        if (!game.world.player.dead){
                    display.drawMap   (assets_manager.tile_set_images[0], 
                        game.world.tile_set.columns, game.world.layers, game.world.columns, game.world.rendered_columns,  game.world.tile_set.tile_size, game.world.player.offset, true, game.world.collision_map, game.world.discovered);
                        
                    for (let index = game.world.question_marks.length - 1; index > -1; -- index) {

                        let question_mark = game.world.question_marks[index];
                    
                        frame = game.world.tile_set.frames[question_mark.frame_value];
                    
                        display.drawObject(assets_manager.tile_set_images,
                        frame.x, frame.y,
                        question_mark.x + Math.floor(question_mark.width * 0.5 - frame.width * 0.5) + frame.offset_x,
                        question_mark.y + frame.offset_y, frame.width, frame.height, question_mark.frame_set_image_index, game.world.rendered_width, question_mark.offset, game.world.dist);
                    
                    }
                    for (let index = game.world.lava.length - 1; index > -1; -- index) {

                        let lava_cube = game.world.lava[index];
                        frame = game.world.tile_set.frames[lava_cube.frame_value];
                    
                        display.drawObject(assets_manager.tile_set_images,
                        frame.x, frame.y,
                        lava_cube.x + Math.floor(lava_cube.width * 0.5 - frame.width * 0.5) + frame.offset_x,
                        lava_cube.y + frame.offset_y, frame.width, frame.height, lava_cube.frame_set_image_index, game.world.rendered_width, lava_cube.offset, game.world.dist);
                    
                    }
                    for (let index = game.world.keys.length - 1; index > -1; -- index) {

                        let key = game.world.keys[index];
                        frame = game.world.tile_set.frames[key.frame_value];
                    
                        display.drawObject(assets_manager.tile_set_images,
                        frame.x, frame.y,
                        key.x + Math.floor(key.width * 0.5 - frame.width * 0.5) + frame.offset_x,
                        key.y + frame.offset_y, frame.width, frame.height, key.frame_set_image_index, game.world.rendered_width, key.offset, game.world.dist);
                    
                    }
                    for (let index = game.world.notes.length - 1; index > -1; -- index) {

                        let note = game.world.notes[index];
                        frame = game.world.tile_set.frames[note.frame_value];
                    
                        display.drawObject(assets_manager.tile_set_images,
                        frame.x, frame.y,
                        note.x + Math.floor(note.width * 0.5 - frame.width * 0.5) + frame.offset_x,
                        note.y + frame.offset_y, frame.width, frame.height, note.frame_set_image_index, game.world.rendered_width, note.offset, game.world.dist);
                    
                    }
                    if (game.world.player.show_message)
                        display.drawMessage( game.world.player.show_message, game.world.rendered_width, game.world.rendered_height)
                    else{
                        display.DOM[3].style.display = "none"
                    }
                                
                    // display.drawDoors(game.world.doors)

                    // display.drawBorders(game.world.player.x + Math.floor(game.world.player.width * 0.5 - frame.width * 0.5) + frame.offset_x,
                    //     game.world.player.y + frame.offset_y)
                    
                    // p.innerHTML = "Offset: " + (game.world.player.offset).toFixed(2) + "<br>" +
                    // "Dist: " + (game.world.dist).toFixed(2) + "<br>" +
                    // "Center: " + (game.world.center).toFixed(2) + "<br>" +
                    // "Velocity_x: " + (game.world.player.velocity_x).toFixed(2) + "<br>" +
                    // "Velocity_y: " + (game.world.player.velocity_y).toFixed(2) + "<br>" +
                    // "x: " + (game.world.player.x).toFixed(2) + "<br>" +
                    // "x_old: " + (game.world.player.x_old).toFixed(2) + "<br>" + 
                    // "x_center: " + (game.world.player.getCenterX()).toFixed(2) + "<br>" + 
                    // "Coins: " + game.world.player.coins.length + "<br>" +
                    // "Your time: " + game.world.player.time
        //         }
        //         break
        //     default             : 
        //         break
        // }
                    }
                    else{
                        display.showGameOver()
                    }

                        
        }
            
        display.render();
    
    };

    var update = function() {
        
            
            if (controller.left.active)  { game.world.player.moveLeft();  }
            if (controller.right.active) { game.world.player.moveRight(); }
            if (controller.up.active)    { game.world.player.jump(); controller.up.active = false; }   
            if (controller.d.active) { game.world.player.moveDown(); }
            if (controller.esc.active) { 
                switch(display.activeMenu){
                    case "pauseMenu"    :
                        display.DOM[4].style.display = "block"
                        display.activeMenu = "map"
                        break
                    case "help"         :
                    case "leaderBoard"  :
                        display.DOM[5].style.display = "none"
                    case "map"          :
                        display.DOM[4].style.display = "none"
                        display.activeMenu = "pauseMenu"
                        display.showMenu()
                    default             :
                        break
                }
                controller.esc.active = false
            }

        if (display.activeMenu == "map" || display.activeMenu == "pauseMenu"){
            if(controller.d.active){
                for (let i = 0; i < game.world.keys.length; i++){
                    let key = game.world.keys[i]
                    if (key.collideObject(game.world.player)){
                        game.world.player.keys.push(key)
                        game.world.keys.splice(i,1)
                    }
                }
            }
            game.world.player.show_message = undefined
            if(controller.d.active){
                for (let i = 0; i < game.world.notes.length; i++){
                    let note = game.world.notes[i]
                    if (note.collideObject(game.world.player)){
                        game.world.player.show_message = note.text
                    }
                }
            }
            if(controller.d.active){
                for (let i = 0; i < game.world.question_marks.length; i++){
                    let question_mark = game.world.question_marks[i]
                    if (question_mark.collideObject(game.world.player, game.world.coef)){
                        game.world.player.show_message = question_mark.text
                    }
                }
            }
            if(controller.r.active){
                engine.stop()
                let default_room = game.levels[game.levels.indexOf(game.current_level)].default_room
                display.stopwatch.restart()
                game.world.player.showAnimation = true
                game.world.player.dead = false
                game.world.setup(game.levels[game.levels.indexOf(game.current_level)].zones_arr[default_room]);
                
                display.buffer.canvas.height = game.world.rendered_height;
                display.buffer.canvas.width = game.world.rendered_width;
                display.buffer.imageSmoothingEnabled = false;

                resize()
                engine.start()
            }
            for(let index = game.world.doors.length - 1; index > -1; -- index) {
    
                let door = game.world.doors[index];
            
                if (door.collideObject(game.world.player)) {
                    if (!door.needs_key || (controller.d.active && door.has_key(game.world.player.keys)))
                        if (door.destination_zone != "complete"){
                            game.world.door = door
                        }
                        else{
                            display.DOM[4].style.display = "none"
                            display.stopwatch.stop()
                            display.activeMenu = "levelsMenu"
                            display.drawLevelsMenu(request.getLevels());
                            request.mapCompletedRequest(game.levels.indexOf(game.current_level), display.stopwatch.times[1], display.stopwatch.times[0], display.stopwatch.times[2])
                        }
                            
                };
        
            }
    
            game.update();
    
            if (game.world.door){
                engine.stop()
                game.world.setup(game.levels[0].zones_arr[game.world.door.destination_zone]);
                
                display.buffer.canvas.height = game.world.rendered_height;
                display.buffer.canvas.width = game.world.rendered_width;
                display.buffer.imageSmoothingEnabled = false;
                
                resize()
                engine.start()
            }
        }
       
        
      };
    

    var keyDownUp = function(event){
        controller.keyDownUp(event.type, event.keyCode)
    } 

    // Variables

    var assets_manager  = new AssetsManager();
    var controller      = new Controller()
    var display         = new Display(document.querySelector("canvas"))
    var game            = new Game()
    var engine          = new Engine(1000/30, render, update)
    var p               = document.createElement("p")
    var request         = new Request()

    display.stopwatch = new Game.Stopwatch(display.DOM[4]);
    p.setAttribute("style", "color:#c07000; font-size:2.0em; position:fixed; padding-left: 200px");
    document.body.appendChild(p);

    // Setting levels

    let level1 = new Game.Level("rooms/1/zone_", ".json", ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'])
    let level2 = new Game.Level("rooms/2/zone_", ".json", ['00'])
    // let level3 = new Game.Level("rooms/3/zone_", ".json", ['00'])

    game.levels.push(level1, level2)
    // game.levels.push(level1)

    // Setting callback functions for menu buttons

    display.rectangles[0].callback = () => {
        display.activeMenu = "login"
        display.drawLoginPage()
    }
    display.rectangles[1].callback = () => {
        display.activeMenu = "signup"
        display.drawSignupPage()
    }

    display.loginButtons[0].callback = () => {
        display.closeLoginPage(); 
        display.activeMenu = "firstMenu"
        display.drawOptions()
    }
    display.loginButtons[1].callback = async function () { 
        await request.loginRequest(); 
        display.closeLoginPage(); 
        display.activeMenu = "levelsMenu"
        display.drawLevelsMenu(request.getLevels())
    }

    display.signupButtons[0].callback = () => { 
        display.closeSignupPage(); 
        display.activeMenu = "firstMenu"
        display.drawOptions()
    }
    display.signupButtons[1].callback = async function () { 
        let response = await request.signupRequest(); 
        if (response.status == 200){
            display.closeSignupPage()
            display.activeMenu = "levelsMenu"
            display.drawLevelsMenu(request.getLevels())
        }
    }

    for (let i = 0; i < game.levels.length; i++){
        display.levels.push({})
        display.levels[i].callback = () => { loadLevel(i) }
    }
    
    display.menuItems[0].callback = () => { 
        request.logoutRequest(); 
        display.activeMenu = "firstMenu"
        display.drawOptions()
    }
    display.menuItems[1].callback = () => { 
        display.activeMenu = "help" 
        display.drawHelpMenu()
    }
    display.menuItems[2].callback = () => { 
        display.activeMenu = "leaderBoard";
        (async () => {
            let leaders = await request.getLeaders(game.levels.indexOf(game.current_level)); 
            display.drawLeadersBoard(leaders);
        })()
    }
    display.menuItems[3].callback = () => {
        display.activeMenu = "levelsMenu"
        display.drawLevelsMenu(request.getLevels())
    }

    // Events

    display.context.canvas.addEventListener('click', selectElement, false);
    display.loadLevel_function = loadLevel
    window.addEventListener("resize", resize)
    window.addEventListener("keydown", keyDownUp)
    window.addEventListener("keyup", keyDownUp)

    function selectElement(event){
        let canvasLeft = display.context.canvas.offsetLeft
        let canvasTop = display.context.canvas.offsetTop
        var x = event.pageX - canvasLeft
        var y = event.pageY - canvasTop

        var checkBorders = function(arr){
            arr.forEach(function(element) {
                if (y > element.rec_top && y < element.rec_top + element.rec_height 
                    && x > element.rec_left && x < element.rec_left + element.rec_width) {
                        element.callback()
                }
            })
        }
        if (display.activeMenu == "firstMenu")
            checkBorders(display.rectangles)
        if (display.activeMenu == "login")
            checkBorders(display.loginButtons)
        if (display.activeMenu == "signup")
            checkBorders(display.signupButtons)
        if (display.activeMenu == "levelsMenu")
            checkBorders(display.levels)
        if (display.activeMenu == "pauseMenu")
            checkBorders(display.menuItems)
    }

    async function loadLevel(index){
        for (let i = 0; i < game.levels[index].urls_arr.length; i++){
            let url = game.levels[index].prefix + game.levels[index].urls_arr[i] + game.levels[index].suffix
            let json = await assets_manager.loadRooms(url) // loads all needed rooms in json format
            game.levels[index].zones_arr[game.levels[index].urls_arr[i]] = json
        }
        display.stopwatch.restart()
        game.current_level = game.levels[index]
        let default_room = game.levels[index].default_room
        display.DOM[4].style.display = "block"
        display.activeMenu = "map"
        game.world.setup(game.levels[index].zones_arr[default_room]);

        display.buffer.canvas.height = game.world.rendered_height;
        display.buffer.canvas.width = game.world.rendered_width;
        display.buffer.imageSmoothingEnabled = false;
        resize()
    }

    display.buffer.canvas.height = game.world.rendered_height;
    display.buffer.canvas.width = game.world.rendered_width;
    display.buffer.imageSmoothingEnabled = false;

    let images = [
        "tileset.png",
        // "tileset2.png",
        "Dude_Monster/Dude_Monster_Idle_4.png",
        "Dude_Monster/Dude_Monster_Jump_8.png",
        "Dude_Monster/Dude_Monster_Run_6_left.png",
        "Dude_Monster/Dude_Monster_Run_6.png",
        "Dude_Monster/Dude_Monster_Idle_4_left.png",
        "png/question_mark.png",
        "png/question_mark_2.png",
        "Dude_Monster/Dude_Monster_Death_8.png",
        "Tiles/lava.png",
        "Tiles/key.png",
        "Tiles/note.png",
        "Rabbit/rabbit-trap.png"
    ];

    (async() => {
        for (let i = 0; i < images.length; i++){
            let res =  await request.loadImages(images[i])
            console.log(res.url)
            let img = new Image()
            img.src = res.url
            assets_manager.tile_set_images.push(img)
        }
        
        let response = await  request.profileRequest()
        console.log(response.status)
        resize();
        if (response.status == 200){
            display.activeMenu = "levelsMenu"
            display.drawLevelsMenu(request.getLevels())
        }
        else{
            display.activeMenu = "firstMenu"
            display.drawOptions()
        }
            
        engine.start();
    })()


})



