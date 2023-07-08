function getAddressByName(placeName) {
  var placeName = placeName;
  var service = new google.maps.places.PlacesService(
    document.createElement("div")
  );

  // TextSearch request to get place details by name
  service.textSearch({ query: placeName }, function (results, status) {
    if (
      status === google.maps.places.PlacesServiceStatus.OK &&
      results.length > 0
    ) {
      var place = results[0];
      var address = place.formatted_address;
      console.log("Address:", address);
    } else {
      console.log("Place not found or an error occurred:", status);
    }
  });
}

function initMap() {


  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11,
    center: { lat: 7.878978, lng: 98.398392 },
  });

  directionsRenderer.setMap(map);
  document.getElementById("submit").addEventListener("click", () => {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  const waypts = [];
  const stop_place = [];
  const checkboxArray = document.getElementById("waypoints");

  for (let i = 0; i < checkboxArray.length; i++) {
    if (checkboxArray.options[i].selected) {
      waypts.push({
        location: checkboxArray[i].value,
        stopover: true,
      });
      stop_place.push(checkboxArray[i].value)
    }
  }

  console.log("WAYPOINTS =>", stop_place)

  directionsService
    .route({
      origin: document.getElementById("start").value,
      destination: document.getElementById("end").value,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
      console.log("RESPONSE =>", response);
      const route = response.routes[0];
      console.log("ROUTE =>", route);
      const summaryPanel = document.getElementById("directions-panel");
      summaryPanel.innerHTML = "";

      const initial = document.getElementById("start").value;
      const final_des = document.getElementById("end").value
      const locations = [initial, final_des];
      const final_location = locations.concat(stop_place)
      console.log("LOCATION =>", final_location)

      for (let i = 0; i < final_location.length; i++){
        var placeName = final_location[i]
        console.log("PLACE =>", placeName)
        getAddressByName(placeName);
      }

      // For each route, display summary information.
      for (let i = 0; i < route.legs.length; i++) {
        const routeSegment = i + 1;
        if (i == 0 && i == route.legs.length - 1) {
          var origins = response.request.origin.query;
          var origin = origins.split(",", 2)[0];
          var destinations = response.request.destination.query;
          var destination = destinations.split(",", 2)[0];
          summaryPanel.innerHTML +=
            "<b>Route Segment: " + routeSegment + "</b><br>";
          summaryPanel.innerHTML += `<em>${origin}</em>` + " to ";
          summaryPanel.innerHTML += `<em>${destination}</em>` + "<br>";
          summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
        } else if (i == 0) {
          var origins = response.request.origin.query;
          var origin = origins.split(",", 2)[0];
          summaryPanel.innerHTML +=
            "<b>Route Segment: " + routeSegment + "</b><br>";
          summaryPanel.innerHTML += `<em>${origin}</em>` + " to ";
          summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
          summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
        } else if (i == route.legs.length - 1) {
          var destinations = response.request.destination.query;
          var destination = destinations.split(",", 2)[0];
          summaryPanel.innerHTML +=
            "<b>Route Segment: " + routeSegment + "</b><br>";
          summaryPanel.innerHTML += route.legs[i].start_address + " to ";
          summaryPanel.innerHTML += `<em>${destination}</em>` + "<br>";
          summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
        } else {
          summaryPanel.innerHTML +=
            "<b>Route Segment: " + routeSegment + "</b><br>";
          summaryPanel.innerHTML += route.legs[i].start_address + " to ";
          summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
          summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
        }
      }
    })
    .catch((e) => window.alert("Directions request failed due to " + status));
}

window.initMap = initMap;
