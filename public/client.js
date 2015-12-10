


$(function(){
  


function initialize() {

  var markers = [];
  

  function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
  }

  function showPosition(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;

      // Map options here
      var mapOptions = {
        center: { lat:position.coords.latitude, lng:position.coords.longitude},
        zoom: 19,
        disableDefaultUI:true
      };


      $.post('/locate', {latitude:latitude, longitude:longitude}, function (data) {
        console.log(data);
      });


      // Create a new map that gets injected into #map in our HTML
    var map = new google.maps.Map(document.getElementById('map'),
        mapOptions); 
    map.set("styles",[{featureType:"all",elementType:"labels.text.fill",stylers:[{color:"#ffffff"}]},{featureType:"all",elementType:"labels.text.stroke",stylers:[{color:"#000000"},{lightness:13}]},{featureType:"administrative",elementType:"geometry.fill",stylers:[{color:"#000000"}]},{featureType:"administrative",elementType:"geometry.stroke",stylers:[{color:"#144b53"},{lightness:14},{weight:1.4}]},{featureType:"landscape",elementType:"all",stylers:[{color:"#08304b"}]},{featureType:"poi",elementType:"geometry",stylers:[{color:"#0c4152"},{lightness:5}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#000000"}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#0b434f"},{lightness:25}]},{featureType:"road.arterial",elementType:"geometry.fill",stylers:[{color:"#000000"}]},{featureType:"road.arterial",elementType:"geometry.stroke",stylers:[{color:"#0b3d51"},{lightness:16}]},{featureType:"road.local",elementType:"geometry",stylers:[{color:"#000000"}]},{featureType:"transit",elementType:"all",stylers:[{color:"#146474"}]},{featureType:"water",elementType:"all",stylers:[{color:"#021019"}]}]);




    // Scan Btn
    $("#scanbtn").on("click", function(){

        //Remove all markers. Reset
        markers= [];

        $.get("/scan", function(data){


            for (var i = 0; i < data.length; i++) {


              var coords = (new google.maps.LatLng(Number(data[i].location.coordinates[0]), Number(data[i].location.coordinates[1])))

             console.log(coords);



              addMarker(coords);
             
            }; 


        });

        


    });


      // addMarker function 
        function addMarker(coords) {

          // Create new marker at event click location and inject into map
          var marker = new google.maps.Marker({
            position: coords,
            map: map
          });

          
          markers.push(marker);
          console.log(coords);
          console.log(marker);

        }


  }    





  getLocation();

  // window.setInterval(getLocation, 30000);

  

}

// Load it into DOM
google.maps.event.addDomListener(window, 'load', initialize);




});
