$(document).ready(function() {

	var fourpoc = {

		/* Used to get lat & long for addresses */
		geocoder: new google.maps.Geocoder(),

		// Things to do when the page loads, like figuring out if we're supposed
		// to find the location based on the browser's location or a location in the location hash
		init: function() {
			var _this = this;

			// If a location hash is present, use that as a query, else figure the location out normally
			if (location.hash != '') {
				this.codeAddress(unescape(location.hash.replace('#', '')));
			}
			else {

				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition( 
						function (position) {  
							_this.getFourpocalypses(position.coords.latitude, position.coords.longitude);
						}, 
						function (error) {
							$('.loading').hide();
						}
					);
				}
				else {
					$('.loading').hide();
				}
			}

			// Hook up element events
			$('#searchform').submit(function(ev) {
				ev.preventDefault();
				_this.codeAddress($('#cityinput').val());
			});

		},

		/* Make a call to Foursquare to find -pocalypses around the given lat & long */
		getFourpocalypses: function(lat, long, formatted_address) {

			// Get the list of fourpocalypses around the given coordinates
			$.getJSON('getfourpocalypses.php', { 'latitude': lat, 'longitude': long }, 
				function(data) {

					var list = $('#fourpocalypses');
					list.html('');

					var howmany = data.length;

					list.append(
						'<div class="smallerheader">There' +
						((howmany == 1) ? ' is ' : ' are ') + 
						((howmany > 0) ? howmany : ' no ' ) +
						' fourpocalypse' + ((howmany == 1) ? '' : 's') + 
						((formatted_address !== undefined) ? ' near ' + formatted_address : ' nearby') + '.</div>'
					);

					// Loop through the returned venues and add their details to the results list
					$.each(data, function(index, element) {
						var name = element.name;
						var stats = element.stats;
						var hereNow = element.hereNow;
						var location = element.location;

						// Icon image
						if (element.categories.length > 0) {
							var icon = element.categories[0].icon;
							var iconimage = icon.prefix + '64' + icon.name;
						}
						else {
							var iconimage = 'https://foursquare.com/img/categories/none_64.png';
						}

						var html = '<div class="result">';
						html += '<div class="iconholder"><img src="' + iconimage + '" /></div>';

						// Name
						if (name) {
							html += '<a class="venuename" href="http://foursquare.com/v/' + element.id + '" target="_blank">' + name + '</a>';
						}

						// Location
						var address = location.address;
						var city = location.city;

						if ((address !== undefined) && (city !== undefined)) {
							html += '<br />' 
								+ ((address !== undefined) ? address : '') 
								+ (((address !== undefined) && (city !== undefined)) ? ', ' : '')
								+ ((city !== undefined) ? city : '');
						}

						// Checkin count
						if (stats) {
							html += '<br />' + stats.checkinsCount + ' Checkin' + ((stats.checkinsCount > 1) ? 's' : '');
						}

						// People here now
						if (hereNow && hereNow.count > 0) {
							html += '<br />' + hereNow.count + ((hereNow.count > 1) ? ' people are ' : ' person is ') + 'here right now';
						}

						html += '<br class="clear" /></div>';

						list.append(html);
					});

					$('.morefourpocalypse').html('Wanna find more fourpocalypses?');
					$('.loading').hide();
				}
			);
		},

		/* Request the latitude and longitude for a given address*/
		codeAddress: function(query) {
			var _this = this;

			if (query == '') {
				alert('Please enter a location');
			}
			else {
				$('.loading').show();
				$('#fourpocalypses').html('');
				this.geocoder.geocode( { 'address': query }, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						location.hash = escape(query);
						_this.getFourpocalypses(results[0].geometry.location.lat(), results[0].geometry.location.lng(), results[0].formatted_address);
					}
					else {
						alert("Geocode was not successful for the following reason: " + status);
					}
				});
			}
		}
	}

	// Kick off the pocalypse
	fourpoc.init();
});
