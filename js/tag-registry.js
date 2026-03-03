/**
 * Species Tag Registry
 * Centralizes species tag matching, badge rendering, and priority metadata.
 */

// Default "no-priority" rank used by rules that support ranking.
const DEFAULT_TAG_RANK = 99;

// Runtime list of tag rules. Each rule decides whether a species matches one tag.
let speciesTagRules = [];

// Guards one-time setup so rules are not registered multiple times.
let speciesTagRegistryInitialized = false;

function normalizeTagText(value) {
    if (!value) return '';
    return String(value).replace(/\s+/g, ' ').trim().toLowerCase();
}

// Extract genus + species for fallback matching.
function getTagBinomialName(name) {
    const cleaned = normalizeTagText(name);
    if (!cleaned) return '';
    const parts = cleaned.split(' ');
    if (parts.length < 2) return cleaned;
    return parts[0] + ' ' + parts[1];
}

function clearSpeciesTagRules() {
    speciesTagRules = [];
}

function getHorizon2025Entry(scientificName, scientificBinomial) {
    if (typeof scanData2025 === 'undefined' || !scanData2025 || !scientificName) {
        return null;
    }

    let entry = scanData2025[scientificName] || null;
    if (entry) {
        return entry;
    }

    const targetBinomial = scientificBinomial || getTagBinomialName(scientificName);
    if (!targetBinomial) {
        return null;
    }

    const matchingName = Object.keys(scanData2025).find((name) => {
        return getTagBinomialName(name) === targetBinomial;
    });

    return matchingName ? scanData2025[matchingName] : null;
}

// Register a single rule with a required id and evaluate(context) function.
function registerSpeciesTagRule(rule) {
    if (!rule || !rule.id || typeof rule.evaluate !== 'function') {
        return;
    }
    speciesTagRules.push(rule);
}

function initializeSpeciesTagRegistry() {
    if (speciesTagRegistryInitialized) {
        return;
    }

    // Start from a clean state so reinitialization is deterministic.
    clearSpeciesTagRules();

    // Rule: UK listed invasive species.
    registerSpeciesTagRule({
        id: 'invasive',
        evaluate: function (context) {
            const scientificName = context.scientificName;
            const commonName = context.commonName;
            if (!isInvasive(scientificName, commonName)) {
                return null;
            }
            const invasiveUrl = getInvasiveUrl(scientificName, commonName);
            return {
                badgeHtml: getInvasiveBadge(invasiveUrl),
                isInvasive: true,
                isHorizonPriority: false,
                mapPriority: true
            };
        }
    });

    // Rule: Horizon Scan 2025.
    registerSpeciesTagRule({
        id: 'horizon2025',
        evaluate: function (context) {
            const badge = getHorizonScanBadge(context.scientificName);
            if (!badge) {
                return null;
            }
            const entry = getHorizon2025Entry(context.scientificName, context.scientificBinomial);
            const group = entry && entry.group ? entry.group : 'Unknown';
            return {
                badgeHtml: badge,
                isInvasive: false,
                isHorizonPriority: true,
                mapPriority: true,
                categories: ['Group: ' + group]
            };
        }
    });

    // Rule: Horizon Scan 2019 categories.
    registerSpeciesTagRule({
        id: 'horizon2019',
        evaluate: function (context) {
            const badges = getHorizonScan2019Badges(context.scientificName);
            if (!badges) {
                return null;
            }
            const categories = [];
            if (getHorizonScan2019Entry('humanHealth', context.scientificName)) {
                categories.push('Risk to Human Health');
            }
            if (getHorizonScan2019Entry('biodiversity', context.scientificName)) {
                categories.push('Risk to Biodiversity');
            }
            if (getHorizonScan2019Entry('economic', context.scientificName)) {
                categories.push('Economic Impact');
            }
            if (getHorizonScan2019Entry('combined', context.scientificName)) {
                categories.push('Combined Impact');
            }
            return {
                badgeHtml: badges,
                isInvasive: false,
                isHorizonPriority: true,
                mapPriority: true,
                categories: categories.length > 0 ? categories : ['Matched category']
            };
        }
    });

    // Rule: Plantlife 2010 (priority-based horizon tag).
    registerSpeciesTagRule({
        id: 'plantlife2010',
        evaluate: function (context) {
            const badge = getPlantlife2010Badge(context.scientificName);
            if (!badge) {
                return null;
            }
            const entry = getPlantlife2010Entry(context.scientificName);
            const priority = entry && entry.priority ? entry.priority : 'Unknown';
            const rank = getPlantlife2010PriorityRank(context.scientificName);
            const isPriority = rank < DEFAULT_TAG_RANK;
            return {
                badgeHtml: badge,
                isInvasive: false,
                isHorizonPriority: isPriority,
                mapPriority: isPriority,
                categories: ['Priority: ' + priority],
                ranks: {
                    plantlife2010PriorityRank: rank
                }
            };
        }
    });

    // Rule: Natural England 2009 list (priority-based horizon tag).
    registerSpeciesTagRule({
        id: 'horizon2009NE',
        evaluate: function (context) {
            const badge = getHorizonScan2009NEBadge(context.scientificName);
            if (!badge) {
                return null;
            }
            const entry = getHorizonScan2009NEEntry(context.scientificName);
            const listCategory = entry && entry.list_category ? entry.list_category : 'Unknown';
            const rank = getHorizonScan2009NECategoryRank(context.scientificName);
            const isPriority = rank < DEFAULT_TAG_RANK;
            return {
                badgeHtml: badge,
                isInvasive: false,
                isHorizonPriority: isPriority,
                mapPriority: isPriority,
                categories: ['Category: ' + listCategory],
                ranks: {
                    horizon2009NECategoryRank: rank
                }
            };
        }
    });

    speciesTagRegistryInitialized = true;
}

// Runs all registered rules for one species and merges results into one summary object.
function evaluateSpeciesTags(context) {
    initializeSpeciesTagRegistry();

    // Aggregated output consumed by data-processing and UI sorting/counters.
    const summary = {
        badgesHtml: '',
        isInvasive: false,
        isHorizonPriority: false,
        mapPriority: false,
        ranks: {
            plantlife2010PriorityRank: DEFAULT_TAG_RANK,
            horizon2009NECategoryRank: DEFAULT_TAG_RANK
        },
        tags: {}
    };

    speciesTagRules.forEach(rule => {
        // Each rule returns null (no match) or a match payload.
        const result = rule.evaluate(context);
        if (!result) {
            return;
        }

        // Keep per-tag details for future filtering/debugging/feature work.
        summary.tags[rule.id] = result;

        // Build final badge HTML by concatenating matched rule badges in rule order.
        if (result.badgeHtml) {
            summary.badgesHtml += result.badgeHtml;
        }

        if (result.isInvasive) {
            summary.isInvasive = true;
        }

        if (result.isHorizonPriority) {
            summary.isHorizonPriority = true;
        }

        if (result.mapPriority) {
            summary.mapPriority = true;
        }

        // Merge known rank fields used in sorting.
        if (result.ranks) {
            if (typeof result.ranks.plantlife2010PriorityRank === 'number') {
                summary.ranks.plantlife2010PriorityRank = result.ranks.plantlife2010PriorityRank;
            }
            if (typeof result.ranks.horizon2009NECategoryRank === 'number') {
                summary.ranks.horizon2009NECategoryRank = result.ranks.horizon2009NECategoryRank;
            }
        }
    });

    return summary;
}
