// require files
var twitter = require("twitter");
var twitterKeys = require("./keys.js");
var spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

// stores arguments input by user
var args = process.argv;
var command = args[2];
var thing = args[3];

// spotify dev credentials
var Spotify = new spotify({
	id: "52caef0bff904ae69a196e557716333e",
	secret: "3c7d8d519cae4e04859c11e24f428696"
});

function liri() {
	switch (command) {
		// gets last 20 tweets from dummy twitter account
		case "my-tweets":
			var client = new twitter(twitterKeys);
			var params = {screen_name: "maximusunc"};
			client.get("statuses/user_timeline", params, function(error, tweets, response) {
				if (!error) {
					// iterate through tweets and console each one out
					for (var i = 0; i < tweets.length; i++) {
						var tweet = "Tweet #" + (i + 1) + ": " + tweets[i].text;
						console.log(tweet);
						// append info to log.txt
						fs.appendFile("log.txt", tweet + "\n", (err) => {
							if (err) {
								throw err;
							};
						});
					};
				};
			});
			break;
		case "spotify-this-song":
			// if no song is specified, default to this value
			if (thing === undefined) {
				thing = "The Sign by Ace of Base";
			};
			// Searches and returns the first song spotify gives back
			Spotify.search({
				type: "track",
				query: thing
			}, function(err, data) {
				if (err) {
					return console.log("Error at: " + err);
				};
				var artist = "Artist: " + data.tracks.items[0].artists[0].name;
				var track = "Track Name: " + data.tracks.items[0].name;
				var preview = data.tracks.items[0].preview_url;
				var album = "Album Name: " + data.tracks.items[0].album.name;
				console.log(artist);
				console.log(track);
				// if there is no preview url, don't write anything
				if (preview !== null) {
					console.log("Preview URL: ", preview);
				};
				console.log(album);
				// append the info to log.txt
				fs.appendFile("log.txt", artist + "\n" + track + "\nPreview URL: " + preview + "\n" + album + "\n", (err) => {
					if (err) {
						throw err;
					};
				});
			});
			break;
		case "movie-this":
			// if no movie is given, default to this value
			if (thing === undefined) {
				thing = "Mr. Nobody";
			};
			// searches omdb for the movie specified
			request("http://www.omdbapi.com/?apikey=40e9cece&t=" + thing, function(error, response, body) {
				if (error) {
					console.log("Error: ", error);
				};
				var movie = JSON.parse(body);
				var title = "Title: " + movie.Title;
				var year = "Released: " + movie.Year;
				var imdb = "IMDB Rating: " + movie.imdbRating;
				var produced = "Produced In: " + movie.Country;
				var lang = "Language: " + movie.Language;
				var plot = "Plot: " + movie.Plot;
				var actors = "Actors: " + movie.Actors;
				console.log(title);
				console.log(year);
				console.log(imdb);
				// if there is no rotten tomatoes rating, don't write
				if (movie.Ratings[1] !== undefined) {
					var rotten = "Rotten Tomatoes: " + movie.Ratings[1].Value;
					console.log(rotten);
				} else {
					var rotten = "Rotten Tomatoes: Not Rated";
					console.log(rotten);
				};
				console.log(produced);
				console.log(lang);
				console.log(plot);
				console.log(actors);
				// append the info to log.txt
				fs.appendFile("log.txt", title + "\n" + year + "\n" + imdb + "\n" + rotten + "\n"
					 + produced + "\n" + lang + "\n" + plot + "\n" + actors + "\n", (err) => {
					if (err) {
						throw err;
					};
				});
			});
			break;
		case "do-what-it-says":
			// reads whatever is in the random txt file
			fs.readFile("random.txt", "utf8", function(err, data) {
				if (err) {
					console.log("Error: ", err);
				};
				var arr = data.split(",");
				command = arr[0];
				thing = arr[1];
				// rules out my-tweets
				if (thing !== undefined) {
					thing = thing.slice(1, -1);
				};
				// calls the whole switch cases again with random txt values
				liri();
			});
			break;
		// if user didn't put in a correct input
		default: 
			console.log("Sorry, I didn't understand your input. Please try again");
			break;
	};
};

// after the file loads, run the switch cases
liri();