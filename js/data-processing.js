/**
 * Data Processing Module
 * Handles core data fetching and rendering logic
 */

let horizonScanByBinomial = null;
let horizonScan2019ByBinomial = null;
let plantlife2010ByBinomial = null;

function getBinomialName(name) {
    if (!name) return '';
    const cleaned = String(name).replace(/\s+/g, ' ').trim();
    const parts = cleaned.split(' ');
    if (parts.length < 2) return cleaned.toLowerCase();
    return (parts[0] + ' ' + parts[1]).toLowerCase();
}

function ensureHorizonScanIndex() {
    if (horizonScanByBinomial !== null) {
        return;
    }
    horizonScanByBinomial = {};
    if (typeof scanData2025 === 'undefined' || !scanData2025) {
        return;
    }
    Object.keys(scanData2025).forEach((scientificName) => {
        const entry = scanData2025[scientificName];
        if (!entry || typeof entry !== 'object') {
            return;
        }
        horizonScanByBinomial[getBinomialName(scientificName)] = entry;
    });
}

function createHorizonBadge(label, title, url) {
    const style = "margin-right:6px;background-color:#ffe7a1;color:#1E513D;";
    if (url) {
        return "<a class='badge horizon-badge-link' style='" + style + "' title='" + title + "' target='_blank' rel='noopener noreferrer' href='" + url + "'>" + label + "</a>";
    }
    return "<span class='badge' style='" + style + "' title='" + title + "'>" + label + "</span>";
}

function getHorizonScanBadge(scientificName) {
    ensureHorizonScanIndex();
    if (typeof scanData2025 === 'undefined' || !scanData2025 || !scientificName) {
        return '';
    }

    let entry = scanData2025[scientificName];
    if (!entry) {
        entry = horizonScanByBinomial[getBinomialName(scientificName)];
    }
    if (!entry || typeof entry !== 'object') {
        return '';
    }

    const score = entry.score || 'n/a';
    const confidence = entry.confidence || 'n/a';
    const group = entry.group || 'Unknown';
    const horizon2025Url = (scanData2025 && scanData2025.url) ? scanData2025.url : '';
    const title = "Appears in GB Non-native Species Horizon Scan 2025 | Group: " + group + " | Score: " + score + " | Confidence: " + confidence;
    return createHorizonBadge('Horizon Scan 2025', title, horizon2025Url);
}

function ensureHorizonScan2019Index() {
    if (horizonScan2019ByBinomial !== null) {
        return;
    }

    horizonScan2019ByBinomial = {
        combined: {},
        biodiversity: {},
        humanHealth: {},
        economic: {}
    };

    const datasets = [
        { key: 'combined', data: (typeof scanData2019Combined !== 'undefined') ? scanData2019Combined : null },
        { key: 'biodiversity', data: (typeof scanData2019Biodiversity !== 'undefined') ? scanData2019Biodiversity : null },
        { key: 'humanHealth', data: (typeof scanData2019HumanHealth !== 'undefined') ? scanData2019HumanHealth : null },
        { key: 'economic', data: (typeof scanData2019Economic !== 'undefined') ? scanData2019Economic : null }
    ];

    datasets.forEach(dataset => {
        if (!dataset.data) {
            return;
        }
        Object.keys(dataset.data).forEach((scientificName) => {
            const entry = dataset.data[scientificName];
            if (!entry || typeof entry !== 'object') {
                return;
            }
            horizonScan2019ByBinomial[dataset.key][getBinomialName(scientificName)] = entry;
        });
    });
}

function getHorizonScan2019Url(datasetName) {
    const datasetMap = {
        combined: (typeof scanData2019Combined !== 'undefined') ? scanData2019Combined : null,
        biodiversity: (typeof scanData2019Biodiversity !== 'undefined') ? scanData2019Biodiversity : null,
        humanHealth: (typeof scanData2019HumanHealth !== 'undefined') ? scanData2019HumanHealth : null,
        economic: (typeof scanData2019Economic !== 'undefined') ? scanData2019Economic : null
    };

    const dataset = datasetMap[datasetName];
    if (dataset && dataset.url) {
        return dataset.url;
    }

    if (typeof scanData2019Combined !== 'undefined' && scanData2019Combined && scanData2019Combined.url) {
        return scanData2019Combined.url;
    }

    return '';
}

function getHorizonScan2019Entry(datasetName, scientificName) {
    const datasetMap = {
        combined: (typeof scanData2019Combined !== 'undefined') ? scanData2019Combined : null,
        biodiversity: (typeof scanData2019Biodiversity !== 'undefined') ? scanData2019Biodiversity : null,
        humanHealth: (typeof scanData2019HumanHealth !== 'undefined') ? scanData2019HumanHealth : null,
        economic: (typeof scanData2019Economic !== 'undefined') ? scanData2019Economic : null
    };

    const dataset = datasetMap[datasetName];
    if (!dataset) {
        return null;
    }

    let entry = dataset[scientificName];
    if (!entry) {
        ensureHorizonScan2019Index();
        entry = horizonScan2019ByBinomial[datasetName][getBinomialName(scientificName)];
    }

    return entry || null;
}

function getHorizonScan2019Badges(scientificName) {
    if (!scientificName) {
        return '';
    }

    const badgeConfigs = [
        {
            key: 'humanHealth',
            label: 'Horizon Scan 2019 - Risk to Human Health'
        },
        {
            key: 'biodiversity',
            label: 'Horizon Scan 2019 - Risk to Biodiversity'
        },
        {
            key: 'economic',
            label: 'Horizon Scan 2019 - Economic Impact'
        },
        {
            key: 'combined',
            label: 'Horizon Scan 2019 - Combined Impact'
        }
    ];

    const badges = [];

    badgeConfigs.forEach(config => {
        const entry = getHorizonScan2019Entry(config.key, scientificName);
        if (!entry) {
            return;
        }

        const rankClass = entry.rank_class || 'n/a';
        const title = "Appears in " + config.label + " | Rank class: " + rankClass;
        badges.push(createHorizonBadge(config.label, title, getHorizonScan2019Url(config.key)));
    });

    return badges.join('');
}

function ensurePlantlife2010Index() {
    if (plantlife2010ByBinomial !== null) {
        return;
    }

    plantlife2010ByBinomial = {};
    if (typeof scanDataPlantlife2010 === 'undefined' || !scanDataPlantlife2010) {
        return;
    }

    Object.keys(scanDataPlantlife2010).forEach((scientificName) => {
        const entry = scanDataPlantlife2010[scientificName];
        if (!entry || typeof entry !== 'object') {
            return;
        }
        plantlife2010ByBinomial[getBinomialName(scientificName)] = entry;
    });
}

function getPlantlife2010Entry(scientificName) {
    ensurePlantlife2010Index();
    if (typeof scanDataPlantlife2010 === 'undefined' || !scanDataPlantlife2010 || !scientificName) {
        return null;
    }

    let entry = scanDataPlantlife2010[scientificName];
    if (!entry) {
        entry = plantlife2010ByBinomial[getBinomialName(scientificName)];
    }

    if (!entry || typeof entry !== 'object') {
        return null;
    }

    return entry;
}

function getPlantlife2010PriorityRank(scientificName) {
    const entry = getPlantlife2010Entry(scientificName);
    if (!entry) {
        return 99;
    }

    const normalizedPriority = String(entry.priority || '').toLowerCase();
    if (normalizedPriority.includes('critical')) return 0;
    if (normalizedPriority.includes('urgent')) return 1;
    if (normalizedPriority.includes('moderate')) return 2;
    return 99;
}

function getPlantlife2010Badge(scientificName) {
    const entry = getPlantlife2010Entry(scientificName);
    if (!entry) {
        return '';
    }

    const priority = entry.priority || 'Unknown';
    const normalizedPriority = String(priority).toLowerCase();
    const isAlertPriority = normalizedPriority.includes('moderate') || normalizedPriority.includes('urgent') || normalizedPriority.includes('critical');
    const url = scanDataPlantlife2010.url || '';
    const title = 'Appears in Plantlife Horizon Scan 2010 list | Priority: ' + priority;
    const label = 'Horizon Scan 2010 (Plantlife): ' + priority;
    const style = isAlertPriority
        ? "margin-right:6px;background-color:#ffe7a1;color:#1E513D;"
        : "margin-right:6px;background-color:#6c757d;color:#ffffff;";
    const badgeClass = isAlertPriority ? 'plantlife-badge-link plantlife-badge-alert' : 'plantlife-badge-link plantlife-badge-default';

    if (url) {
        return "<a class='badge " + badgeClass + "' style='" + style + "' title='" + title + "' target='_blank' rel='noopener noreferrer' href='" + url + "'>" + label + "</a>";
    }

    return "<span class='badge' style='" + style + "' title='" + title + "'>" + label + "</span>";
}

function getNnsipInfoHtml(scientificName) {
    if (!scientificName || typeof speciesData === 'undefined' || !speciesData[scientificName]) {
        return '';
    }

    const nnsipEntry = speciesData[scientificName];
    const overview = nnsipEntry.overview_table || {};
    const environment = overview['Environment'] || 'Unknown';
    const speciesStatus = overview['Species status'] || 'Unknown';
    const nativeRange = overview['Native range'] || 'Unknown';
    const nativeRangeDisplay = nativeRange.length > 30 ? nativeRange.slice(0, 30) + '...' : nativeRange;
    const functionalType = overview['Functional type'] || 'Unknown';
    const firstRecord = overview['Date of first record'] || 'Unknown';
    const nnsipUrl = nnsipEntry.url || 'https://www.nonnativespecies.org/non-native-species/information-portal/';

    return "<br><small>" + speciesStatus + " | " + environment + " | " + functionalType +
        " | Native range: " + nativeRangeDisplay +
        " | Date of first record: " + firstRecord +
        " | <a target='_blank' href='" + nnsipUrl + "'>View on NNSIP</a></small>";
}

function getMapFilterLink(taxonId) {
    if (!taxonId) {
        return '';
    }

    return "<a href='#map' class='badge badge-light' style='margin-right:6px;' onclick='filterMapToSpecies(\"" + String(taxonId) + "\"); return false;'><i class='bi bi-map'></i></a>";
}

async function fetchObservationsForTaxonIds(taxonIds, priorDate) {
    if (!taxonIds || taxonIds.length === 0) {
        return [];
    }

    const observations = [];
    const seenObservationIds = new Set();
    const pageSize = 30;
    const taxonIdChunks = [];

    for (let i = 0; i < taxonIds.length; i += 30) {
        taxonIdChunks.push(taxonIds.slice(i, i + 30));
    }

    for (const chunk of taxonIdChunks) {
        let page = 1;
        let totalPages = null;

        while (true) {
            const dateFilterParam = priorDate ? ('&d1=' + priorDate) : '';
            const obsUrl =
                'https://api.inaturalist.org/v1/observations?lat=' + lat +
                '&lng=' + lng +
                '&radius=' + o_rad +
                '&taxon_id=' + chunk.join(',') +
                dateFilterParam +
                '&per_page=' + pageSize +
                '&page=' + page +
                '&verifiable=true&lrank=species&introduced=true' +
                extra_params;

            let response = null;
            try {
                response = await fetch(obsUrl);
            } catch (error) {
                console.log('Failed to fetch invasive/horizon observations:', error);
                break;
            }

            if (!response.ok) {
                console.log('iNaturalist observations request failed:', response.status, response.statusText);
                break;
            }

            const payload = await response.json();
            if (!payload || !payload.results || payload.results.length === 0) {
                break;
            }

            payload.results.forEach(observation => {
                if (!observation || observation.id == null || seenObservationIds.has(observation.id)) {
                    return;
                }
                seenObservationIds.add(observation.id);
                observations.push(observation);
            });

            const effectivePerPage = Number(payload.per_page) || pageSize;
            const totalResults = Number(payload.total_results) || 0;
            const responsePage = Number(payload.page) || page;
            totalPages = Math.ceil(totalResults / effectivePerPage);

            if (!totalPages || responsePage >= totalPages) {
                break;
            }

            page = responsePage + 1;
        }
    }

    return observations;
}

async function renderData() {
    updateProgressBar(20, "Getting summary");
    
    // get the number of records for the region and the locality
    let species_count = await getData('https://api.inaturalist.org/v1/observations/species_counts?lat=' + lat + '&lng=' + lng + '&radius=' + o_rad + "&per_page=0");
    let species_count_local = await getData('https://api.inaturalist.org/v1/observations/species_counts?lat=' + lat + '&lng=' + lng + '&radius=' + i_rad + "&per_page=0");
    console.log(species_count);
    console.log("Species count - Local:", species_count_local.total_results, "Regional:", species_count.total_results);

    let today = new Date();
    let priorDate = new Date(new Date().setDate(today.getDate() - 365)).toISOString().split('T')[0];
    console.log(priorDate);
    let species_count_old = await getData('https://api.inaturalist.org/v1/observations/species_counts?lat=' + lat + '&lng=' + lng + '&radius=' + o_rad + "&per_page=0" + "&d2=" + priorDate);
    let species_count_local_old = await getData('https://api.inaturalist.org/v1/observations/species_counts?lat=' + lat + '&lng=' + lng + '&radius=' + i_rad + "&per_page=0" + "&d2=" + priorDate);

    // update the headline figures for species counts
    let sp_count_1 = document.querySelector('.sp_count_1');
    sp_count_1.innerHTML = species_count_local.total_results + "<small> (+" + (species_count_local.total_results - species_count_local_old.total_results) + "/yr)</small>";
    let sp_count_2 = document.querySelector('.sp_count_2');
    sp_count_2.innerHTML = species_count.total_results + "<small> (+" + (species_count.total_results - species_count_old.total_results) + "/yr)</small>";
    let ratio = document.querySelector('.ratio');
    let current_ratio = species_count.total_results > 0 ? (100 * (species_count_local.total_results / species_count.total_results)) : 0;
    let old_ratio = species_count_old.total_results > 0 ? (100 * (species_count_local_old.total_results / species_count_old.total_results)) : 0;
    let ratio_change = current_ratio - old_ratio;
    let ratio_change_abs = Math.abs(ratio_change).toFixed(2);
    let change_indicator = '';
    if (ratio_change > 0) {
        change_indicator = "<span><i class='bi bi-arrow-up'></i> +" + ratio_change_abs + "</span>";
    } else if (ratio_change < 0) {
        change_indicator = "<span><i class='bi bi-arrow-down'></i> -" + ratio_change_abs + "</span>";
    } else {
        change_indicator = "<span class='text-muted'><i class='bi bi-dash'></i> 0.00</span>";
    }
    ratio.innerHTML = current_ratio.toFixed(2) + "%" + "<small> (" + change_indicator + ")</small>";
    updateProgressBar(30, "Getting list of recorded species");

    // initialise create an array of species in the area
    species_local_array = [];
    species_id_local_array = [];
    recordedItems = [];
    missingItems = [];
    iconicSet = new Set();
    invasiveTaxonIdsToMap = new Set();
    horizonTaxonIdsToMap = new Set();

    // how many pages of results do I have to go through?
    let max_page = Math.floor(species_count_local.total_results / 500) + 1
    console.log("Gathering species list from this many pages:" + max_page)

    // add to the array of species in the area, whilst also building the 'species recorded' tab
    let html_recorded = '';
    for (let i = 1; i < (max_page + 1); i++) {
        let species_local = await getData('https://api.inaturalist.org/v1/observations/species_counts?lat=' + lat + '&lng=' + lng + '&radius=' + i_rad + '&page=' + i);
        species_local.results.forEach(specie => {
            species_local_array.push(specie.taxon.name);
            species_id_local_array.push(specie.taxon.id);

            var record_plurality = "record";
            if (specie.count > 1) {
                var record_plurality = "records";
            }

            var thumb = "";
            if (specie.taxon && specie.taxon.default_photo && specie.taxon.default_photo.square_url) {
                thumb = "<img src='" + specie.taxon.default_photo.square_url + "' style='width:36px;height:36px;margin-right:8px;vertical-align:middle;border-radius:4px;'>";
            }

            var iconic = (specie.taxon && specie.taxon.iconic_taxon_name) ? specie.taxon.iconic_taxon_name : "";
            if (iconic) iconicSet.add(iconic);

            let invasiveUrl = getInvasiveUrl(specie.taxon.name, specie.taxon.preferred_common_name);
            let invasiveBadge = isInvasive(specie.taxon.name, specie.taxon.preferred_common_name) ? getInvasiveBadge(invasiveUrl) : "";
            let horizonBadge = getHorizonScanBadge(specie.taxon.name);
            let horizon2019Badges = getHorizonScan2019Badges(specie.taxon.name);
            let plantlife2010Badge = getPlantlife2010Badge(specie.taxon.name);
            let plantlife2010PriorityRank = getPlantlife2010PriorityRank(specie.taxon.name);
            let hasPlantlife2010AlertPriority = plantlife2010PriorityRank < 99;
            let hasMapPriorityBadge = Boolean(invasiveBadge || horizonBadge || horizon2019Badges || hasPlantlife2010AlertPriority);
            let mapFilterLink = hasMapPriorityBadge ? getMapFilterLink(specie.taxon.id) : "";
            if (invasiveBadge) {
                invasiveTaxonIdsToMap.add(specie.taxon.id);
            }
            if (horizonBadge || horizon2019Badges || hasPlantlife2010AlertPriority) {
                horizonTaxonIdsToMap.add(specie.taxon.id);
            }
            if (invasiveBadge) {
                console.log("Adding invasive badge for recorded species:", specie.taxon.preferred_common_name);
            }
            let nnsipInfo = getNnsipInfoHtml(specie.taxon.name);

            let htmlSegment = '<div class="card"><div class="card-body">' +
                thumb +
                invasiveBadge +
                horizonBadge +
                horizon2019Badges +
                plantlife2010Badge +
                
                "<em><a target='_blank' href='https://www.inaturalist.org/taxa/" + specie.taxon.id + "'>" + specie.taxon.name + "</a></em>, " + specie.taxon.preferred_common_name + (iconic ? " <small>(" + iconic + ")</small>" : "") + " - <a target='_blank' href=https://www.inaturalist.org/observations?place_id=any&subview=map&lat=" +
                +lat + '&lng=' + lng + '&radius=' + o_rad + '&taxon_id=' + specie.taxon.id +
                ">" +
                specie.count + " " + record_plurality + "</a> " +
                mapFilterLink +
                nnsipInfo +
                '</div></div>';

            recordedItems.push({ html: htmlSegment, iconic: iconic, taxon_id: specie.taxon.id, plantlife2010PriorityRank: plantlife2010PriorityRank });
        });

        let container = document.querySelector('.species_list_recorded');
        container.innerHTML = html_recorded;
    }

    updateProgressBar(60, "Generating missing species list");

    // Species in the big circle
    let species = await getData('https://api.inaturalist.org/v1/observations/species_counts?lat=' + lat + '&lng=' + lng + '&radius=' + o_rad + "&without_taxon_id=" + species_id_local_array.slice(0, 499).join());
    console.log(species);

    let html_missing = '';

    species.results.forEach(specie => {
        if (!(species_local_array.includes(specie.taxon.name))) {
            var record_plurality = "record";
            if (specie.count > 1) {
                var record_plurality = "records";
            }

            var thumb = "";
            if (specie.taxon && specie.taxon.default_photo && specie.taxon.default_photo.square_url) {
                thumb = "<img src='" + specie.taxon.default_photo.square_url + "' style='width:36px;height:36px;margin-right:8px;vertical-align:middle;border-radius:4px;'>";
            }

            var iconic = (specie.taxon && specie.taxon.iconic_taxon_name) ? specie.taxon.iconic_taxon_name : "";
            if (iconic) iconicSet.add(iconic);

            let invasiveUrl = getInvasiveUrl(specie.taxon.name, specie.taxon.preferred_common_name);
            let invasiveBadge = isInvasive(specie.taxon.name, specie.taxon.preferred_common_name) ? getInvasiveBadge(invasiveUrl) : "";
            let horizonBadge = getHorizonScanBadge(specie.taxon.name);
            let horizon2019Badges = getHorizonScan2019Badges(specie.taxon.name);
            let plantlife2010Badge = getPlantlife2010Badge(specie.taxon.name);
            let plantlife2010PriorityRank = getPlantlife2010PriorityRank(specie.taxon.name);
            let hasPlantlife2010AlertPriority = plantlife2010PriorityRank < 99;
            let hasMapPriorityBadge = Boolean(invasiveBadge || horizonBadge || horizon2019Badges || hasPlantlife2010AlertPriority);
            let mapFilterLink = hasMapPriorityBadge ? getMapFilterLink(specie.taxon.id) : "";
            if (invasiveBadge) {
                invasiveTaxonIdsToMap.add(specie.taxon.id);
            }
            if (horizonBadge || horizon2019Badges || hasPlantlife2010AlertPriority) {
                horizonTaxonIdsToMap.add(specie.taxon.id);
            }
            if (invasiveBadge && specie.taxon.preferred_common_name.includes('squirrel')) {
                console.log("Adding invasive badge for missing species:", specie.taxon.preferred_common_name);
            }
            let nnsipInfo = getNnsipInfoHtml(specie.taxon.name);

            let htmlSegment = '<div class="card"><div class="card-body">' +
                thumb +
                invasiveBadge +
                horizonBadge +
                horizon2019Badges +
                plantlife2010Badge +
                
                "<em><a target='_blank' href='https://www.inaturalist.org/taxa/" + specie.taxon.id + "'>" + specie.taxon.name + "</a></em>, " + specie.taxon.preferred_common_name + (iconic ? " <small>(" + iconic + ")</small>" : "") + " - <a target='_blank' href=https://www.inaturalist.org/observations?place_id=any&subview=map&lat=" +
                +lat + '&lng=' + lng + '&radius=' + o_rad + '&taxon_id=' + specie.taxon.id +
                ">" +
                specie.count + " " + record_plurality + "</a> " +
                mapFilterLink +
                nnsipInfo +
                '</div></div>';

            missingItems.push({ html: htmlSegment, iconic: iconic, taxon_id: specie.taxon.id, plantlife2010PriorityRank: plantlife2010PriorityRank });
        }
    });

    // populate the iconic filter dropdown
    let iconicSelect = document.getElementById('iconic_filter');
    // remove existing non-default options
    for (let i = iconicSelect.options.length - 1; i >= 1; i--) iconicSelect.remove(i);
    Array.from(iconicSet).sort().forEach(ic => {
        let opt = document.createElement('option');
        opt.value = ic;
        opt.text = ic;
        iconicSelect.appendChild(opt);
    });

    // initial render using populated arrays
    renderFilteredLists();

    // wire up onchange to re-render
    document.getElementById('iconic_filter').onchange = renderFilteredLists;

    updateProgressBar(80, "Getting invasive and horizon observations");

    const taxonIdsToMap = Array.from(new Set([
        ...Array.from(invasiveTaxonIdsToMap),
        ...Array.from(horizonTaxonIdsToMap)
    ]));

    const mappedObservations = await fetchObservationsForTaxonIds(taxonIdsToMap);
    setInvasiveHorizonObservationMarkers(
        mappedObservations,
        invasiveTaxonIdsToMap,
        horizonTaxonIdsToMap
    );
    console.log('Rendered invasive/horizon observation markers:', mappedObservations.length);

    updateProgressBar(100, "Let's go!");
    hideProgressBar();
}
