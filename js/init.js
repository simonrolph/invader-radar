/**
 * Initialization Module
 * Orchestrates application startup and data loading
 */

function initializeApp(position) {
    // Get location
    if (lat_url == null && position) {
        lat = position.coords.latitude;
    } else if (lat_url != null) {
        lat = lat_url;
    }

    if (lng_url == null && position) {
        lng = position.coords.longitude;
    } else if (lng_url != null) {
        lng = lng_url;
    }

    // radii of big and little circles in km
    if (i_rad_url == null) {
        i_rad = 1; // default inner radius
    } else {
        i_rad = i_rad_url;
    }

    if (o_rad_url == null) {
        o_rad = 5; // default outer radius
    } else {
        o_rad = o_rad_url;
    }

    // Initialize map
    initializeMap(lat, lng, i_rad, o_rad);

    // Start main data rendering
    renderData();
}

function startApplication() {
    // Initialize configuration
    initializeConfig();

    // Parse URL parameters
    parseUrlParams();

    // Initialize invasive species data
    initializeInvasiveSpecies();

    // Get location and start app
    getLocationFromUrlOrGPS();
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', startApplication);
