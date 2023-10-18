
/**
 * OPEN DETAIL VIEW
 * 
 * open popup with additional information about the pokemon
 * @param {number} id - id of the pokemon e.g. bulbusaur id = 1;
 */
async function openDetailView(id) {
    let popupContainer = document.getElementById('popup-container');
    let popupDetailView = document.getElementById('popup-detail-view');
    popupDetailView.innerHTML = await generateDetailViewHTML(id);
    setLikeImage(id);
    document.documentElement.style.setProperty('--color-active-type', `var(--color-${currentPokemon['types'][0]['type']['name']})`);
    popupContainer.classList.remove('d-none');
    document.getElementById('image-slide-current').scrollIntoView({behavior: 'instant'}); // Focus On Image Slide 3
    setupImageSlider();
}


/**
 * CLOSE DETAIL VIEW
 * 
 * close the popup with additional information about the pokemon
 */
function closeDetailView() {
    let popupContainer = document.getElementById('popup-container');
    let popupDetailView = document.getElementById('popup-detail-view');
    popupContainer.classList.add('d-none');
    popupDetailView.innerHTML = '';
}


/**
 * GENERATE DETAIL VIEW
 * 
 * generate HTML for the detail view
 * @param {number} id - id of the pokemon e.g. bulbusaur id = 1;
 * @returns HTML
 */
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
    let pkmnHeight = pokemon['height'] / 10; // dm -> m
    let pkmnWeight = pokemon['weight'] / 10; // hg -> kg
    let pkmnAbilities = getAbilitesFromPokemon(pokemon);
    let pkmnGenderRatio = generateGenderRatioHTML();
    let pkmnEggGroups = getEggGroups();
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
    return popupDetailViewHTML(id,prevPokemon,nextPokemon,pkmnTypes,pkmnNumber,pkmnName,pkmnImage,pkmnFlavorText,pkmnSpecies,pkmnHeight,pkmnWeight,pkmnAbilities,pkmnGenderRatio,pkmnEggGroups,pkmnEggCycle,pkmnHP,pkmnATK,pkmnDEF,pkmnSpATK,pkmnSpDEF,pkmnSPEED,pkmnStatTotal);
}


// LIKE 

/**
 * SET LIKE IMAGE
 * 
 * set the like image source depending on the like state
 * @param {number} id - id of the pokemon e.g. bulbusaur id = 1;
 */
function setLikeImage(id) {
    let pokemon = allPokemon.find( p => p['id'] == id);
    let likeImage = document.getElementById('popup-dv-like');
    let listLikeImage = document.getElementById(`pkmn-card-heart-${id}`);
    let likeImages = [likeImage, listLikeImage];
    for (let i = 0; i < likeImages.length; i++) {
        const image = likeImages[i];
        if (image && pokemon['liked']) {
            image.src = './img/heart-filled.svg';
            image.classList.add('liked');
            setTimeout(function() {image.classList.remove('liked');}, 125);
        } else if (image && !pokemon['liked']) {
            image.src = './img/heart.svg';
        }
    }       
}



/**
 * TOGGLE LIKE
 * 
 * toggle the like state for the pokemon
 * @param {number} id - id of the pokemon e.g. bulbusaur id = 1;
 */
function toggleLike(id) {
    let pokemon = allPokemon.find( p => p['id'] == id);
    pokemon['liked'] = pokemon['liked'] ? false : true;
    setLikeImage(id);
    setItem('allPokemon',allPokemon);
}



/**
 * GET TYPES FROM POKEMON
 * 
 * get the types from the pokemon JSON and simplify it as an array
 * @param {JSON} pokemon - JSON DATA of the current pokemon
 * @returns Array
 */
function getTypesFromPokemon(pokemon) {
    let types = [];
    for (let i = 0; i < pokemon['types'].length; i++) {
        types.push(pokemon['types'][i]['type']['name']);
    };
    return types;
}



/**
 * GET ABILITIES FROM POKEMON
 * 
 * get abilities from the current pokemon
 * @param {JSON} pokemon - JSON DATA of the current pokemon
 * @returns string
 */
function getAbilitesFromPokemon(pokemon) {
    let abilities = ``;
    for (let i = 0; i < pokemon['abilities'].length; i++) {
        if (i != pokemon['abilities'].length - 1) {
            abilities += `${pokemon['abilities'][i]['ability']['name']}` + `, `;
        } else {
            abilities += `${pokemon['abilities'][i]['ability']['name']}`;
        }
    }
    return abilities;
}

/**
 * GET FLAVOR TEXT
 * 
 * get the last flavor text of the currentSpecies in english 
 * @returns string
 */
function getFlavorText() {
    if (currentSpecies['flavor_text_entries'] != null) {
        let flavorText = currentSpecies['flavor_text_entries'].findLast(text => text['language']['name'] == 'en');
        return flavorText['flavor_text'];
    } else {
        return '';
    }
}



/**
 * GET EGG GROUPS
 * 
 * get egg groups from the current pokemon
 * @returns string
 */
function getEggGroups() {
    let eggGroups = ``;
    if (currentSpecies['egg_groups'] != null) {
        for (let i = 0; i < currentSpecies['egg_groups'].length; i++) {
            if (i != currentSpecies['egg_groups'].length -1) {
                eggGroups += currentSpecies['egg_groups'][i]['name'] + ', ';
            } else {
                eggGroups += currentSpecies['egg_groups'][i]['name'];
            };   
        }
    };
    return eggGroups;
}



/**
 * GET EGG CYCLE
 * 
 * get the egg cycle number
 * @returns number
 */
function getEggCycle() {
    if (currentSpecies['hatch_counter'] != null) {
        return /*html*/`
            ${currentSpecies['hatch_counter']}
        `;
    }

}



/**
 * GENERATE EVOLUTION CHAIN
 * 
 * generates evolution chain of the current species
 * @returns HTML
 */
function generateEvolutionChain() {
    let evolutionChain = ``;
    let basePokemon = allPokemon.find( p => p['id'] == currentEvolutionChain['chain']['species']['url'].match(/\/(\d+)\/$/)[1]);
    let firstEvolutions = currentEvolutionChain['chain']['evolves_to'];
    // BASE TO FIRST EVOLUTION
    for (let i = 0; i < firstEvolutions.length; i++) {
        let firstEvolution = allPokemon.find( p => p['id'] == firstEvolutions[i]['species']['url'].match(/\/(\d+)\/$/)[1]);
        let firstEvDetails = generateEvolutionDetails(firstEvolutions[i]['evolution_details'][0]);
        evolutionChain += evolutionChainHTML(basePokemon,firstEvolution,firstEvDetails);
        // FIRST TO SECOND EVOLUTION
        if (firstEvolutions[i]['evolves_to'].length > 0) {
            let secondEvolutions = firstEvolutions[i]['evolves_to'];
            for (let j = 0; j < secondEvolutions.length; j++) {
                let secondEvolution = allPokemon.find( p => p['id'] == secondEvolutions[j]['species']['url'].match(/\/(\d+)\/$/)[1]);
                let secondEvDetails = generateEvolutionDetails(secondEvolutions[j]['evolution_details'][0]);
                evolutionChain += evolutionChainHTML(firstEvolution,secondEvolution,secondEvDetails);
            }
        }
    }
    return evolutionChain;
}



/**
 * GENERATE EVOLUTION DETAILS
 * 
 * go through all evolution details and show them if needed
 * @param {JSON} evolutionDetails - all the evolution details
 * @returns 
 */
function generateEvolutionDetails(evolutionDetails) {
    let trigger = generateTriggerHTML(evolutionDetails);
    let gender = generateGenderInfoHTML(evolutionDetails);
    let heldItem = generateHeldItemHTML(evolutionDetails);
    let item = generateItemHTML(evolutionDetails);
    let knownMove = generateKnownMoveHTML(evolutionDetails);
    let knownMoveType = generateKnownMoveTypeHTML(evolutionDetails);
    let location = generateLocationHTML(evolutionDetails);
    let minAffection = generateMinAffectionHTML(evolutionDetails);
    let minBeauty = generateMinBeautyHTML(evolutionDetails);
    let minHappiness = generateMinHappinessHTML(evolutionDetails);
    let minLvl = generateMinLvlHTML(evolutionDetails);
    let needsOverworldRain = generateNeedsOverworldRainHTML(evolutionDetails);
    let partySpecies = generatePartySpeciesHTML(evolutionDetails);
    let partyType = generatePartyTypeHTML(evolutionDetails);
    let relativePhysicalStats = generateRelativePhysicalStatsHTML(evolutionDetails);
    let timeOfDay = generateTimeOfDayHTML(evolutionDetails);
    let tradeSpecies = generateTradeSpeciesHTML(evolutionDetails);
    let turnUpsideDown = generateTurnUpsideDownHTML(evolutionDetails);
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
    `;
}



/**
 * CHECK SHOWN INFO
 *
 * check shown info and highlight the nav menu
 */
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



/**
 * SLIDE TO PREV/NEXT POKEMON
 * 
 * @param {number} id - id of the pokemon e.g. bulbusaur id = 1;
 */
function slideToPokemon(id) {
    let popup = document.getElementById('popup-detail-view');
    let prev = document.getElementById('image-slide-prev');
    let next = document.getElementById('image-slide-next');
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



/**
 * DRAGSCROLL ON DESKTOP FOR IMAGE SLIDER
 * 
 * setup image slider dragscroll for desktop
 */
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
