/**
 * Map Module
 * Handles map initialization and management
 */

function initializeMap(lat_val, lng_val, i_rad_val, o_rad_val) {
    lat = Number(lat_val).toFixed(6);
    lng = Number(lng_val).toFixed(6);
    i_rad = i_rad_val;
    o_rad = o_rad_val;

    console.log("latitude: " + lat);
    console.log("longitude: " + lng);
    console.log("inner radius: " + i_rad);
    console.log("outer radius: " + o_rad);

    // Update the input controls with the current lat long
    document.getElementById("lat").value = lat;
    document.getElementById("lng").value = lng;
    document.getElementById("i_rad").value = i_rad;
    document.getElementById("o_rad").value = o_rad;

    document.querySelectorAll('.i_rad_info').forEach(i_rad_in => {
        i_rad_in.innerHTML = i_rad;
    })
    document.querySelectorAll('.o_rad_info').forEach(o_rad_in => {
        o_rad_in.innerHTML = o_rad;
    })

    // update the link to inat explore
    var a = document.getElementById('link_to_inat');
    a.href = 'https://www.inaturalist.org/observations?place_id=any&subview=map&lat=' + lat + '&lng=' + lng + '&radius=' + o_rad + extra_params;

    // make the mini map, add tiles etc.
    map = L.map('map').setView([lat, lng], 12);
    map.options.maxZoom = 16;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 16,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    // add the donut
    let donut = L.donut([lat, lng], {
        radius: o_rad * 1000,
        innerRadius: i_rad * 1000,
        innerRadiusAsPercent: false,
        color: '#3CBB54',
        fillColor: '#3CBB54',
        opacity: 1,
        fillOpacity: 0.2,
        weight: 2,
    }).addTo(map);

    // add a second donut which updates based on the inputs
    let donut2 = L.donut([lat, lng], {
        radius: o_rad * 1000,
        innerRadius: i_rad * 1000,
        innerRadiusAsPercent: false,
        color: '#3CBB54',
        fillColor: '#3CBB54',
        opacity: 0.5,
        fillOpacity: 0,
        weight: 3,
    }).addTo(map);
    donut2.bringToFront();

    map.addEventListener('dragend', function () {
        latlng = map.getCenter();
        document.getElementById('lat').value = latlng.lat;
        document.getElementById('lng').value = latlng.lng;
        donut2.setLatLng(latlng);
        donut2.bringToFront();
    });

    // update the radii of the ghost donut based on inputs
    function updateGhostDonut() {
        donut2.setInnerRadius(document.getElementById("i_rad").value * 1000);
        donut2.setRadius(document.getElementById("o_rad").value * 1000);
        donut2.bringToFront();
    }

    document.getElementById('i_rad').addEventListener('input', updateGhostDonut);
    document.getElementById('o_rad').addEventListener('input', updateGhostDonut);
    document.getElementById('i_rad').addEventListener('change', updateGhostDonut);
    document.getElementById('o_rad').addEventListener('change', updateGhostDonut);

    // add the central marker
    var myIcon = L.icon({
        iconUrl: 'images/location-pin.png',
        iconSize: [24, 24],
        iconAnchor: [12, 24],
    });
    L.marker([lat, lng], { icon: myIcon }).addTo(map);

    // update the lat long inputs when the map moves
    map.addEventListener('move', function (ev) {
        latlng = map.getCenter();
        document.getElementById('lat').value = latlng.lat;
        document.getElementById('lng').value = latlng.lng;
        donut2.setLatLng(latlng);
        donut2.bringToFront();
    });

    // add all records onto map
    L.tileLayer('https://api.inaturalist.org/v1/grid/{z}/{x}/{y}.png?verifiable=true&rank=species&introduced=true&color=green' + extra_params, {
        maxZoom: 19,
        opacity: 0.7,
        attribution: 'iNaturalist'
    }).addTo(map);
}
