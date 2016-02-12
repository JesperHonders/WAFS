/*global console, alert, $, window, document, microAjax, routie, routes, api*/

// SCRIPT.JS

(function () {
    'use strict';
    
    var app = {
        init: function () {
            routes.init();
        }
    },
    
		routes = {
			init: function () {
				routie('home');
				routie({
					'home': function () {
						sections.toggle(window.location.hash);
						api.init();
					},
					'tracks': function () {
						sections.toggle(window.location.hash);
						api.tracks();
					},
					':id': function () {
						sections.toggle('#detail');
						api.trackDetail(window.location.hash);
					},
					'upload': function () {
						sections.toggle(window.location.hash);
					}
				});
			}
		},
    
		api = {
			init: function () {
				microAjax('http://api.soundcloud.com/users/10348974?client_id=8ff8cbbd4addabd63eecc2ae59016952', function (res) {
					var data = JSON.parse(res),

						homeData = {
							username: data.username,
							avatar: data.avatar_url,
							city: data.city,
							country: data.country,
							permalink: data.permalink_url,
							playlistCount: data.playlist_count,
							uri: data.uri
						},

						directive = {
							avatar: {
								src: function (params) {
									return this.avatar;
								},
								alt: function (params) {
									return this.username;
								}
							}
						},

						template = document.getElementById('home');
					Transparency.render(template, homeData, directive);
				});
			},
			tracks: function () {
				microAjax('http://api.soundcloud.com/playlists/4565422?client_id=8ff8cbbd4addabd63eecc2ae59016952', function (res) {
					var data = JSON.parse(res),

					// FILTER
						filtered = _.map(data.tracks, function (items) {
							return _.pick(items, 'title', 'artwork_url', 'genre', 'id', 'user_id');
						}),

						tracksData = {
							artwork: data.artwork_url,
							artist: data.user.username,
							album: data.title,
							tracks: data.tracks,
							title: data.title,
							link: data.permalink_url
						},

						directive = {
							artwork: {
								src: function (params) {
									return this.artwork;
								},
								alt: function (params) {
									return this.title;
								}
							},
							tracks: {
								title: {
									href: function (params) {
										return '#' + this.id;
									}
								}
							}
						},

						template = document.getElementById('tracks');
					Transparency.render(template, tracksData, directive);
				});

			},
			trackDetail: function (id) {
				var split = id.split('#');
				microAjax('http://api.soundcloud.com/tracks/' + split[1] + '?client_id=8ff8cbbd4addabd63eecc2ae59016952', function (res) {
					var data = JSON.parse(res),

						songData = {
							title: data.title,
							artwork: data.artwork_url,
							genre: data.genre,
							link: data.permalink_url
						},

						directive = {
							link: {
								href: function (params) {
									return this.link;
								}
							},
							artwork: {
								src: function (params) {
									return this.artwork;
								},
								alt: function (params) {
									return this.title;
								}
							}
						};

					console.log(data);

					// STREAMER
					SC.initialize({
						client_id: '8ff8cbbd4addabd63eecc2ae59016952'
					});
					SC.stream('/tracks/' + split[1]).then(function (player) {
						player.play();
					});

					var template = document.getElementById('detail');
					Transparency.render(template, songData, directive);
				});
			}
		},
    
		sections = {
			toggle: function (route) {

				var sectionList = document.querySelectorAll('section'),
					routeSplit = route.split('#');
				console.log(routeSplit[1]);

				Array.prototype.forEach.call(sectionList, function (sectionList) {
					sectionList.classList.remove('active');
				});

				document.getElementById(routeSplit[1]).classList.add('active');

			}
		};
    
    app.init();
    
}());