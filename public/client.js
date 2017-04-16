var readyStatus = false,
    firstRound = true,
    exploreMode = false,
    markerSet = [],
    setCoords;


document.getElementById("send-status").onclick = function(){
  
  if(!readyStatus){
    this.style.background = "white";

    this.value = "message on";
    readyStatus = true;
  }else{
    this.style.background = "darkgrey";

    this.value = "message off";
    readyStatus = false;
  }
}



document.getElementById("explore").onclick = function(){

  if(!exploreMode){
      this.style.background = "white";


      $.get('/explore', function (data) {

          for (var i = 0; i < data.length; i++) {


              var marker = new google.maps.Marker({
                position: {lat: data[i].location.coordinates[0], lng: data[i].location.coordinates[1]},
                map: map
              });

              var circle = new google.maps.Circle({
                  center: {lat: data[i].location.coordinates[0], lng: data[i].location.coordinates[1]},
                  strokeColor: "yellow",
                  strokeOpacity: 0.1,
                  strokeWeight: 6,
                  fillColor: "yellow",
                  radius: 100,
                  map: map
                });


              attachMsg(marker, "Here is my Message");
             
              markerSet.push({marker: marker, circle: circle });

          }

      });

      this.value = "discover on"
      exploreMode = true;

  }else{
      this.style.background = "darkgrey";

      // loop through existing markers and set their map to null. We are going to do another look
      // up of messages when the users clicks explore mode at a later time using their new location
      for(var i = 0; i < markerSet.length; i++){
        markerSet[i].marker.setMap(null);
        markerSet[i].circle.setMap(null);
      }

      markerSet = [];
      // get rid of messages here, because when true the if statement above is met it will
      // fetch brand new data because prev location can be much different than current location
      this.value = "discover off"
      exploreMode = false;
  }
}




var attachMsg = function (marker, note) {
   var infowindow = new google.maps.InfoWindow({
        content: note
   });

   marker.addListener('click', function() {
       infowindow.open(marker.get('map'), marker);
   });
}



function initialize() {


      function getLocation() {
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(showPosition);
          }
      }
  

      function showPosition(position) {
          // Map options here
          var mapOptions = {
            center: { lat:position.coords.latitude, lng:position.coords.longitude},
            zoom: 16,
            disableDefaultUI:true
          };


          $.post('/locate', {latitude:position.coords.latitude, longitude:position.coords.longitude});


          // Create a new map that gets injected into #map in our HTML
          if(firstRound){
            map = new google.maps.Map(document.getElementById('map'), mapOptions);
            map.set("styles",[{featureType:"all",elementType:"labels.text.fill",stylers:[{color:"#ffffff"}]},{featureType:"all",elementType:"labels.text.stroke",stylers:[{color:"#000000"},{lightness:13}]},{featureType:"administrative",elementType:"geometry.fill",stylers:[{color:"#000000"}]},{featureType:"administrative",elementType:"geometry.stroke",stylers:[{color:"#144b53"},{lightness:14},{weight:1.4}]},{featureType:"landscape",elementType:"all",stylers:[{color:"#08304b"}]},{featureType:"poi",elementType:"geometry",stylers:[{color:"#0c4152"},{lightness:5}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#000000"}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#0b434f"},{lightness:25}]},{featureType:"road.arterial",elementType:"geometry.fill",stylers:[{color:"#000000"}]},{featureType:"road.arterial",elementType:"geometry.stroke",stylers:[{color:"#0b3d51"},{lightness:16}]},{featureType:"road.local",elementType:"geometry",stylers:[{color:"#000000"}]},{featureType:"transit",elementType:"all",stylers:[{color:"#146474"}]},{featureType:"water",elementType:"all",stylers:[{color:"#021019"}]}]);
            google.maps.event.addListener(map, 'click', function(event) {
              if(readyStatus){
                setCoords = event.latLng;
                console.log(setCoords);

                window.location.href = "#modalOverlay";

                // set the hidden coord field equal to the corresponding lat lng coords that were clicked
                // this will allow us to post the old fashion way in case JavaScript is disabled.
                // document.getElementById("coordField").value = setCoords.lat+","+setCoords.lng;
              }
            });

            firstRound = false;
          } else {
            map.setOptions(mapOptions);
          }

      }


    getLocation();
    
}


google.maps.event.addDomListener(window, 'load', initialize);
window.setInterval(initialize, 20000);


