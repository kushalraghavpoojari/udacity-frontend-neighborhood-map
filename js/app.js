var map;
if (!window.google || !window.google.maps){
  $('#map').text('Google Maps data could not be loaded');
}

var initLocations = [
  {
    name: 'University of Central Florida',
    lat: 28.602427,
    lng: -81.200060,
    street: '4000 Central Florida Blvd',
    City: 'Orlando',
    State:'FL',
    Country: 'United States'
  }, {
    name: 'Knights Library',
    lat: 28.597075,
    lng: -81.221938,
    street: 'University Blvd',
    City: 'Orlando',
    State:'FL',
    Country: 'United States'
  }, {
    name: 'Buffalo Wild Wings',
    lat: 28.597051,
    lng: -81.222770,
    street: 'University Blvd',
    City: 'Orlando',
    State:'FL',
    Country: 'United States'
  }, {
    name: 'Lazy Moon',
    lat: 28.598351,
    lng: -81.219714,
    street: 'University Blvd',
    City: 'Orlando',
    State:'FL',
    Country: 'United States'
  }, {
    name: 'Chipotle Mexican Grill',
    lat: 28.597173,
    lng: -81.216465,
    street: 'University Blvd',
    City: 'Orlando',
    State:'FL',
    Country: 'United States'
  }, {
    name: 'Siemens Energy Inc.',
    lat: 28.603497,
    lng: -81.210757,
    street: '3501 Quadrangle Blvd',
    City: 'Orlando',
    State:'FL',
    Country: 'United States'
  }, {
    name: 'CFE Arena',
    lat: 28.607225,
    lng: -81.197367,
    street: '12777 Gemini Blvd N',
    City: 'Orlando',
    State:'FL',
    Country: 'United States'
  }, {
    name: 'Lake Claire',
    lat: 28.608990,
    lng: -81.202977,
    street: 'Mc Culloch Road',
    City: 'Orlando',
    State:'FL',
    Country: 'United States'
  },{
    name: 'World of Beer',
    lat: 28.598445,
    lng: -81.220965,
    street: 'University Blvd',
    City: 'Orlando',
    State:'FL',
    Country: 'United States'
  },{
    name: 'Recreation and Wellness Center',
    lat: 28.596132,
    lng: -81.199369,
    street: '4000 Central Florida Blvd',
    City: 'Orlando',
    State:'FL',
    Country: 'United States'
  }
];

$('#ham').on('click', function() {
  $('#mobile-search').toggleClass('display');
});

var Location = function(location) {
  var self = this;
  this.name = location.name;
  this.showMarker = ko.observable(true);
  this.contentString = '<div><b>'+this.name+'</b></div>'+
                        '<div>'+location.street+'</div>'+
                        '<div>'+location.City+' - '+location.State+'</div>'+
                        '<div>'+location.Country+'</div>';
  this.infowindow = new google.maps.InfoWindow({
    content: self.contentString
  });
  this.marker = new google.maps.Marker({
    position: location,
    map: map,
    animation: google.maps.Animation.DROP
  });
  this.show = ko.computed(function() {
		if(!this.showMarker()) {
			this.marker.setVisible(false);
		} else {
      this.marker.setVisible(true);
    }
	}, this);
  if(!this.showMarker()) {
    self.marker.setVisible(false);
  }
  this.marker.addListener('click', function() {
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        self.marker.setAnimation(null);
    }, 3000);
    self.infowindow.setContent(self.contentString);
    self.infowindow.close();
    self.infowindow.open(map, this);
  });
  this.selectLocation = function() {
    $('#mobile-search').addClass('display');
    google.maps.event.trigger(self.marker, 'click');
  };
};

var ViewModel = function() {
  var self= this;
  this.filter = ko.observable("");
  this.locationsList = ko.observableArray([]);
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 28.604827, lng: -81.213169},
    zoom: 14
  });
  initLocations.forEach(function(locationItem) {
    self.locationsList.push(new Location(locationItem));
  });

  this.filterLocations = ko.computed(function() {
    var filter = this.filter().toLowerCase();
   if (!filter) {
         self.locationsList().forEach(function(location){
          location.showMarker(true);
        });
        return self.locationsList();
   } else {
       return $.grep(this.locationsList(), function(location) {
            var locationSearch = location.name.toLowerCase().indexOf(self.filter().toLowerCase());
            var showMarker =  locationSearch > -1 ;
            location.showMarker(showMarker);
            return showMarker;
          });
       }
   },self);

};

function initMap() {
  ko.applyBindings(new ViewModel());
}
