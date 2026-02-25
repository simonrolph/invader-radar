/**
 * URL Parameter Module
 * Handles URL parameter parsing and processing
 */

function parseUrlParams() {

    if (urlParams.includes("?")) {
        console.log(urlParams);
        const getQuery = urlParams.split('?')[1];
        const params = getQuery.split('&');
        console.log("Custom URL parameters supplied:");
        console.log(params);

        // Extract protected parameters
        if ((params.findIndex(p => p.includes("i_rad"))) > -1) {
            i_rad_url = params[params.findIndex(p => p.includes("i_rad"))].split("=")[1];
        }
        if ((params.findIndex(p => p.includes("o_rad"))) > -1) {
            o_rad_url = params[params.findIndex(p => p.includes("o_rad"))].split("=")[1];
        }
        if ((params.findIndex(p => p.includes("lat"))) > -1) {
            lat_url = params[params.findIndex(p => p.includes("lat"))].split("=")[1];
        }
        if ((params.findIndex(p => p.includes("lng"))) > -1) {
            lng_url = params[params.findIndex(p => p.includes("lng"))].split("=")[1];
        }

        // Update UI values
        const iRadInput = document.getElementById("i_rad");
        const oRadInput = document.getElementById("o_rad");
        if (iRadInput) iRadInput.value = i_rad_url;
        if (oRadInput) oRadInput.value = o_rad_url;

        // Remove protected parameters from extra_params
        const toRemove = [];
        params.forEach(param => {
            if (param.startsWith("lat") || param.startsWith("lng") || param.startsWith("i_rad") || param.startsWith("o_rad")) {
                toRemove.push(param);
            }
        });
        for (let i = toRemove.length - 1; i >= 0; i--) {
            params.splice(params.indexOf(toRemove[i]), 1);
        }

        extra_params = "&" + params.join("&");
        console.log(extra_params);
    } else {
        console.log("No query parameters provided");
        extra_params = "";
    }
}

function getLocationFromUrlOrGPS() {
    if (lat_url == undefined || lng_url == undefined) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(initializeApp);
        } else {
            alert("GPS needed");
        }
    } else {
        initializeApp(null);
    }
}
