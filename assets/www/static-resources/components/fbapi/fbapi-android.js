
/* MIT licensed */
// (c) 2010 Jesse MacFadyen, Nitobi
// Contributions, advice from : 
// http://www.pushittolive.com/post/1239874936/facebook-login-on-iphone-phonegap

function FBConnect() {
   
}

FBConnect.prototype.connect = function(client_id, redirect_uri, display) {
    this.client_id = client_id;
    this.redirect_uri = redirect_uri;

    var authorize_url = "https://graph.facebook.com/oauth/authorize?";
    authorize_url += "client_id=" + client_id;
    authorize_url += "&redirect_uri=" + redirect_uri;
    authorize_url += "&display=" + (display ? display : "touch");
    authorize_url += "&type=user_agent";
    //alert(1)
    var ref = window.open(authorize_url, '_blank', 'locatio');
    
    
    var self = this;
    
    ref.addEventListener('loadstart', function(event) {
    	alert('loadstart' + event.url); 
    	if(event.url.indexOf(redirect_uri)!==-1){

    		var access_token = event.url.split("access_token=")[1];
    		alert("Access_token:" + access_token);
    		/*var error_reason = event.url.split("error_reason=")[1];
    		if(access_token != undefined){                         
    			alert('success, token follows :');
    			self.accessToken= = access_token = access_token.split("&")[0];
    			ref.close();
    		}
    		if(error_reason != undefined){
    			alert('error occured');
    			ref.close();
    		}*/
    	}


    });
    
    ref.addEventListener('loadstop', function(event) { 
    	alert('loadstop' + event.url); 
    });
    
    ref.addEventListener('exit', function(event) { 
    	alert('exit' + event.url); 
    });
    ref.addEventListener('loaderror', function(event) { 
    	alert('loaderror' + event.url); 
    });
    
}

FBConnect.prototype.onLocationChange = function(newLoc) {
    if (newLoc.indexOf(this.redirect_uri) == 0) {
        var result = unescape(newLoc).split("#")[1];
        result = unescape(result);

        // TODO: Error Check
        this.accessToken = result.split("&")[0].split("=")[1];
        //this.expiresIn = result.split("&")[1].split("=")[1];

        window.close();
        this.onConnect();

    }
}

FBConnect.prototype.getFriends = function() {
    var url = "https://graph.facebook.com/me/friends?access_token=" + this.accessToken;
    var req = new XMLHttpRequest();

    req.open("get", url, true);
    req.send(null);
    req.onerror = function() {
        alert("Error");
    };
    return req;
}

// Note: this plugin does NOT install itself, call this method some time after deviceready to install it
// it will be returned, and also available globally from window.plugins.fbConnect
FBConnect.install = function() {
    if (!window.plugins) {
        window.plugins = {};
    }
    window.plugins.fbConnect = new FBConnect();
    return window.plugins.fbConnect;
} 



var client_id = "91320880376";
var redir_url = "http://www.facebook.com/connect/login_success.html";
var friendsMap = {};

function onBodyLoad()
{
        document.addEventListener("deviceready",onDeviceReady,false);                
}


/* When this function is called, PhoneGap has been initialized and is ready to roll */
function onDeviceReady()
{
        // do your thing!
        var fb = FBConnect.install();
        //This will popup the browser for user to login
        fb.connect(client_id,redir_url,"touch");
        fb.onConnect = onFBConnected;
}

//This function will get called once user has authorised
function onFBConnected()
{
        document.getElementById("loading").innerHTML = "Connected! Getting your friends ...";
        var req = window.plugins.fbConnect.getFriends();
        req.onload = onGotFriends;
}