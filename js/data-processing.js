/**
 * Data Processing Module
 * Handles core data fetching and rendering logic
 */

let horizonScanByBinomial = null;
let horizonScan2019ByBinomial = null;

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
        horizonScanByBinomial[getBinomialName(scientificName)] = scanData2025[scientificName];
    });
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
    if (!entry) {
        return '';
    }

    const score = entry.score || 'n/a';
    const confidence = entry.confidence || 'n/a';
    const group = entry.group || 'Unknown';
    return "<span class='badge' style='margin-right:6px;background-color:#ffc107;color:#1E513D;' title='Appears in GB Non-native Species Horizon Scan 2025 | Group: " + group + " | Score: " + score + " | Confidence: " + confidence + "'>Horizon Scan 2025</span>";
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
            horizonScan2019ByBinomial[dataset.key][getBinomialName(scientificName)] = dataset.data[scientificName];
        });
    });
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
        badges.push("<span class='badge' style='margin-right:6px;background-color:#ffc107;color:#1E513D;' title='Appears in " + config.label + " | Rank class: " + rankClass + "'>" + config.label + "</span>");
    });

    return badges.join('');
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
    sp_count_1.innerHTML = species_count_local.total_results + "<small> (+" + (species_count_local.total_results - species_count_local_old.total_results) + ")</small>";
    let sp_count_2 = document.querySelector('.sp_count_2');
    sp_count_2.innerHTML = species_count.total_results + "<small> (+" + (species_count.total_results - species_count_old.total_results) + ")</small>";
    let ratio = document.querySelector('.ratio');
    let current_ratio = species_count.total_results > 0 ? (100 * (species_count_local.total_results / species_count.total_results)) : 0;
    let old_ratio = species_count_old.total_results > 0 ? (100 * (species_count_local_old.total_results / species_count_old.total_results)) : 0;
    let ratio_change = current_ratio - old_ratio;
    let ratio_change_abs = Math.abs(ratio_change).toFixed(2);
    let change_indicator = '';
    if (ratio_change > 0) {
        change_indicator = "<span class='text-success'><i class='bi bi-arrow-up'></i> +" + ratio_change_abs + "</span>";
    } else if (ratio_change < 0) {
        change_indicator = "<span class='text-danger'><i class='bi bi-arrow-down'></i> -" + ratio_change_abs + "</span>";
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

            let invasiveBadge = isInvasive(specie.taxon.name, specie.taxon.preferred_common_name) ? getInvasiveBadge() : "";
            let horizonBadge = getHorizonScanBadge(specie.taxon.name);
            let horizon2019Badges = getHorizonScan2019Badges(specie.taxon.name);
            if (invasiveBadge) {
                console.log("Adding invasive badge for recorded species:", specie.taxon.preferred_common_name);
            }
            let nnsipInfo = getNnsipInfoHtml(specie.taxon.name);

            let htmlSegment = '<div class="card"><div class="card-body">' +
                thumb +
                invasiveBadge +
                horizonBadge +
                horizon2019Badges +
                "<em><a target='_blank' href='https://www.inaturalist.org/taxa/" + specie.taxon.id + "'>" + specie.taxon.name + "</a></em>, " + specie.taxon.preferred_common_name + (iconic ? " <small>(" + iconic + ")</small>" : "") + " - <a target='_blank' href=https://www.inaturalist.org/observations?place_id=any&subview=map&lat=" +
                +lat + '&lng=' + lng + '&radius=' + o_rad + '&taxon_id=' + specie.taxon.id +
                ">" +
                specie.count + " " + record_plurality + "</a>" +
                nnsipInfo +
                '</div></div>';

            recordedItems.push({ html: htmlSegment, iconic: iconic, taxon_id: specie.taxon.id });
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

            let invasiveBadge = isInvasive(specie.taxon.name, specie.taxon.preferred_common_name) ? getInvasiveBadge() : "";
            let horizonBadge = getHorizonScanBadge(specie.taxon.name);
            let horizon2019Badges = getHorizonScan2019Badges(specie.taxon.name);
            if (invasiveBadge && specie.taxon.preferred_common_name.includes('squirrel')) {
                console.log("Adding invasive badge for missing species:", specie.taxon.preferred_common_name);
            }
            let nnsipInfo = getNnsipInfoHtml(specie.taxon.name);

            let htmlSegment = '<div class="card"><div class="card-body">' +
                thumb +
                invasiveBadge +
                horizonBadge +
                horizon2019Badges +
                "<em><a target='_blank' href='https://www.inaturalist.org/taxa/" + specie.taxon.id + "'>" + specie.taxon.name + "</a></em>, " + specie.taxon.preferred_common_name + (iconic ? " <small>(" + iconic + ")</small>" : "") + " - <a target='_blank' href=https://www.inaturalist.org/observations?place_id=any&subview=map&lat=" +
                +lat + '&lng=' + lng + '&radius=' + o_rad + '&taxon_id=' + specie.taxon.id +
                ">" +
                specie.count + " " + record_plurality + "</a>" +
                nnsipInfo +
                '</div></div>';

            missingItems.push({ html: htmlSegment, iconic: iconic, taxon_id: specie.taxon.id });
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

    updateProgressBar(100, "Let's go!");
    hideProgressBar();
}
