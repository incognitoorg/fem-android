define(function(require) {
	
	var mode='dev';
	
	if(mode==='dev'){
		return {
			API_URL : "https://fem-dev.appspot.com/",
			FB_APP_ID : '605170889512500', 
			GOOGLE_CLIENT_ID : '675356629669.apps.googleusercontent.com',
			GOOGLE_CLIENT_SECRET : "Bwu0aGqqmwTPAEmmj9Z2DLKQ",
			GOOGLE_API_KEY : 'AIzaSyCxvFWYp8uk3RxCSEaVEo_FLYeqQVUelpg',
			GOOGLE_API_SCOPE : 'https://www.googleapis.com/auth/userinfo.profile https://www.google.com/m8/feeds'
			
		};
	}
});


