const Request = function(){
    
    this.loginRequest = async function(){
        let user = {
            "login" : document.getElementById('login').value,
            "password" : document.getElementById('password1').value,
        }
        console.log(JSON.stringify(user))
        let response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        });
        let result = await response.json();
    }
    this.signupRequest = async function(){
        let user = {
            "login" : document.getElementById('login').value,
            "password" : document.getElementById('password1').value,
        }
        let response = await fetch('/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        });
        let result = await response.json();
        return response
    }
    this.profileRequest = async function(){
        let response = await fetch('/auth/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
        });
        return response
    }
    this.loadImages = async function (url){
        let result = await fetch(url, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json;charset=utf-8'
            },
        });
        return result
    }
    this.logoutRequest = async function(){
        let response = await fetch('/auth/logout', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
        });
        let result = await response.json();
    }
    this.mapCompletedRequest = async function(level, seconds, minutes, ms){
        let data = {
            level : level,
            seconds : seconds,
            minutes : minutes,
            ms      : ms,
        }
        let response = await fetch('/stats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body : JSON.stringify(data)
        });
        let result = await response.json();
    }
    this.getLeaders = async function(level_index){
        let response = await fetch('/stats/' + level_index, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
        });
        let result = await response.json();
        return result
    }
    this.getLevels = async function(){
        let response = await fetch('stats/levels/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
        });
        let result = await response.json();
        return result
    }
}

Request.prototype = {
    constructor : Request,
}