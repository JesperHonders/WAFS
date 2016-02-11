/*global console, alert, $, window, document, microAjax, routie, routes, api*/

// SCRIPT.JS

(function () {
    'use strict';
    
    var app = {
        init: function () {
            routes.init();
        }
    };
    
    var routes = {
        init: function () {
            routie('Home');
            routie({
                'Home': function () {
                    sections.toggle(window.location.hash);
                    api.init();
                },
                'Tracks': function () {
                    sections.toggle(window.location.hash);
                    api.tracks();
                },
                ':id': function () {
                    sections.toggle('#Detail');
                    api.trackDetail(window.location.hash);
                },
                'Upload': function () {
                    sections.toggle(window.location.hash);
                }
            });
        }
    };
    
    var api = {
        init: function () {
            microAjax('http://api.soundcloud.com/users/10348974?client_id=8ff8cbbd4addabd63eecc2ae59016952', function (res) {
                var data = JSON.parse(res);
                
                var homeData = {
                    username: data.username,
                    avatar: data.avatar_url,
                    city: data.city,
                    country: data.country,
                    permalink: data.permalink_url,
                    playlistCount: data.playlist_count,
                    uri: data.uri
                };
                
                var directive = {
                    avatar: {
                        src: function (params) {
                            return this.avatar;
                        },
                        alt: function (params) {
                            return this.username;
                        }
                    }
                };
                
                var template = document.getElementById('Home');
                Transparency.render(template, homeData, directive);
            });
        },
        tracks: function () {
            microAjax('http://api.soundcloud.com/playlists/4565422?client_id=8ff8cbbd4addabd63eecc2ae59016952', function (res) {
                var data = JSON.parse(res);
                
                // FILTER
                var filtered = _.map(data.tracks, function (items) {
                    return _.pick(items, 'title', 'artwork_url', 'genre', 'id', 'user_id');
                });
                  
                var tracksData = {
                    artwork: data.artwork_url,
                    artist: data.user.username,
                    album: data.title,
                    tracks: data.tracks,
                    title: data.title,
                    link: data.permalink_url
                };
                
                var directive = {
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
                };
                
                var template = document.getElementById('Tracks');
                Transparency.render(template, tracksData, directive);
            });
            
        },
        trackDetail: function (id) {
            var split = id.split('#');
            microAjax('http://api.soundcloud.com/tracks/' + split[1] + '?client_id=8ff8cbbd4addabd63eecc2ae59016952', function (res) {
                var data = JSON.parse(res);
                
                var songData = {
                    title: data.title,
                    artwork: data.artwork_url,
                    genre: data.genre,
                    link: data.permalink_url
                };
                
                var directive = {
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
                    client_id: "8ff8cbbd4addabd63eecc2ae59016952"
                });
                SC.stream('/tracks/' + split[1]).then(function (player) {
                    player.play();
                });
                
                var template = document.getElementById('Detail');
                Transparency.render(template, songData, directive);
            });
        }
    };
    
    var sections = {
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