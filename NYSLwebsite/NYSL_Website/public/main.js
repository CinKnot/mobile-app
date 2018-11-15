var app = new Vue({
	el: "#app",
	data: {
		url: "https://api.myjson.com/bins/dloyu",
		games: [],
		allGames: [],
		teams: [],
		locations: [],
		allLocations: [],
		locationNames: [],
		selectedLocation: '',
		selectedTeam: '',
		currentView: "index",
		name: 'login',
		userLogged: false,
		loadingPost: false,
		messages: [],



	},
	created() {
		this.getGamesData();
	},
	methods: {
		getGamesData() {

			fetch(this.url, {
					method: "GET",
				})
				.then(r => r.json())
				.then(json => {
					console.log(json);
					data = json;
					app.games = json.games;
					app.allGames = json.games;
					app.teams = json.teams;
					app.locations = json.locations;
					app.allLocations = json.locations;
					app.getTheKeysForLocations();
					console.log(app.teams);
					app.getPosts();


				})
		},
		getSelectedGames(team) {

			this.currentView = 'schedule'
			var games = this.allGames;
			var filteredGames = [];
			for (var i = 0; i < games.length; i++) {
				if (games[i].teams.host == team || games[i].teams.visitor == team) {
					filteredGames.push(games[i]);
				}
			}
			if (team == "all") {
				filteredGames = this.allGames;
			}
			this.games = filteredGames;
		},


		getTheKeysForLocations() {
			var locations = app.locations;
			console.log(locations)
			var keys = [];
			for (var key in locations) {
				keys.push(key)
			}
			app.locationNames = keys;
		},
		getSelectedLocations(loc) {
			this.currentView = 'locationMap'
			var locations = this.allLocations;
			var selectedLocation = locations[loc];
			app.selectedLocation = selectedLocation;
		},
		setcurrentView(view) {
			console.log(view)
			this.currentView = view;
			console.log(this.currentView)
			if (this.currentView == 'chat') {
				firebase.auth().onAuthStateChanged(function (user) {
					console.log(user != null)
					if (user != null) {
						console.log("user signed in")
						// User is signed in.
						app.userLogged = true;
						app.getPosts();
					} else {
						// No user is signed in.
						app.userLogged = false;

					}
				});

			}
			console.log(this.currentView)
		},
		login() {
			var provider = new firebase.auth.GoogleAuthProvider();

			firebase.auth().signInWithPopup(provider);

			console.log("login");
			app.getPosts();
			app.userLogged = true;

		},
		writeNewPost() {

			if (!$("#textInput").val()) {
				return
			}
			const text = document.getElementById("textInput").value;
			const userName = firebase.auth().currentUser.displayName;
			const email = firebase.auth().currentUser.email;
			const photoURL = firebase.auth().currentUser.photoURL;


			var post = {
				name: userName,
				body: text,
				email: email,
				image: photoURL,
			};

			const newPostKey = firebase.database().ref().child('chat').push().key;

			var updates = {};
			updates["/chat/" + newPostKey] = post;
			document.getElementById("textInput").value = "";

			return firebase.database().ref().update(updates);
			app.getPosts();
		},
		getPosts: function () {
			firebase.database().ref('chat').on('value', function (data) {

				var userEmail = firebase.auth().currentUser.email;

				var posts = document.getElementById("posts");

				var messages = data.val();
				console.log(data.val())
				var allPosts = [];


				for (var key in messages) {
					let element = messages[key];

					if (element.email == userEmail) {
						element["user"] = "hostpost";
					} else {
						element["user"] = "otherpost";
					}
					allPosts.push(element);

				}
				app.messages = allPosts;
				//				setTimeout(function () {
				//					$("#chat-window").scrollTop($("#chat-window").scrollHeight)
				//				})
				setTimeout(function () {
					$("#chat-window").animate({
						scrollTop: $("#chat-window").prop("scrollHeight")
					});
//					app.loadingPost = false;
				}, 500)
//				console.log(app.messages)
				console.log("getting posts");

			})
		},
		logout() {
			firebase.auth().signOut();
			app.userLogged = false;
		},
	}

});
