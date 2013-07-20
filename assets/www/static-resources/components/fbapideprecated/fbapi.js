define(
    [ 'jquery', 
      'http://connect.facebook.net/en_US/all/debug.js'
      ], // remove "/debug" in live env
    function( $ ) 
    {

        $('body').append($('<div id="fb-root">'));
        

        // init the Facebook JS SDK
        FB.init( {
        	appId: '503776339657462', // http://localhost:8888
            //appId: '505558516167469', // http://fem1-vishwanath.appspot.com
            //channelUrl: 'http://localhost:8888/channel.html', // Channel File for x-domain communication
            status: true, // check the login status upon init?
            cookie: true, // set sessions cookies to allow your server to access the session?
            xfbml: true // parse XFBML tags on this page?
        } );


        // Additional initialization code such as adding Event Listeners goes here
        console.log( 'Facebook ready' );

        return FB;
    } 
);

