
/*
 * GET passes listing.
 */

exports.list = function(req, res){
	
	var recentPasses = [];
	var iss = require('./iss');
	var SpaceTrack = require('spacetrack');
	var spacetrack = new SpaceTrack({
	  username: 'johnnyclem@gmail.com',
	  password: 'WRr-yhu-bm3-96d'
	});
	var options = {
	  controller: 'basicspacedata', // defaults to 'basicspacedata'
	  action: 'query', // defaults to 'query'

	  type: 'tle', // required, must be one of the following:
	  // tle, tle_latest, tle_publish, omm, boxscore, satcat, 
	  // launch_site, satcat_change, satcat_debut, decay, tip, csm

	  query: [  // optional, but highly recommended
	    {field: 'NORAD_CAT_ID', condition: '25544'} // e.g. (see the API documentation)
	  ],

	  // predicates: [  // optional
	  //   'NORAD_CAT_ID', 'ORDINAL'
	  // ],
	  // 
	  // favorites: [  // optional
	  //   'Navigation'
	  // ],

	  orderby: [  // optional
	    '-EPOCH', // ascending by ORDINAL
	    // '-NORAD_CAT_ID' // descending by NORAD_CAT_ID
	  ],

	  limit: 5, // optional, but recommended
	  offset: 10, // optional (needs limit to be set, otherwise limit defaults to 100)

	  distinct: false // optional (this option causes some hiccups)
	};
	
	// basicspacedata/query/class/tle/format/tle/NORAD_CAT_ID/25544/orderby/EPOCH%20desc/limit/5
	
	spacetrack.get(options, function(err, result) {
		if (err) {
			console.log("Error connecting to Space-Track.Org")
		} else {
			recentPasses = result.data;
			position = iss.calculate(recentPasses[0]);
			res.send(recentPasses);
		}
	});	
};