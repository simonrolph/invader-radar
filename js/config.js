/**
 * Global Configuration
 * Stores all global variables and state
 */

// URL Parameters
let urlParams = window.location.search;
let i_rad_url = undefined;
let o_rad_url = undefined;
let lat_url = undefined;
let lng_url = undefined;
let extra_params = "";

// NBN Atlas source configuration
let nbnSourceEnabled = true;
let nbnAtlasBaseUrl = "https://records-ws.nbnatlas.org/occurrences/search";
let nbnAtlasFacetField = "scientificName";
let nbnAtlasQualityProfile = "NBN";

// Map and location
let map = null;
let lat = null;
let lng = null;
let i_rad = null;
let o_rad = null;
let invasiveHorizonMarkersLayer = null;

// UI elements
let bar = null;

// Species data
let species_local_array = [];
let species_id_local_array = [];
let recordedItems = [];
let missingItems = [];
let iconicSet = new Set();
let invasiveTaxonIdsToMap = new Set();
let horizonTaxonIdsToMap = new Set();

// Initialize bar reference
function initializeConfig() {
    bar = document.getElementsByClassName("progress-bar")[0];
    if (bar) {
        bar.style.width = "5%";
    }
}
