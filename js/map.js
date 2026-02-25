/**
 * Map Module
 * Handles map initialization and management
 */

let mapSpeciesFilterControl = null;
let invasiveHorizonAllMarkers = [];
let selectedSpeciesTaxonId = '';
let pendingSpeciesTaxonId = '';

function getSpeciesFilterOptions() {
    const speciesByTaxonId = new Map();

    invasiveHorizonAllMarkers.forEach(marker => {
        const markerMeta = marker.markerMeta || {};
        if (!markerMeta.taxonId) {
            return;
        }
        if (!speciesByTaxonId.has(markerMeta.taxonId)) {
            speciesByTaxonId.set(markerMeta.taxonId, markerMeta.speciesLabel || 'Unknown species');
        }
    });

    return Array.from(speciesByTaxonId.entries())
        .map(([taxonId, label]) => ({ taxonId: String(taxonId), label }))
        .sort((a, b) => a.label.localeCompare(b.label));
}

function syncSpeciesFilterSelectOptions() {
    const select = document.getElementById('map-filter-species');
    if (!select) {
        return;
    }

    const options = getSpeciesFilterOptions();
    const desiredSelection = pendingSpeciesTaxonId || selectedSpeciesTaxonId;

    select.innerHTML = '';

    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All species';
    select.appendChild(allOption);

    options.forEach(option => {
        const element = document.createElement('option');
        element.value = option.taxonId;
        element.textContent = option.label;
        select.appendChild(element);
    });

    const hasDesiredSelection = options.some(option => option.taxonId === String(desiredSelection));
    if (hasDesiredSelection) {
        selectedSpeciesTaxonId = String(desiredSelection);
        pendingSpeciesTaxonId = '';
    } else {
        selectedSpeciesTaxonId = '';
    }
    select.value = selectedSpeciesTaxonId;
}

function filterMapToSpecies(taxonId) {
    if (!taxonId) {
        return;
    }

    pendingSpeciesTaxonId = String(taxonId);
    selectedSpeciesTaxonId = String(taxonId);

    syncSpeciesFilterSelectOptions();
    applyMapSpeciesFilters();

    if (map) {
        map.invalidateSize();
    }

    const mapElement = document.getElementById('map');
    if (mapElement && mapElement.scrollIntoView) {
        mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function applyMapSpeciesFilters() {
    if (!map) {
        return;
    }

    clearInvasiveHorizonMarkers();
    invasiveHorizonMarkersLayer = L.layerGroup().addTo(map);

    invasiveHorizonAllMarkers.forEach(marker => {
        const markerMeta = marker.markerMeta || {};
        const speciesMatches = !selectedSpeciesTaxonId || String(markerMeta.taxonId) === String(selectedSpeciesTaxonId);
        const visible = speciesMatches;

        if (visible) {
            marker.addTo(invasiveHorizonMarkersLayer);
        }
    });
}

function createMapSpeciesFilterControl() {
    if (!map) {
        return;
    }

    if (mapSpeciesFilterControl) {
        map.removeControl(mapSpeciesFilterControl);
    }

    const SpeciesFilterControl = L.Control.extend({
        options: {
            position: 'topright'
        },

        onAdd: function () {
            const container = L.DomUtil.create('div', 'leaflet-bar map-species-filter-control');
            container.innerHTML =
                "<select id='map-filter-species' aria-label='Filter'><option value=''>All</option></select>";

            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.disableScrollPropagation(container);

            return container;
        }
    });

    mapSpeciesFilterControl = new SpeciesFilterControl();
    map.addControl(mapSpeciesFilterControl);

    const speciesSelect = document.getElementById('map-filter-species');

    if (speciesSelect) {
        speciesSelect.value = selectedSpeciesTaxonId;
        speciesSelect.addEventListener('change', function () {
            selectedSpeciesTaxonId = speciesSelect.value;
            applyMapSpeciesFilters();
        });
    }

    syncSpeciesFilterSelectOptions();
}

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
        color: '#000000',
        fillColor: '#000000',
        opacity: 0.1,
        fillOpacity: 0,
        weight: 3,
    }).addTo(map);
    donut2.bringToBack();

    map.addEventListener('dragend', function () {
        latlng = map.getCenter();
        document.getElementById('lat').value = latlng.lat;
        document.getElementById('lng').value = latlng.lng;
        donut2.setLatLng(latlng);
        donut2.bringToBack();
    });

    // update the radii of the ghost donut based on inputs
    function updateGhostDonut() {
        donut2.setInnerRadius(document.getElementById("i_rad").value * 1000);
        donut2.setRadius(document.getElementById("o_rad").value * 1000);
        donut2.bringToBack();
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
        donut2.bringToBack();
    });

    // add all records onto map
    L.tileLayer('https://api.inaturalist.org/v1/grid/{z}/{x}/{y}.png?verifiable=true&rank=species&introduced=true&color=green' + extra_params, {
        maxZoom: 19,
        opacity: 0.7,
        attribution: 'iNaturalist'
    }).addTo(map);

    createMapSpeciesFilterControl();
}

function clearInvasiveHorizonMarkers() {
    if (invasiveHorizonMarkersLayer && map) {
        map.removeLayer(invasiveHorizonMarkersLayer);
    }
    invasiveHorizonMarkersLayer = null;
}

function setInvasiveHorizonObservationMarkers(observations, invasiveTaxonIds, horizonTaxonIds) {
    if (!map) {
        return;
    }

    invasiveHorizonAllMarkers = [];

    observations.forEach(observation => {
        const taxon = observation.taxon || {};
        const taxonId = taxon.id;
        const isInvasive = invasiveTaxonIds.has(taxonId);
        const isHorizon = horizonTaxonIds.has(taxonId);

        if (!isInvasive && !isHorizon) {
            return;
        }

        const coords = observation.geojson && observation.geojson.coordinates;
        if (!coords || coords.length < 2) {
            return;
        }

        const markerColor = isInvasive ? '#dc3545' : '#ffc107';
        const marker = L.circleMarker([coords[1], coords[0]], {
            radius: 6,
            color: markerColor,
            weight: 2,
            opacity:0,
            fillColor: markerColor,
            fillOpacity: 0.8
        });

        const scientificName = taxon.name || 'Unknown species';
        const commonName = taxon.preferred_common_name || '';
        const speciesLabel = commonName ? (commonName + ' (' + scientificName + ')') : scientificName;
        const observedOn = observation.observed_on || observation.created_at_details?.date || 'Unknown date';
        const obsUrl = observation.uri || ('https://www.inaturalist.org/observations/' + observation.id);

        const badges = [];
        if (isInvasive) {
            badges.push("<span class='badge badge-danger' style='margin-right:6px;'>Listed Invasive</span>");
        }
        if (isHorizon) {
            badges.push("<span class='badge' style='margin-right:6px;background-color:#ffc107;color:#1E513D;'>Horizon Scan</span>");
        }

        marker.bindPopup(
            "<div>" +
            badges.join('') +
            "<br><em>" + scientificName + "</em>" +
            (commonName ? (", " + commonName) : "") +
            "<br><small>Observed: " + observedOn + "</small>" +
            "<br><a target='_blank' href='" + obsUrl + "'>View observation</a>" +
            "</div>"
        );

        marker.markerMeta = {
            isInvasive: isInvasive,
            isHorizon: isHorizon,
            taxonId: taxonId,
            speciesLabel: speciesLabel
        };

        invasiveHorizonAllMarkers.push(marker);
    });

    syncSpeciesFilterSelectOptions();
    applyMapSpeciesFilters();
}
