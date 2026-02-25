/**
 * Invasive Species Module
 * Handles invasive species data management and checking
 */

let invasiveSpecies = { invasive_species: [] };
let invasiveScientificNames = new Set();
let invasiveCommonNames = new Set();

function initializeInvasiveSpecies() {
    const invasiveData = {
        "invasive_species": [
            { "common_name": "Chinese mitten crab", "scientific_name": "Eriocheir sinensis", "listed_date": "2016-08-03", "spread": "widely spread","url":"https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Egyptian goose", "scientific_name": "Alopochen aegyptiacus", "listed_date": "2017-08-02", "spread": "widely spread","url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Grey squirrel", "scientific_name": "Sciurus carolinensis", "listed_date": "2016-08-03", "spread": "widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Muntjac deer", "scientific_name": "Muntiacus reevesi", "listed_date": "2016-08-03", "spread": "widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Signal crayfish", "scientific_name": "Pacifastacus leniusculus", "listed_date": "2016-08-03", "spread": "widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Terrapins (all subspecies including red‑eared slider, yellow‑bellied slider, Cumberland slider, common slider)", "scientific_name": "Trachemys scripta", "listed_date": "2016-08-03", "spread": "widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Asian hornet (yellow-legged hornet)", "scientific_name": "Vespa velutina nigrithorax", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Chinese sleeper / Amur sleeper", "scientific_name": "Percottus glenii", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Coati", "scientific_name": "Nasua nasua", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Common myna", "scientific_name": "Acridotheres tristis", "listed_date": "2019-08-15", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Coypu", "scientific_name": "Myocastor coypus", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Fox squirrel", "scientific_name": "Sciurus niger", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Indian house crow", "scientific_name": "Corvus splendens", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Marbled crayfish", "scientific_name": "Procambarus fallax f. virginalis (Procambarus virginalis)", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Muskrat", "scientific_name": "Ondatra zibethicus", "listed_date": "2017-08-02", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "New Zealand flatworm", "scientific_name": "Arthurdendyus triangulatus", "listed_date": "2019-08-15", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "North American bullfrog", "scientific_name": "Lithobates (Rana) catesbeianus", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Pallas's squirrel", "scientific_name": "Callosciurus erythraeus", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Pumpkinseed", "scientific_name": "Lepomis gibbosus", "listed_date": "2019-08-15", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Raccoon", "scientific_name": "Procyon lotor", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Raccoon dog", "scientific_name": "Nyctereutes procyonoides", "listed_date": "2019-02-02", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Red swamp crayfish", "scientific_name": "Procambarus clarkii", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Ruddy duck", "scientific_name": "Oxyura jamaicensis", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Sacred ibis", "scientific_name": "Threskiornis aethiopicus", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Siberian chipmunk", "scientific_name": "Tamias sibiricus", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Small Asian mongoose / Javan mongoose", "scientific_name": "Herpestes javanicus", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Spiny-cheek crayfish", "scientific_name": "Orconectes limosus (Faxonius limosus)", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Striped eel catfish", "scientific_name": "Plotosus lineatus", "listed_date": "2019-08-15", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Topmouth gudgeon (stone moroko)", "scientific_name": "Pseudorasbora parva", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "Virile crayfish", "scientific_name": "Orconectes virilis (Faxonius virilis)", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-animal-species-rules-in-england-and-wales" },
            { "common_name": "American skunk cabbage", "scientific_name": "Lysichiton americanus", "listed_date": "2016-08-03", "spread": "widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Chilean rhubarb", "scientific_name": "Gunnera tinctoria", "listed_date": "2017-08-02", "spread": "widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Curly waterweed", "scientific_name": "Lagarosiphon major", "listed_date": "2016-08-03", "spread": "widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Floating pennywort", "scientific_name": "Hydrocotyle ranunculoides", "listed_date": "2016-08-03", "spread": "widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Giant hogweed", "scientific_name": "Heracleum mantegazzianum", "listed_date": "2017-08-02", "spread": "widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Himalayan balsam", "scientific_name": "Impatiens glandulifera", "listed_date": "2017-08-02", "spread": "widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Nuttall's waterweed", "scientific_name": "Elodea nuttallii", "listed_date": "2017-08-02", "spread": "widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Parrot's feather", "scientific_name": "Myriophyllum aquaticum", "listed_date": "2016-08-03", "spread": "widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Alligator weed", "scientific_name": "Alternanthera philoxeroides", "listed_date": "2017-08-02", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Asiatic tearthumb", "scientific_name": "Persicaria perfoliata", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Balloon vine", "scientific_name": "Cardiospermum grandiflorum", "listed_date": "2019-08-15", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Broadleaf watermilfoil", "scientific_name": "Myriophyllum heterophyllum", "listed_date": "2017-08-02", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Broomsedge bluestem", "scientific_name": "Andropogon virginicus", "listed_date": "2019-08-15", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Chinese bushclover", "scientific_name": "Lespedeza cuneata", "listed_date": "2019-08-15", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Chinese tallow", "scientific_name": "Triadica sebifera", "listed_date": "2019-08-15", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Common milkweed", "scientific_name": "Asclepias syriaca", "listed_date": "2017-08-02", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Crimson fountaingrass", "scientific_name": "Pennisetum setaceum", "listed_date": "2017-08-02", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Eastern baccharis", "scientific_name": "Baccharis halimifolia", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Fanwort", "scientific_name": "Cabomba caroliniana", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Floating primrose-willow", "scientific_name": "Ludwigia peploides", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Golden wreath wattle", "scientific_name": "Acacia saligna", "listed_date": "2019-08-15", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Japanese hop", "scientific_name": "Humulus scandens", "listed_date": "2019-08-15", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Japanese stiltgrass", "scientific_name": "Microstegium vimineum", "listed_date": "2017-08-02", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Kudzu vine", "scientific_name": "Pueraria lobata", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Mesquite", "scientific_name": "Prosopis juliflora", "listed_date": "2019-08-15", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Perennial veldt grass", "scientific_name": "Ehrharta calycina", "listed_date": "2019-08-15", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Persian hogweed", "scientific_name": "Heracleum persicum", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Purple pampas grass", "scientific_name": "Cortaderia jubata", "listed_date": "2019-08-15", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Salvinia moss", "scientific_name": "Salvinia molesta", "listed_date": "2019-08-15", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Senegal tea plant", "scientific_name": "Gymnocoronis spilanthoides", "listed_date": "2019-08-15", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Sosnowsky's hogweed", "scientific_name": "Heracleum sosnowskyi", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Tree of Heaven", "scientific_name": "Ailanthus altissima", "listed_date": "2019-08-15", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Vine-like fern", "scientific_name": "Lygodium japonicum", "listed_date": "2019-08-15", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Water hyacinth", "scientific_name": "Eichhornia crassipes", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Water-primrose", "scientific_name": "Ludwigia grandiflora", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" },
            { "common_name": "Whitetop weed", "scientific_name": "Parthenium hysterophorus", "listed_date": "2016-08-03", "spread": "non widely spread" ,"url": "https://www.gov.uk/guidance/invasive-non-native-alien-plant-species-rules-in-england-and-wales" }
        ]
    };

    invasiveSpecies = invasiveData;
    if (invasiveData.invasive_species) {
        invasiveData.invasive_species.forEach(species => {
            invasiveScientificNames.add(species.scientific_name.toLowerCase());
            invasiveCommonNames.add(species.common_name.toLowerCase());
        });
    }
    console.log("Invasive species data initialized:", invasiveScientificNames.size, "scientific names,", invasiveCommonNames.size, "common names");
}

function isInvasive(scientificName, commonName) {
    if (!scientificName && !commonName) return false;
    const sci = scientificName ? scientificName.toLowerCase() : '';
    const com = commonName ? commonName.toLowerCase() : '';
    const match = invasiveScientificNames.has(sci) || invasiveCommonNames.has(com);
    if (commonName && commonName.includes('squirrel')) {
        console.log("Checking squirrel:", { scientificName, commonName, sci, com, hasScientific: invasiveScientificNames.has(sci), hasCommon: invasiveCommonNames.has(com), match: match });
    }
    return match;
}

function getInvasiveBadge() {
    return "<span class='badge badge-danger' style='margin-right:6px;' title='This species is on the UK invasive species list'>Listed Invasive</span>";
}
