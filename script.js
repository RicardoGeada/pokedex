const LAST_POKEMON_ID = 1017;
const DIFFERENT_POKEMON_TYPES = 18;
let currentIndex = 0;
let currentPokemon;
let currentSpecies;
let currentEvolutionChain;
let loadedPokemon = [];
let allPokemon = [];
let searchPokemon = [];
let detailViewOpen = false;

async function init() {
    await loadAllPokemonData();
    searchPokemon = [...allPokemon];
    renderPokemonListItems(currentIndex,currentIndex + 30);
}

// LOCAL STORAGE

function setItem(key,data) {
    localStorage.setItem(key,JSON.stringify(data));
}

function getItem(key) {
    if (localStorage.getItem(key)) {
        return JSON.parse(localStorage.getItem(key));
    }
}

function loadAllPokemonFromLocalStorage() {
    if (getItem('allPokemon') != null) {
        allPokemon = getItem('allPokemon');
        console.log('STORAGE');
        return true;
    } else {
        return false 
    };
}

// SEARCH
function searchPokemonName() {
    let search = document.getElementById('search').value.toLowerCase();
    searchPokemon = [];
    currentIndex = 0;
    allPokemon.forEach((pokemon) => pokemon['name'].includes(search) ? searchPokemon.push(pokemon) : null);
    document.getElementById('pkmn-list').innerHTML = '';
    const end = searchPokemon.length >= 30 ? 30 : searchPokemon.length;
    renderPokemonListItems(0,end);
}

function renderPokemonListItems(start,end) {
    end = end <= LAST_POKEMON_ID ? end : LAST_POKEMON_ID; // LIMIT FOR END POINT
    for (let i = start; i < end; i++) {
        generatePokemonListItem(i);
    };
    currentIndex = end;
}

async function loadAllPokemonData() {
    loadAllPokemonFromLocalStorage() ? loadAllPokemonFromLocalStorage() : await loadAllPokemon();
}

async function loadAllPokemon() { 
        let url = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${LAST_POKEMON_ID}`;
        let response = await fetch(url);
        allPokemon.push(await response.json());
        allPokemon = allPokemon[0]['results'];
        // addIdToAllPokemon
        for (let i = 0; i < allPokemon.length; i++) {
            allPokemon[i]['id'] = i + 1;
            allPokemon[i]['types'] = [];
            allPokemon[i]['image'] = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i + 1}.png`;
            allPokemon[i]['liked'] = false;
        };
        // addTypesToAllPokemon
        await addTypesToAllPokemon();
        setItem('allPokemon',allPokemon);
        console.log('API');
}

async function addTypesToAllPokemon() {
    for (let i = 1; i <= DIFFERENT_POKEMON_TYPES; i++) {
        let url = 'https://pokeapi.co/api/v2/type/' + i;
        let response = await fetch(url);
        let responseAsJSON = await response.json();
        let type = responseAsJSON['name'];
        let allPokemonWithType = responseAsJSON['pokemon'];
        for (let j = 0; j < allPokemonWithType.length; j++) {
            const pokemonUrl = allPokemonWithType[j]['pokemon']['url'];
            const pokemonID = pokemonUrl.match(/\/(\d+)\/$/)[1];
            const typeSlot = allPokemonWithType[j]['slot']; // Is it the main type or the secondary type?
            let index = allPokemon.findIndex( p => p['id'] == pokemonID);
            if (index >= 0) {
                if (typeSlot == 1) {
                    allPokemon[index].types[0] = type;
                };
                if (typeSlot == 2) {
                    allPokemon[index].types[1] = type;
                }
            }
        }
    }
}

/**
 * load pokemon information from api and store it in currentPokemon variable
 * @param {number} idOrName - id or name of the pokemon in the pokédex
 */
async function loadPokemon(idOrName) {
    let loaded = loadedPokemon.find( p => p['name'] == idOrName || p['id'] == idOrName);
    if (!loaded) {
        let url = `https://pokeapi.co/api/v2/pokemon/${idOrName}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        saveLoadedPokemon();
    } else {
        currentPokemon = loaded;
    }
}

async function loadSpecies(idOrName) {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${idOrName}/`;
    let response = await fetch(url);
    currentSpecies = await response.json();
}

async function loadEvolutionChain(id) {
    let url = id;
    let response = await fetch(url);
    currentEvolutionChain = await response.json();
}



/**
 * save the current pokemon to the loadedPokemon Array
 */
function saveLoadedPokemon() {
    let isCurrentPokemonSaved = loadedPokemon.find( pokemon => pokemon['id'] == currentPokemon['id']);
    if (!isCurrentPokemonSaved) {
        loadedPokemon.push(currentPokemon);
    } else {
        console.log('Pokemon already loaded.');
    }
}


// function addPokemon() {
//     let id = currentPokemon['id'];
//     let number = currentPokemon['id'];
//     number = number.toString().padStart(4, '0'); // #0001 pad a string until it reaches the desired length
//     let name = currentPokemon['name'];
//     name = name.charAt(0).toUpperCase() + name.slice(1); // capitalize first letter
//     let types = currentPokemon['types'];
//     let image = currentPokemon['sprites']['other']['official-artwork']['front_default'];
//     let pkmnList = document.getElementById('pkmn-list');
//     if(!document.getElementById(`pkmn-id-${number}`)) {
//         pkmnList.innerHTML += pkmnListItemHTML(number,name,types,image,id);
//     } else {
//         console.log('Pokmon already rendered')
//     }
// }


function generateTypeBadges(types) {
    let typesHTML = ''
    for (let i = 0; i < types.length; i++) {
        let type = types[i];
        typesHTML += /*html*/`
            <div class="type ${type}">${type}</div>
        `
    };
    return typesHTML;
}


async function generatePokemonListItem(i) {
    let pokemon = searchPokemon[i];
    let id = pokemon['id'];
    let number = pokemon['id'].toString().padStart(4,'0');
    let name = pokemon['name'];
    let types = pokemon['types'];
    let image = pokemon['image'];
    let pkmnList = document.getElementById('pkmn-list');
    if(!document.getElementById(`pkmn-id-${number}`)) {
        pkmnList.innerHTML += pkmnListItemHTML(number,name,types,image,id);
    };
}

function pkmnListItemHTML(number,name,types,image,id) {
    return /*html*/`
        <li id="pkmn-id-${number}" class="pkmn-list-item" onclick="openDetailView(${id})">
            <div class="pkmn-card ${types[0]}">
                <div class="pkmn-card-number">#${number}</div>
                <div class="pkmn-card-name-type-container">
                    <div class="pkmn-card-name">${name}</div>
                    <div id="pkmn-type-container-${number}" class="pkmn-type-container">
                        ${generateTypeBadges(types)}
                    </div>
                </div>
                <img class="pkmn-card-image" src="${image}" alt="${name}_img">
                <svg class="svg-pokeball-white" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M80 37.1223C78.5213 16.3741 61.1777 0 40 0C18.8223 0 1.47873 16.3741 0 37.1223H20.884C22.2768 27.8389 30.3049 20.7194 40 20.7194C49.6951 20.7194 57.7232 27.8389 59.116 37.1223H80Z" fill="white"/>
                    <path d="M0.0215476 43.1655H20.9294C22.4433 52.3078 30.4053 59.2806 40 59.2806C49.5947 59.2806 57.5567 52.3078 59.0706 43.1655H79.9785C78.3607 63.7771 61.0797 80 40 80C18.9203 80 1.63933 63.7771 0.0215476 43.1655Z" fill="white"/>
                    <path d="M40 52.9496C47.1702 52.9496 52.9827 47.1519 52.9827 40C52.9827 32.8481 47.1702 27.0504 40 27.0504C32.8298 27.0504 27.0173 32.8481 27.0173 40C27.0173 47.1519 32.8298 52.9496 40 52.9496Z" fill="white"/>
                </svg>    
            </div>
        </li>
    `
}

/**
 * activate scroll eventListener to load more pokemon on scroll
 */
function onscrollLoadMorePokemon() {
        let pkmnList = document.getElementById('pkmn-list');
        if (pkmnList.scrollHeight - pkmnList.offsetHeight == pkmnList.scrollTop) {
            const end = currentIndex + 5 < searchPokemon.length ? currentIndex + 5 : searchPokemon.length;
            renderPokemonListItems(currentIndex,end);
        };
}

/**
 * loads the next higher pokemon id and adds it to the list
 */
// async function loadNextPokemon() {
//     await loadPokemon(currentPokemon['id'] + 1);
//     addPokemon();
// }


/**
 * POPUP VIEW
 */


async function openDetailView(id) {
    let popupContainer = document.getElementById('popup-container');
    let popupDetailView = document.getElementById('popup-detail-view');
    popupDetailView.innerHTML = await generateDetailViewHTML(id);
    getLikeImage(id);
    document.documentElement.style.setProperty('--color-active-type', `var(--color-${currentPokemon['types'][0]['type']['name']})`);
    popupContainer.classList.remove('d-none');
    document.getElementById('image-slide-current').scrollIntoView({behavior: 'instant'}); // Focus On Image Slide 3
    setupImageSlider();
}



function closeDetailView() {
    let popupContainer = document.getElementById('popup-container');
    let popupDetailView = document.getElementById('popup-detail-view');
    popupContainer.classList.add('d-none');
    popupDetailView.innerHTML = '';
}


async function generateDetailViewHTML(id) {
    await loadPokemon(id);
    await loadSpecies(id);
    await loadEvolutionChain(currentSpecies['evolution_chain']['url']);
    let pokemon = loadedPokemon.find( p => p['id'] == id);
    let prevPokemon = allPokemon.find( p => p['id'] == id - 1) ? allPokemon.find( p => p['id'] == id - 1) : null;
    let nextPokemon = allPokemon.find( p => p['id'] == id + 1) ? allPokemon.find( p => p['id'] == id + 1) : null;
    let pkmnTypes = getTypesFromPokemon(pokemon);
    let pkmnNumber = id.toString().padStart(4, '0');
    let pkmnName = pokemon['name'];
    let pkmnImage = pokemon['sprites']['other']['official-artwork']['front_default'];
    // ABOUT
    let pkmnFlavorText = getFlavorText();
    let pkmnSpecies = pokemon['species']['name'];
    let pkmnHeight = pokemon['height'] / 10;
    let pkmnWeight = pokemon['weight'] / 10;
    let pkmnAbilities = getAbilitesFromPokemon(pokemon);
    let pkmnGenderRatio = getGenderRatio();
    let pkmnEggGroups = getEggGroup();
    let pkmnEggCycle = getEggCycle();
    // BASE_STATS
    let pkmnHP = pokemon['stats'][0]['base_stat'];
    let pkmnATK = pokemon['stats'][1]['base_stat'];
    let pkmnDEF = pokemon['stats'][2]['base_stat'];
    let pkmnSpATK = pokemon['stats'][3]['base_stat'];
    let pkmnSpDEF = pokemon['stats'][4]['base_stat'];
    let pkmnSPEED = pokemon['stats'][5]['base_stat'];
    let pkmnStatTotal = pkmnHP + pkmnATK + pkmnDEF + pkmnSpATK + pkmnSpDEF + pkmnSPEED;
    // EVOLUTION 
    return /*html*/`
            <div class="popup-dv-top">
                <div class="popup-dv-header">
                    <button onclick="closeDetailView()">
                        <img src="./img/arrow-back.svg" alt="back-arrow">
                    </button>
                    <div class="popup-dv-number">${pkmnNumber}</div>
                    <button onclick="toggleLike(${id})">
                        <img id="popup-dv-like" src="./img/heart.svg" alt="back-arrow">
                    </button>
                </div>
                <div class="popup-dv-top-container">
                    <div class="popup-dv-pkmn-name">${pkmnName}</div>
                    <div class="popup-dv-pkmn-types-container">
                        ${generateTypeBadges(pkmnTypes)}
                    </div>
                    <div id="popup-dv-image-slider" class="popup-dv-image-slider" onscroll="slideToPokemon(${id})">
                        ${generatePrevSlide(prevPokemon)}
                        <div id="image-slide-current" class="image-slide">
                            <img class="popup-dv-pkmn-image" src="${pkmnImage}" alt="${pkmnName}_img">
                        </div>
                        ${generateNextSlide(nextPokemon)}
                    </div> 
                </div>
            </div>
            <div id="popup-dv-info-container" class="popup-dv-info-container">
                <div class="popup-dv-info-nav">
                    <a class="nav-menu-item active" href="#info-slide-1">
                        <p>About</p>
                    </a>
                    <a class="nav-menu-item" href="#info-slide-2">
                        <p>Base Stats</p>
                    </a>
                    <a class="nav-menu-item" href="#info-slide-3">
                        <p>Evolution</p>
                    </a>
                </div>
                <div id="popup-dv-info-slider" class="popup-dv-info-slider" onscroll="checkShownInfo()">
                    <!-- ABOUT -->
                    <div id="info-slide-1" class="popup-dv-info-slide">
                        <table>
                            <tbody>
                                <div class="flavor-text">"${pkmnFlavorText}"</div>
                                <tr class="info-slide-tr">
                                    <td class="category">Species</td>
                                    <td class="info">${pkmnSpecies}</td>
                                </tr>
                                <tr class="info-slide-tr">
                                    <td class="category">Height</td>
                                    <td class="info">${pkmnHeight}m</td>
                                </tr>
                                <tr class="info-slide-tr">
                                    <td class="category">Weight</td>
                                    <td class="info">${pkmnWeight}kg</td>
                                </tr>
                                <tr class="info-slide-tr">
                                    <td class="category">Abilities</td>
                                    <td class="info">${pkmnAbilities}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table>
                            <tbody>
                                <caption>Breeding</caption>
                                ${pkmnGenderRatio}
                                <tr class="info-slide-tr">
                                    <td class="category">Egg Groups</td>
                                    <td class="info">${pkmnEggGroups}</td>
                                </tr>
                                <tr class="info-slide-tr">
                                    <td class="category">Egg Cycle</td>
                                    <td class="info">${pkmnEggCycle}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- BASE STATS -->
                    <div id="info-slide-2" class="popup-dv-info-slide">
                        <table>
                            <tbody>
                                <tr class="info-slide-tr">
                                    <td class="category">HP</td>
                                    <td class="info">${pkmnHP}</td>
                                    <td class="bar">
                                        <div class="bar-border">
                                            <div class="bar-fill ${pkmnTypes[0]}" style="width: ${(pkmnHP / pkmnStatTotal) * 100}%;"></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="info-slide-tr">
                                    <td class="category">Attack</td>
                                    <td class="info">${pkmnATK}</td>
                                    <td class="bar">
                                        <div class="bar-border">
                                            <div class="bar-fill ${pkmnTypes[0]}" style="width: ${(pkmnATK / pkmnStatTotal) * 100}%;"></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="info-slide-tr">
                                    <td class="category">Defense</td>
                                    <td class="info">${pkmnDEF}</td>
                                    <td class="bar">
                                        <div class="bar-border">
                                            <div class="bar-fill ${pkmnTypes[0]}" style="width: ${(pkmnDEF / pkmnStatTotal) * 100}%;"></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="info-slide-tr">
                                    <td class="category">Sp. Atk</td>
                                    <td class="info">${pkmnSpATK}</td>
                                    <td class="bar">
                                        <div class="bar-border">
                                            <div class="bar-fill ${pkmnTypes[0]}" style="width: ${(pkmnSpATK / pkmnStatTotal) * 100}%;"></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="info-slide-tr">
                                    <td class="category">Sp. Def</td>
                                    <td class="info">${pkmnSpDEF}</td>
                                    <td class="bar">
                                        <div class="bar-border">
                                            <div class="bar-fill ${pkmnTypes[0]}" style="width: ${(pkmnSpDEF / pkmnStatTotal) * 100}%;"></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="info-slide-tr">
                                    <td class="category">Speed</td>
                                    <td class="info">${pkmnSPEED}</td>
                                    <td class="bar">
                                        <div class="bar-border">
                                            <div class="bar-fill ${pkmnTypes[0]}" style="width: ${(pkmnSPEED / pkmnStatTotal) * 100}%;"></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="info-slide-tr total">
                                    <td class="category">Total</td>
                                    <td class="info">${pkmnStatTotal}</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    <!-- EVOLUTION CHAIN -->
                    <div id="info-slide-3" class="popup-dv-info-slide">
                        <table>
                            <tbody>
                                ${generateEvolutionChain()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    `; 
}

// LIKE
function getLikeImage(id) {
    let pokemon = allPokemon.find( p => p['id'] == id);
    let likeImage = document.getElementById('popup-dv-like');
    if (pokemon['liked']) {
        likeImage.src = './img/heart-filled.svg';
        likeImage.classList.add('liked');
        setTimeout(function() {likeImage.classList.remove('liked');}, 125);
    } else {
        likeImage.src = './img/heart.svg';
    };
}

function toggleLike(id) {
    let pokemon = allPokemon.find( p => p['id'] == id);
    pokemon['liked'] = pokemon['liked'] ? false : true;
    getLikeImage(id);
    setItem('allPokemon',allPokemon);
}



// IMAGE SLIDES

function generatePrevSlide(prevPokemon) {
    if (prevPokemon != null) {
        return /*html*/`
            <div id="image-slide-prev" class="image-slide pkmn-hidden">
                <img class="popup-dv-pkmn-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${prevPokemon['id']}.png" alt="${prevPokemon['name']}_img">
            </div>
        `;
    } else {
        return '';
    };
}

function generateNextSlide(nextPokemon) {
    if (nextPokemon != null) {
        return /*html*/`
            <div id="image-slide-next" class="image-slide pkmn-hidden">
                <img class="popup-dv-pkmn-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${nextPokemon['id']}.png" alt="${nextPokemon['name']}_img">
            </div>
        `;
    } else {
        return '';
    };
}


function getTypesFromPokemon(pokemon) {
    let types = [];
    for (let i = 0; i < pokemon['types'].length; i++) {
        types.push(pokemon['types'][i]['type']['name']);
    };
    return types;
}

function getAbilitesFromPokemon(pokemon) {
    let abilities = ``;
    for (let i = 0; i < pokemon['abilities'].length; i++) {
        if (i != pokemon['abilities'].length - 1) {
            abilities += `${pokemon['abilities'][i]['ability']['name']}, `
        } else {
            abilities += `${pokemon['abilities'][i]['ability']['name']}`
        }
    }
    return abilities;
}


function getFlavorText() {
    if (currentSpecies['flavor_text_entries'] != null) {
        let flavorText = currentSpecies['flavor_text_entries'].findLast(text => text['language']['name'] == 'en');
        return flavorText['flavor_text'];
    } else {
        return '';
    }
}


function getGenderRatio() {
    if (currentSpecies['gender_rate'] != -1) {
        let femalePercentage = currentSpecies['gender_rate'] * 12.5;
        let malePercentage = 100 - femalePercentage;
        return /*html*/`
           <tr class="info-slide-tr">
                <td class="category">Gender</td>
                <td class="info gender-info">
                    <img src="./img/male.svg" alt="male-icon"><span>${malePercentage}%</span>
                    <img src="./img/female.svg" alt="female-icon"><span>${femalePercentage}%</span>
                </td>
            </tr> 
        `
    } else {
        return '';
    }
}

function getEggGroup() {
    let eggGroups = ``;
    if (currentSpecies['egg_groups'] != null) {
        for (let i = 0; i < currentSpecies['egg_groups'].length; i++) {
            eggGroups += currentSpecies['egg_groups'][i]['name'] + ' ';
        }
    };
    return eggGroups;
}


function getEggCycle() {
    if (currentSpecies['hatch_counter'] != null) {
        return /*html*/`
            ${currentSpecies['hatch_counter']}
        `
    }

}

function generateEvolutionChain() {
    let evolutionChain = ``;
    let basePokemon = allPokemon.find( p => p['id'] == currentEvolutionChain['chain']['species']['url'].match(/\/(\d+)\/$/)[1]);
    let firstEvolutions = currentEvolutionChain['chain']['evolves_to'];
    // BASE TO FIRST EVOLUTION
    for (let i = 0; i < firstEvolutions.length; i++) {
        let firstEvolution = allPokemon.find( p => p['id'] == firstEvolutions[i]['species']['url'].match(/\/(\d+)\/$/)[1]);
        // EVOLUTION DETAILS
        let firstEvDetails = generateEvolutionDetails(firstEvolutions[i]['evolution_details'][0]);
        evolutionChain += /*html*/`
            <tr class="info-slide-tr">
                <td class="evolution-base">
                    <img class="evolution-image" src="${basePokemon['image']}" alt="${basePokemon['name']}_img" onclick="openDetailView(${basePokemon['id']})">
                    <div class="evolution-name">${basePokemon['name']}</div>
                </td>
                <td class="evolution-trigger">
                    ${firstEvDetails}
                </td>
                <td class="evolves-to">
                    <img class="evolution-image" src="${firstEvolution['image']}" alt="${firstEvolution['name']}_img" onclick="openDetailView(${firstEvolution['id']})">
                    <div class="evolution-name">${firstEvolution['name']}</div>
                </td>
            </tr>                 
        `;
        // FIRST TO SECOND EVOLUTION
        if (firstEvolutions[i]['evolves_to'].length > 0) {
            let secondEvolutions = firstEvolutions[i]['evolves_to'];
            for (let j = 0; j < secondEvolutions.length; j++) {
                let secondEvolution = allPokemon.find( p => p['id'] == secondEvolutions[j]['species']['url'].match(/\/(\d+)\/$/)[1]);
                let secondEvDetails = generateEvolutionDetails(secondEvolutions[j]['evolution_details'][0]);
                evolutionChain += /*html*/`
                <tr class="info-slide-tr">
                    <td class="evolution-base">
                        <img class="evolution-image" src="${firstEvolution['image']}" alt="${firstEvolution['name']}_img" onclick="openDetailView(${firstEvolution['id']})">
                        <div class="evolution-name">${firstEvolution['name']}</div>
                    </td>
                    <td class="evolution-trigger">
                        ${secondEvDetails}
                    </td>
                    <td class="evolves-to">
                        <img class="evolution-image" src="${secondEvolution['image']}" alt="${secondEvolution['name']}_img" onclick="openDetailView(${secondEvolution['id']})">
                        <div class="evolution-name">${secondEvolution['name']}</div>
                    </td>
                </tr>                 
            `;
            }
        }
    }
    return evolutionChain;
}


function generateEvolutionDetails(evolutionDetails) {
    let trigger = getEvolutionDetailsTrigger(evolutionDetails);
    let gender = getEvolutionDetailsGenderInfo(evolutionDetails);
    let heldItem = getEvolutionDetailsHeldItem(evolutionDetails);
    let item = getEvolutionDetailsItem(evolutionDetails);
    let knownMove = getEvolutionDetailsKnownMove(evolutionDetails);
    let knownMoveType = getEvolutionDetailsKnownMoveType(evolutionDetails);
    let location = getEvolutionDetailsLocation(evolutionDetails);
    let minAffection = getEvolutionDetailsMinAffection(evolutionDetails);
    let minBeauty = getEvolutionDetailsMinBeauty(evolutionDetails);
    let minHappiness = getEvolutionDetailsMinHappiness(evolutionDetails);
    let minLvl = getEvolutionDetailsMinLvl(evolutionDetails);
    let needsOverworldRain = getEvolutionDetailsNeedsOverworldRain(evolutionDetails);
    let partySpecies = getEvolutionDetailsPartySpecies(evolutionDetails);
    let partyType = getEvolutionDetailsPartyType(evolutionDetails);
    let relativePhysicalStats = getEvolutionDetailsRelativePhysicalStats(evolutionDetails);
    let timeOfDay = getEvolutionDetailsTimeOfDay(evolutionDetails);
    let tradeSpecies = getEvolutionDetailsTradeSpecies(evolutionDetails);
    let turnUpsideDown = getEvolutionDetailsTurnUpsideDown(evolutionDetails);
    return /*html*/`
        ${trigger}
        ${gender}
        ${heldItem}
        ${item}
        ${knownMove}
        ${knownMoveType}
        ${location}
        ${minAffection}
        ${minBeauty}
        ${minHappiness}
        ${minLvl}
        ${needsOverworldRain}
        ${partySpecies}
        ${partyType}
        ${relativePhysicalStats}
        ${timeOfDay}
        ${tradeSpecies}
        ${turnUpsideDown}
    `
}


// TRIGGER
function getEvolutionDetailsTrigger(evolutionDetails) {
    return /*html*/`
        <div class="trigger">${evolutionDetails['trigger']['name']}</div>
    `;
}


// GENDER
function getEvolutionDetailsGenderInfo(evolutionDetails) {
    if (evolutionDetails['gender'] == 1) {
        return /*html*/`
            <div class="gender"><img src="./img/female.svg" alt="female-icon"></div>
        `;
    } else if (evolutionDetails['gender'] == 2) {
        return /*html*/`
            <div class="gender"><img src="./img/male.svg" alt="male-icon"></div>
        `;
    } else {
        return '';
    }
}

// HELD ITEM
function getEvolutionDetailsHeldItem(evolutionDetails) {
    if (evolutionDetails['held_item'] != null) {
        return /*html*/`
            <div class="held-item">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${evolutionDetails['held_item']['name']}.png" alt="${evolutionDetails['held_item']['name']}">
                <div>${evolutionDetails['held_item']['name']}</div>
            </div> 
        `;
    } else {
        return '';
    }
}

// ITEM
function getEvolutionDetailsItem(evolutionDetails) {
    if (evolutionDetails['item'] != null) {
        return /*html*/`
            <div class="item">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${evolutionDetails['item']['name']}.png" alt="${evolutionDetails['item']['name']}">
                <div>${evolutionDetails['item']['name']}</div>
            </div> 
        `;
    } else {
        return '';
    }
}

// KNOWN MOVE
function getEvolutionDetailsKnownMove(evolutionDetails) {
    if(evolutionDetails['known_move'] != null) {
        return /*html*/`
            <div class="known-move">${evolutionDetails['known_move']['name']}</div>
        `
    } else {
        return '';
    }
}

// KNOWN MOVE TYPE
function getEvolutionDetailsKnownMoveType(evolutionDetails) {
    if(evolutionDetails['known_move_type'] != null) {
        return /*html*/`
            <div class="known-move-type">${evolutionDetails['known_move_type']['name']}-move</div>
        `
    } else {
        return '';
    }
}

// LOCATION
function getEvolutionDetailsLocation(evolutionDetails) {
    if (evolutionDetails['location'] != null) {
        return /*html*/`
            <div class="location">location</div>
        `;
    } else {
        return '';
    }
}

// MIN AFFECTION
function getEvolutionDetailsMinAffection(evolutionDetails) {
    if (evolutionDetails['min_affection'] != null) {
        return /*html*/`
            <div class="min-affection">min-affection: ${evolutionDetails['min_affection']}</div>
        `;
    } else {
        return '';
    }
}

// MIN BEAUTY
function getEvolutionDetailsMinBeauty(evolutionDetails) {
    if (evolutionDetails['min_beauty'] != null) {
        return /*html*/`
            <div class="min-beauty">min-beauty: ${evolutionDetails['min_beauty']}</div>
        `;
    } else {
        return '';
    }
}

// MIN HAPPINESS
function getEvolutionDetailsMinHappiness(evolutionDetails) {
    if (evolutionDetails['min_happiness'] != null) {
        return /*html*/`
            <div class="min-happiness">min-happiness: ${evolutionDetails['min_happiness']}</div>
        `;
    } else {
        return '';
    }
}

// MIN LVL
function getEvolutionDetailsMinLvl(evolutionDetails) {
    if (evolutionDetails['min_level'] != null) {
        return /*html*/`
            <div class="min-lvl">Lvl. ${evolutionDetails['min_level']}</div>
        `;
    } else {
        return '';
    }
}

// NEEDS OVERWORLD RAIN
function getEvolutionDetailsNeedsOverworldRain(evolutionDetails) {
    if (evolutionDetails['needs_overworld_rain']) {
        return /*html*/`
            <div class="needs-overworld-rain">raining</div>
        `;
    } else {
        return '';
    }
}


// PARTY SPECIES
function getEvolutionDetailsPartySpecies(evolutionDetails) {
    if (evolutionDetails['party_species'] != null) {
        let pokemon = allPokemon.find( p => p['id'] == evolutionDetails['party_species']['url'].match(/\/(\d+)\/$/)[1])
        return /*html*/`
            <div class="party-species">
                <div>Party Pokemon:</div>
                <img class="party-species-img" src="${pokemon['image']}" alt="${pokemon['name']}_img" onclick="openDetailView(${pokemon['id']})">
            </div>
        `
    } else {
        return '';
    }
}

// PARTY TYPE
function getEvolutionDetailsPartyType(evolutionDetails) {
    if (evolutionDetails['party_type'] != null) {
        return /*html*/`
            <div class="party-type">
                <div>Party Pokemon-Type: </div>
                <div class="type ${evolutionDetails['party_type']['name']}">${evolutionDetails['party_type']['name']}</div>
            </div>
        `
    } else {
        return '';
    }
}

// RELATIVE PHYSICAL STATS
function getEvolutionDetailsRelativePhysicalStats(evolutionDetails) {
        return  evolutionDetails['relative_physical_stats'] == -1 ? /*html*/`
                                                                    <div class="relative-physical-stats">
                                                                        Physical Stats: <br>
                                                                        ATK < DEF
                                                                    </div>
                                                                    `
            :   evolutionDetails['relative_physical_stats'] == 0 ? /*html*/`
                                                                    <div class="relative-physical-stats">
                                                                        Physical Stats: <br>
                                                                        ATK = DEF
                                                                    </div>
                                                                    `
            :   evolutionDetails['relative_physical_stats'] == 1 ? /*html*/`
                                                                    <div class="relative-physical-stats">
                                                                        Physical Stats: <br>
                                                                        ATK > DEF
                                                                    </div>
                                                                    `
            :   '';
}


// TIME OF DAY
function getEvolutionDetailsTimeOfDay(evolutionDetails) {
    if (evolutionDetails['time_of_day'] != '') {
        return /*html*/`
            <div class="time-of-day">${evolutionDetails['time_of_day']}</div>
        `
    } else {
        return '';
    }
}

// TRADE SPECIES 
function getEvolutionDetailsTradeSpecies(evolutionDetails) {
    if (evolutionDetails['trade_species'] != null) {
        let pokemon = allPokemon.find( p => p['id'] == evolutionDetails['trade_species']['url'].match(/\/(\d+)\/$/)[1])
        return /*html*/`
            <div class="trade-species">
                <div>Trade Pokemon:</div>
                <img class="trade-species-img" src="${pokemon['image']}" alt="${pokemon['name']}_img" onclick="openDetailView(${pokemon['id']})">
            </div>
        `
    } else {
        return '';
    }
}

// TURN UPSIDE DOWN
function getEvolutionDetailsTurnUpsideDown(evolutionDetails) {
    if (evolutionDetails['turn_upside_down']) {
        return /*html*/`
            <div class="turn-upside-down">
                <div>Nintendo 3DS:</div>
                <div>Turn Upside Down</div>
            </div>
        `;
    } else {
        return '';
    }
}


// INFO SLIDER HIGHLIGHT
function checkShownInfo() {
    let popup = document.getElementById('popup-dv-info-slider');
    let slides = document.getElementsByClassName('popup-dv-info-slide');
    let navMenuItems = document.getElementsByClassName('nav-menu-item');
    for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        if (Math.round(slide.getBoundingClientRect().left) == Math.round(popup.getBoundingClientRect().left)) {
            for (let j = 0; j < navMenuItems.length; j++) {
                navMenuItems[j].classList.remove('active');
            };
            navMenuItems[i].classList.add('active');
        }
    }
}

// SLIDE TO PREV/NEXT POKEMON
function slideToPokemon(id) {
    let popup = document.getElementById('popup-detail-view');
    let prev = document.getElementById('image-slide-prev');
    let next = document.getElementById('image-slide-next');
    console.log(next.getBoundingClientRect().left);
    console.log(popup.getBoundingClientRect().left);
    if (prev != null && Math.floor(prev.getBoundingClientRect().left) == Math.floor(popup.getBoundingClientRect().left)) {
        if (allPokemon.find( p => p['id'] == id - 1))
        prev.classList.remove('pkmn-hidden');
        openDetailView(id - 1); 
    }
    if (next != null && Math.floor(next.getBoundingClientRect().left) == Math.floor(popup.getBoundingClientRect().left)) {
        if (allPokemon.find( p => p['id'] == id + 1))
        openDetailView(id + 1);
    }
}

// DRAGSCROLL ON DESKTOP FOR IMAGE SLIDER
function setupImageSlider() {
    const imageSlider = document.getElementById('popup-dv-image-slider');
    let isDown = false;
    let startX;
    let scrollLeft;

    imageSlider?.addEventListener('mousedown', (e) => {
        isDown = true;
        imageSlider.classList.add('image-slider-active');
        startX = e.pageX - imageSlider.offsetLeft;
        scrollLeft = imageSlider.scrollLeft;
    })
    imageSlider?.addEventListener('mouseleave', () => {
        isDown = false;
        imageSlider.classList.remove('image-slider-active');
      });
    imageSlider?.addEventListener('mouseup', () => {
      isDown = false;
      imageSlider.classList.remove('image-slider-active');
    });
    imageSlider?.addEventListener('mousemove', (e) => {
      if(!isDown) return;
      e.preventDefault();
      const x = e.pageX - imageSlider.offsetLeft;
      const walk = (x - startX) * 2; //scroll-fast
      imageSlider.scrollLeft = scrollLeft - walk;
    });
}

