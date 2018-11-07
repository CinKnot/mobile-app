var app = new Vue({
	el: "#app",
	data: {
		games: [],
		teams: [],

	},
	created() {
		this.getGamesData();
	},
	methods: {
		getGamesData() {

			fetch("https://api.myjson.com/bins/1euxou", {
					method: "GET",
				})
				.then(r => r.json())
				.then(json => {
					console.log(json);
					data = json;
					app.games = json.games;
					app.teams = json.teams;
				
				})
		}

	},
	//	computed: {
	//		filteredBooks: function () {
	//			return this.books.filter((book) => {
	//				return book.titulo.match(this.search);
	//				return book.descripcion.match(this.search);
});
//}
//}
//})
