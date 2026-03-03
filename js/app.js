/**
 * Main Application Module
 * Contains core application logic and data processing
 */

function isItemInvasive(item) {
    if (typeof item.isInvasive === 'boolean') {
        return item.isInvasive;
    }
    return item.html.includes('badge-danger');
}

function isItemHorizonPriority(item) {
    if (typeof item.isHorizonPriority === 'boolean') {
        return item.isHorizonPriority;
    }
    return item.html.includes('Horizon Scan 2025') || item.html.includes('Horizon Scan 2019') || item.html.includes('plantlife-badge-alert') || item.html.includes('ne2009-badge-alert');
}

function updateSingleTabBadges(tabId, invasiveCount, horizonCount) {
    const tab = document.getElementById(tabId);
    if (!tab) {
        return;
    }

    const h6 = tab.querySelector('h6');
    if (!h6) {
        return;
    }

    h6.querySelectorAll('.invasive-count-badge, .horizon-count-badge').forEach(el => el.remove());

    if (invasiveCount > 0) {
        const badge = document.createElement('span');
        badge.className = 'badge bg-danger invasive-count-badge';
        badge.style.marginLeft = '6px';
        badge.style.fontSize = '0.7em';
        badge.textContent = invasiveCount;
        h6.appendChild(badge);
    }

    if (horizonCount > 0) {
        const horizonBadge = document.createElement('span');
        horizonBadge.className = 'badge horizon-count-badge';
        horizonBadge.style.marginLeft = '6px';
        horizonBadge.style.fontSize = '0.7em';
        horizonBadge.style.backgroundColor = '#ffe7a1';
        horizonBadge.style.color = '#1E513D';
        horizonBadge.title = 'Number of species matching Horizon Scan 2025/2019/2010 (Plantlife)/2009 (NE) priority categories';
        horizonBadge.textContent = horizonCount;
        h6.appendChild(horizonBadge);
    }
}

const TAG_SUMMARY_CONFIG = [
    { id: 'invasive', label: 'UK listed invasive species' },
    { id: 'horizon2025', label: 'Horizon Scan 2025' },
    { id: 'horizon2019', label: 'Horizon Scan 2019' },
    { id: 'plantlife2010', label: 'Horizon Scan 2010 (Plantlife)' },
    { id: 'horizon2009NE', label: 'Horizon Scan 2009 (NE)' }
];

const HORIZON_TAG_IDS = new Set(['horizon2025', 'horizon2019', 'plantlife2010', 'horizon2009NE']);

const SPECIES_RECORD_SOURCE_CONFIG = [
    {
        source: 'iNaturalist API',
        role: 'Species records',
        details: 'Live species counts and observations used to build local and proximity detections.'
    }
];

function createEmptyTagSetMap() {
    const map = {};
    TAG_SUMMARY_CONFIG.forEach(config => {
        map[config.id] = new Set();
    });
    return map;
}

function createEmptyTagBreakdownMap() {
    const map = {};
    TAG_SUMMARY_CONFIG.forEach(config => {
        map[config.id] = {};
    });
    return map;
}

function addBreakdownIdentity(breakdownMap, tagId, categoryLabel, identity) {
    if (!breakdownMap[tagId][categoryLabel]) {
        breakdownMap[tagId][categoryLabel] = new Set();
    }
    breakdownMap[tagId][categoryLabel].add(identity);
}

function getItemIdentity(item, indexPrefix, index) {
    if (item.taxon_id !== undefined && item.taxon_id !== null) {
        return 'taxon:' + String(item.taxon_id);
    }
    if (item.scientificName) {
        return 'scientific:' + item.scientificName;
    }
    return indexPrefix + ':' + String(index);
}

function addItemToSummarySets(items, tagSetMap, breakdownMap, indexPrefix) {
    items.forEach((item, index) => {
        const identity = getItemIdentity(item, indexPrefix, index);
        const tags = item.tags || {};

        TAG_SUMMARY_CONFIG.forEach(config => {
            const tagMatch = tags[config.id];
            if (!tagMatch) {
                return;
            }
            tagSetMap[config.id].add(identity);

            if (HORIZON_TAG_IDS.has(config.id) && Array.isArray(tagMatch.categories)) {
                tagMatch.categories.forEach(categoryLabel => {
                    addBreakdownIdentity(breakdownMap, config.id, categoryLabel, identity);
                });
            }
        });
    });
}

function buildSummaryRows(localSets, proximitySets, localBreakdownMap, proximityBreakdownMap) {
    const rows = [];

    TAG_SUMMARY_CONFIG.forEach(config => {
        const localCount = localSets[config.id].size;
        const proximityCount = proximitySets[config.id].size;
        const totalSet = new Set([...localSets[config.id], ...proximitySets[config.id]]);
        rows.push({
            label: config.label,
            localCount: localCount,
            proximityCount: proximityCount,
            totalCount: totalSet.size,
            isBreakdown: false
        });

        if (!HORIZON_TAG_IDS.has(config.id)) {
            return;
        }

        const localCategories = Object.keys(localBreakdownMap[config.id]);
        const proximityCategories = Object.keys(proximityBreakdownMap[config.id]);
        const categoryLabels = Array.from(new Set([...localCategories, ...proximityCategories])).sort();

        categoryLabels.forEach(categoryLabel => {
            const localSet = localBreakdownMap[config.id][categoryLabel] || new Set();
            const proximitySet = proximityBreakdownMap[config.id][categoryLabel] || new Set();
            const totalCategorySet = new Set([...localSet, ...proximitySet]);

            rows.push({
                label: '↳ ' + categoryLabel,
                localCount: localSet.size,
                proximityCount: proximitySet.size,
                totalCount: totalCategorySet.size,
                isBreakdown: true
            });
        });
    });

    return rows;
}

function renderDataSummaryTab(filteredRecordedItems, filteredMissingItems) {
    const container = document.querySelector('.data_summary_list');
    if (!container) {
        return;
    }

    const localSets = createEmptyTagSetMap();
    const proximitySets = createEmptyTagSetMap();
    const localBreakdownMap = createEmptyTagBreakdownMap();
    const proximityBreakdownMap = createEmptyTagBreakdownMap();

    addItemToSummarySets(filteredRecordedItems, localSets, localBreakdownMap, 'local');
    addItemToSummarySets(filteredMissingItems, proximitySets, proximityBreakdownMap, 'proximity');

    const rows = buildSummaryRows(localSets, proximitySets, localBreakdownMap, proximityBreakdownMap);

    let rowsHtml = rows.map(row => {
        const rowClass = row.isBreakdown ? ' class="table-light"' : '';
        return '<tr' + rowClass + '>' +
            '<td>' + row.label + '</td>' +
            '<td>' + row.localCount + '</td>' +
            '<td>' + row.proximityCount + '</td>' +
            '<td>' + row.totalCount + '</td>' +
            '</tr>';
    }).join('');

    const sourceRowsHtml = SPECIES_RECORD_SOURCE_CONFIG.map(source => {
        return '<tr>' +
            '<td>' + source.source + '</td>' +
            '<td>' + source.role + '</td>' +
            '<td>' + source.details + '</td>' +
            '</tr>';
    }).join('');

    container.innerHTML = '<div class="table-responsive">' +
        '<table class="table table-sm table-striped">' +
        '<thead><tr><th>List</th><th>Local detections</th><th>Proximity detections</th><th>Total unique species</th></tr></thead>' +
        '<tbody>' + rowsHtml + '</tbody>' +
        '</table>' +
        '</div>' +
        '<h6 style="margin-top:12px;">Species records data sources</h6>' +
        '<div class="table-responsive">' +
        '<table class="table table-sm table-striped">' +
        '<thead><tr><th>Source</th><th>Role</th><th>Details</th></tr></thead>' +
        '<tbody>' + sourceRowsHtml + '</tbody>' +
        '</table>' +
        '</div>';
}

function renderFilteredLists() {
    const filter = document.getElementById('iconic_filter').value;
    
    // Sort function: invasive first, then horizon scan, then all others
    const sortByPriority = (a, b) => {
        const aIsInvasive = isItemInvasive(a);
        const bIsInvasive = isItemInvasive(b);
        const aIsHorizon = isItemHorizonPriority(a);
        const bIsHorizon = isItemHorizonPriority(b);

        if (aIsInvasive && !bIsInvasive) return -1;
        if (!aIsInvasive && bIsInvasive) return 1;

        if (aIsHorizon && !bIsHorizon) return -1;
        if (!aIsHorizon && bIsHorizon) return 1;

        const aNE2009Rank = typeof a.horizon2009NECategoryRank === 'number' ? a.horizon2009NECategoryRank : 99;
        const bNE2009Rank = typeof b.horizon2009NECategoryRank === 'number' ? b.horizon2009NECategoryRank : 99;
        const aHasNE2009AlertRank = aNE2009Rank < 99;
        const bHasNE2009AlertRank = bNE2009Rank < 99;

        if (aHasNE2009AlertRank && bHasNE2009AlertRank && aNE2009Rank !== bNE2009Rank) {
            return aNE2009Rank - bNE2009Rank;
        }

        const aPlantlifeRank = typeof a.plantlife2010PriorityRank === 'number' ? a.plantlife2010PriorityRank : 99;
        const bPlantlifeRank = typeof b.plantlife2010PriorityRank === 'number' ? b.plantlife2010PriorityRank : 99;
        const aHasPlantlifeAlertRank = aPlantlifeRank < 99;
        const bHasPlantlifeAlertRank = bPlantlifeRank < 99;

        if (aHasPlantlifeAlertRank && bHasPlantlifeAlertRank && aPlantlifeRank !== bPlantlifeRank) {
            return aPlantlifeRank - bPlantlifeRank;
        }

        return 0;
    };
    
    const filteredRecordedItems = recordedItems
        .filter(it => (!filter || !it.iconic || it.iconic === filter));
    const filteredMissingItems = missingItems
        .filter(it => (!filter || !it.iconic || it.iconic === filter));

    let recHtml = filteredRecordedItems
        .sort(sortByPriority)
        .map(it => it.html)
        .join('');
    let missHtml = filteredMissingItems
        .sort(sortByPriority)
        .map(it => it.html)
        .join('');
    
    let containerRecorded = document.querySelector('.species_list_recorded');
    let containerMissing = document.querySelector('.species_list');
    
    if (containerRecorded) {
        containerRecorded.innerHTML = recHtml || '<p>No recorded species for this filter.</p>';
    }
    if (containerMissing) {
        containerMissing.innerHTML = missHtml || '<p>No missing species for this filter.</p>';
    }
    
    // Update tab badges with count summaries for the currently displayed filter
    updateTabBadges(filteredRecordedItems, filteredMissingItems);

    // Update data summary tab for the currently displayed filter
    renderDataSummaryTab(filteredRecordedItems, filteredMissingItems);
}

function updateTabBadges(filteredRecordedItems, filteredMissingItems) {
    // Count invasive species in recorded items (Locally recorded species tab)
    const recordedInvasiveCount = filteredRecordedItems.filter(item => isItemInvasive(item)).length;

    // Count 2025/2019 horizon scan matches in recorded items
    const recordedHorizonCount = filteredRecordedItems.filter(item => isItemHorizonPriority(item)).length;
    
    // Count invasive species in missing items (Proximity recorded species tab)
    const missingInvasiveCount = filteredMissingItems.filter(item => isItemInvasive(item)).length;

    // Count 2025/2019 horizon scan matches in missing items
    const missingHorizonCount = filteredMissingItems.filter(item => isItemHorizonPriority(item)).length;

    updateSingleTabBadges('profile-tab', recordedInvasiveCount, recordedHorizonCount);
    updateSingleTabBadges('home-tab', missingInvasiveCount, missingHorizonCount);
}
