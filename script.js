$(function() {

	var $spotifySearch = $('#spotify-search');

	var $newtrack = $('#newTrack');

	var $resultList = $('#resultList');

	var $songTemplate = _.template($('#song-template').html());

	function SongPost(song, artist, album) {
		this.song = song;
		this.artist = artist;
		this.album = album;
	};

	SongPost.all = [];

	SongPost.prototype.save = function() {
		SongPost.all.push(this);
	};

	SongPost.prototype.render = function() {
		var $songpost = $($songTemplate(this));
		this.index = SongPost.all.indexOf(this);
		$songpost.attr('data-index', this.index);
		$resultList.append($songpost);
	};

	_.each(SongPost.all, function(songpost, index){
		songpost.render();
	});

	$spotifySearch.on('submit', function(event){
		event.preventDefault();

		$('.songpost').remove();
		SongPost.all = [];

		var $newtrack = $('#newTrack').val();

		var spotifyAPI = "https://api.spotify.com/v1/search?type=track&q=" + $newtrack;
		$.get(spotifyAPI, function(data) {
			var itemsArray = data;
			_.each(itemsArray.tracks.items, function(track, i) {
				var album = track.album.name;
				var artist = track.artists[0].name;
				var trackName = track.name;

				var songpost = new SongPost(trackName, artist, album);

				songpost.save();
				songpost.render();
			});
		});

		$spotifySearch[0].reset();
		$('#newTrack').focus();

	});

});