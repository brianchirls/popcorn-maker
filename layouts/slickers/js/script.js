(function() {

	var controls,
		progress,
		progressOuter,
		playButton,
		map,
		video,
		videoContainer,
		videoPaused = true,
		allLoaded = false,
		activeEvents = [];

	function getElementPosition(element) {
		var parent = element,
			x = element.offsetLeft,
			y = element.offsetTop;


		while (parent.offsetParent) {
			parent = parent.offsetParent;
			x += parent.offsetLeft;
			y += parent.offsetTop;
		}
		
		return {
			x: x,
			y: y
		};
	}
	
	function setUpMap() {
		google.maps.event.addListener(map, 'dragstart', function() {
			var endListener;

			function dragEnd() {
				google.maps.event.removeListener(endListener);
				video.style.opacity = '';
				if (!videoPaused) {
					video.play();
				}
			}

			endListener = google.maps.event.addListener(map, 'dragend', dragEnd);

			if (!video.paused) {
				video.pause();
			}
			//video.style.opacity = '0';
		});

		if (video.readyState >= 3) {
			setTimeout(function() {
				document.getElementById('map').style.visibility = '';
//					videoContainer.style.opacity = 0.5;
			}, 500);
			//videoPaused = false;
			//video.play();
		}
	}

	function doFadeyThing() {
		var i, recent = -5;
		
		for (i = 0; i < activeEvents.length; i++) {
			recent = Math.max(activeEvents[i].start, recent);
		}
		
		if (video.currentTime - recent  < 1) {
			videoContainer.style.opacity = 0.1;
		} else {
			videoContainer.style.opacity = 1;
		}

	}
	
	function markerLoaded(options) {
		if (!map) {
			map = options.map;
			setUpMap();
		}			
	}
	
	function markerStart(options) {
		activeEvents.push(options);			
		activeEvents[0].onFrame = doFadeyThing;
	}

	function markerEnd(options) {
		var index = activeEvents.indexOf(options);
		if (index >= 0) {
			activeEvents.splice(index, 1);
		}
		
		options.onFrame = null;
		
		if (activeEvents.length) {
			activeEvents[0].onFrame = doFadeyThing;
		}
	}
	
	function videoLoading() {
		var range, ranges = video.buffered, max = 0;
		
		for (i = 0; i < ranges.length; i++) {
			max = Math.max(ranges.end(i));
		}
		
		progressOuter.style.width = (320 * max / video.duration) + 'px';
		
		if (max === video.duration) {
			video.removeEventListener('progress', videoLoading, false);
		}
	}

	window.addEventListener('DOMContentLoaded', function() {
		controls = document.getElementById('controls');
		video = document.getElementById('video');
		videoContainer = document.getElementById('video-container');
		progress = document.getElementById('progress');
		progressOuter = document.getElementById('progress-outer');
		playButton = document.getElementById('play-button');
/*			
		var latlng = new google.maps.LatLng(-34.397, 150.644);
		map = new google.maps.Map(document.getElementById("map"), {
			zoom: 8,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
*/			
		var videoHover = false;
		window.addEventListener('mousemove', function (e) {
		//http://www.quirksmode.org/js/events_properties.html#position
			var event = e || window.event;
			var vpos = getElementPosition(video);
			var mouseX, mouseY;
			var x0 = vpos.x,
				y0 = vpos.y,
				x1 = video.offsetWidth + x0,
				y1 = video.offsetHeight + y0 - 30;
			
			mouseX = event.pageX;
			mouseY = event.pageY;
			
			if (mouseX >= x0 && mouseX <= x1 &&
				mouseY >= y0 && mouseY <= y1) {
				if (!videoHover && video.currentTime) {
					video.setAttribute('class', 'hover');
					videoHover = true;
				}
			} else if (videoHover) {
				video.removeAttribute('class');
				videoHover = false;
			}

		}, false);
		
		video.addEventListener('timeupdate', function() {
			progress.style.width = (320 * video.currentTime / video.duration) + 'px';
		}, false);

		video.addEventListener('play', function() {
			playButton.setAttribute('class', 'playing');
		}, false);
		
		video.addEventListener('pause', function() {
			playButton.removeAttribute('class');
		}, false);
		
		video.addEventListener('progress', videoLoading, false);
		
		video.addEventListener('canplaythrough', function() {
			setTimeout(function() {
				document.getElementById('map').style.visibility = '';
//					videoContainer.style.opacity = 0.5;
			}, 500);

			return;
			if (map) {
				videoPaused = false;
				video.play();
			}
		}, false);

		playButton.addEventListener('click', function() {
			if (video.paused) {
				videoPaused = false;
				video.play();
				videoContainer.style.opacity = '';
			} else {
				videoPaused = true;
				video.pause();
			}
		}, false);

		var p = Popcorn('#video');

		p.slickers({
			start: 4,
			end: 10,
			location: '﻿﻿5105 genoa street, oakland, ca',
			lat: 37.80436370,
			lng: -122.27111370,
			label: 'Secret Garden',
			target: 'map',
			onLoad: markerLoaded,
			onStart: markerStart,
			onEnd: markerEnd
		});

		p.slickers({
			start: 14,
			end: 20,
			location: '﻿﻿1580 5th Street, oakland, ca',
			lat: 37.8047831,
			lng: -122.29823920000001,
			label: 'Annex Farm',
			target: 'map',
			onLoad: markerLoaded,
			onStart: markerStart,
			onEnd: markerEnd
		});

		p.slickers({
			start: 23,
			end: 29,
			location: '﻿﻿537 Lewis Street, oakland, ca',
			lat: 37.805487,
			lng: -122.29842300000001,
			label: 'West Oakland Woods',
			target: 'map',
			onLoad: markerLoaded,
			onStart: markerStart,
			onEnd: markerEnd
		});

		p.slickers({
			start: 31,
			end: 37,
			location: '﻿﻿16th Street and Center Street, oakland, ca',
			lat: 37.8125818,
			lng: -122.29236559999998,
			label: 'Center Street Farm',
			target: 'map',
			onLoad: markerLoaded,
			onStart: markerStart,
			onEnd: markerEnd
		});

	}, false);


}());