/**
 * API Module
 * Handles iNaturalist API calls
 */

async function getData(url) {
    try {
        const fullUrl = url + "&verifiable=true&lrank=species&introduced=true" + extra_params;
        let res = await fetch(fullUrl);
        console.log("Making request to iNaturalist API:" + fullUrl);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function getUserObservations(userId, customUrl = null) {
    try {
        const url = customUrl || 'https://api.inaturalist.org/v1/observations/species_counts?user_id=' + encodeURIComponent(userId);
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.log("Error fetching user observations:", error);
        return null;
    }
}
