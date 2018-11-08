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
		selectedLocation:'',
		selectedTeam: '',

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
					

				})
		},
		getSelectedGames(team) {
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
			var locations = this.allLocations;
			var selectedLocation = locations[loc];
			app.selectedLocation = selectedLocation;
		},
	},
	
});

