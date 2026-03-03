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

async function getNbnInvasiveSpeciesByRadius(latitude, longitude, radiusKm) {
    try {
        if (!nbnSourceEnabled) {
            return [];
        }

        const params = new URLSearchParams({
            q: '*:*',
            facets: nbnAtlasFacetField,
            flimit: '-1',
            lat: String(latitude),
            lon: String(longitude),
            radius: String(radiusKm),
            qualityProfile: nbnAtlasQualityProfile
        });

        const url = nbnAtlasBaseUrl + '?' + params.toString() + '&fq=stateInvasive=true';
        console.log('Making request to NBN Atlas API:' + url);

        const response = await fetch(url);
        if (!response.ok) {
            console.log('NBN Atlas request failed:', response.status, response.statusText);
            return [];
        }

        const payload = await response.json();
        const facet = payload && payload.facetResults ? payload.facetResults[0] : null;
        return facet && facet.fieldResult ? facet.fieldResult : [];
    } catch (error) {
        console.log('Error fetching NBN Atlas data:', error);
        return [];
    }
}
