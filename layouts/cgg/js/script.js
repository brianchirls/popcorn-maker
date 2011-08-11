(function() {
	console.log('hi!');
	
	/*
		we expect one popcorn instance to be loaded by now. right?
	*/

	//var popcorn = Popcorn('#video', { frameAnimation: true } );
	var popcorn = Popcorn.instances[0];
	
	var Butter, butter, client;
	if (window.parent && window.parent.Butter) {
		Butter = window.parent.Butter
		//butter = new Butter();
		client = new Butter.CommClient('cgg');
		client.listen( "updatetrackevent", function( message ) {
			console.log("updatetrackevent", message);
		});

		client.listen( "updatetrackevent", function( message ) {
			console.log("updatetrackevent", message);
		});

	}

return;
	//get list of photos from flickr
	var apikey = '3b1a167af8d3b3a1874f50fba0860093';
	
	var toLoad = 0, loaded = 0;
	var flickrData;
	var time = 0.5;
	var r = Math.random;
	
	window.imageLoaded = function (option) {
		toLoad--;
		loaded++;
		if (!toLoad) {
			if (loaded > 20 || loaded >= popcorn.duration() ) {
				popcorn.play();
			}
			load();
		}
	}
		
	function load() {
		var i;
		for (i = 0; i < 10 && i < flickrData.length && time < popcorn.duration(); i++) {

			popcorn.fkb({
				start: time,
				end: time + 2 + Math.random() * 3,
				id: flickrData[0].id,
				apikey: apikey,
				target: 'container',
				startPosition: [
					5 + r() * 90,
					5 + r() * 80,
					5 + r() * 40
				],
				endPosition: [
					5 + r() * 90,
					5 + r() * 80,
					5 + r() * 40
				],
				onLoad: 'imageLoaded'
			});
	
			flickrData.shift();
			toLoad++;
			time += 2;
		}
		
		console.log('loading ' + toLoad + ' more');
	}

	document.getElementById('go').disabled = false;

	function doSearch(term) {
		var url, search;
		if (typeof term === 'string') {
			search = term;
		} else {
			search = document.getElementById('search').value;
		}
		if (!search) {
			return;
		}
		
		url = 'http://api.flickr.com/services/rest/?lang=en-us&format=json&jsoncallback=flickr&method=flickr.photos.search&api_key=' + apikey + '&text=' + encodeURIComponent(search) + '&safe_search=1&sort=interestingness-desc&jsoncallback=flickr';

		this.disabled = true;

		Popcorn.xhr.getJSONP( url, function( data ) {
			if (!data.photos) {
				return;
			}
			
			document.getElementById('form').style.display = 'none';
			
			flickrData = data.photos.photo;
//			load();
		});
	}

	if (window.location.hash) {
		doSearch(window.location.hash.substr(1));
	}
	document.getElementById('go').addEventListener('click', doSearch, false);
}());
