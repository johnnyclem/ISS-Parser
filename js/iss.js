function loadPasses() {
	loadJSON(function(response) {
		jsonresponse = JSON.parse(response);
		console.log(response);
	});
};

function calculate(tleData) {

};

function testData(tle1, tle2) {
	//  Sample TLE
	var tle_line_1              = '1 25544U 98067A   13149.87225694  .00009369  00000-0  16828-3 0  9031'
	var tle_line_2              = '2 25544 051.6485 199.1576 0010128 012.7275 352.5669 15.50581403831869'

	//  Set the Observer at 122.03 West by 36.96 North, in RADIANS
	var deg2rad = Math.PI / 180;
	var observer_coords_gd      = [(-122.0308)*deg2rad, (36.9613422)*deg2rad, .370];
	//  Get observer position in the ECF frame.
	var observer_coords_ecf     = satellite.geodetic_to_ecf (observer_coords_gd);

	//  Now to propagate a satellite's position and velocity.
	// var satrec                  = satellite.twoline2satrec (tle_line_1, tle_line_2);
	// var position_and_velocity   = satellite.sgp4 (satrec, time_since_tle_epoch_minutes);
	// OR YOU CAN USE
	var position_and_velocity   = satellite.propagate (satrec, year, month, date_of_month, hour, minute, second);
	var position_eci            = position_and_velocity[0];
	var velocity_eci            = position_and_velocity[1];

	var gmst                    = satellite.gstime_from_date (year, month, date_of_month, hour, minute, second);
	var position_ecf            = satellite.eci_to_ecf (position_eci, gmst);
	var doppler_factor          = satellite.doppler_factor (observer_coords_ecf, position_ecf, velocity_ecf);
	var look_angles             = satellite.ecf_to_look_angles (observer_coords_gd, position_ecf);

	//  Convert the RADIANS to degrees longitude and degrees latitude
	var position_gd             = satellite.eci_to_geodetic (position_eci, gmst);
	var longitude               = satellite.degrees_long (position_gd[0]);
	var latitude                = satellite.degrees_lat (position_gd[1]);
	
	console.log('Position: ' + position_gd);
};

function loadJSON(callback) {

	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', 'js/passes.json', true);
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(xobj.responseText);
		}
	}
	
	xobj.send(null);

};