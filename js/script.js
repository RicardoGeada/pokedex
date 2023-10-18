const LAST_POKEMON_ID = 1017;
const DIFFERENT_POKEMON_TYPES = 18;
let currentIndex = 0;
let currentPokemon;
let currentSpecies;
let currentEvolutionChain;
let loadedPokemon = [];
let allPokemon = [];
let searchPokemon = [];

/**
 * initialize pokedex
 */
async function init() {
    let loadingScreen = document.getElementById('loading-screen');
    await loadAllPokemonData();
    searchPokemon = [...allPokemon];
    renderPokemonListItems(currentIndex,currentIndex + 30);
    loadingScreen.classList.add('d-none');
}

//#region SAVE & LOAD

    /**
     * set Item to Local Storage
     * @param {key} key - Local Storage Key Name
     * @param {JSON} data - Local Storage Key Value
     */
    function setItem(key,data) {
        localStorage.setItem(key,JSON.stringify(data));
    }

    /**
     * get Item from Local Storage
     * @param {key} key - Local Storage Key Name
     * @returns JSON
     */
    function getItem(key) {
        if (localStorage.getItem(key)) {
            return JSON.parse(localStorage.getItem(key));
        }
    }

    /**
     * loads allPokemon from Local Storage if they exist
     * @returns boolean
     */
    function loadAllPokemonFromLocalStorage() {
        if (getItem('allPokemon') != null) {
            allPokemon = getItem('allPokemon');
            return true;
        } else {
            return false 
        };
    }

    /**
     * loads all pokemon from Local Storage or API
     */
    async function loadAllPokemonData() {
        loadAllPokemonFromLocalStorage() ? loadAllPokemonFromLocalStorage() : await loadAllPokemon();
    }

    /**
     * loads all pokemon from PokeAPI
     */
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
    }


    /**
     * add the types to all Pokemon in allPokemon
     */
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

//#endregion SAVE & LOAD



//#region SEARCH

    /**
     * SEARCH - POKEMON NAME
     */
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

//#endregion SEARCH



//#region LOAD & SAVE - DETAIL VIEW INFOS

    /**
     * LOAD POKEMON information from api and store it in currentPokemon variable
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



    /**
     * LOAD SPECIES information from api and store it in currentSpecies variable
     * @param {number} idOrName - id or name of the pokemon in the pokédex
     */
    async function loadSpecies(idOrName) {
        let url = `https://pokeapi.co/api/v2/pokemon-species/${idOrName}/`;
        let response = await fetch(url);
        currentSpecies = await response.json();
    }



    /**
     * LOAD EVOLUTION CHAIN information from api and store it in currentEvolutionChain variable
     * @param {URL} url - for the evolution chain e.g 'https://pokeapi.co/api/v2/evolution-chain/{id}/' 
     */
    async function loadEvolutionChain(url) {
        let response = await fetch(url);
        currentEvolutionChain = await response.json();
    }



    /**
     * SAVE the current POKEMON to the loadedPokemon array
     */
    function saveLoadedPokemon() {
        let isCurrentPokemonSaved = loadedPokemon.find( pokemon => pokemon['id'] == currentPokemon['id']);
        if (!isCurrentPokemonSaved) {
            loadedPokemon.push(currentPokemon);
        } else {
            console.log('Pokemon already loaded.');
        }
    }

//#endregion LOAD & SAVE - DETAIL VIEW INFOS


//#region LIST VIEW

    /**
     * GENERATE LIST ITEM
     * @param {number} i - index of the searchPokemon Array
     */
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
            setLikeImage(id);
        };
    }



    /**
     * POKEMON LIST ITEM HTML
     * 
     * @param {number} number - id padded into format e.g. '0001'
     * @param {string} name - name of the pokemon
     * @param {Array} types - array with all the types of the pokemon
     * @param {URL} image - URL to the default artwork e.g. 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
     * @param {number} id - id of the pokemon e.g. bulbusaur id = 1;
     * @returns HTML for the list item
     */
    function pkmnListItemHTML(number,name,types,image,id) {
        return /*html*/`
            <li id="pkmn-id-${number}" class="pkmn-list-item" onclick="openDetailView(${id})">
                <div class="pkmn-card ${types[0]}">
                    <div class="pkmn-card-number">#${number}</div>
                    <div class="pkmn-card-name-type-container">
                        <div class="pkmn-card-name">${name}</div>
                        <div id="pkmn-type-container-${number}" class="pkmn-type-container">
                            ${generateTypeBadgesHTML(types)}
                        </div>
                    </div>
                    <img class="pkmn-card-image" src="${image}" alt="${name}_img">
                    <svg class="svg-pokeball-white" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M80 37.1223C78.5213 16.3741 61.1777 0 40 0C18.8223 0 1.47873 16.3741 0 37.1223H20.884C22.2768 27.8389 30.3049 20.7194 40 20.7194C49.6951 20.7194 57.7232 27.8389 59.116 37.1223H80Z" fill="white"/>
                        <path d="M0.0215476 43.1655H20.9294C22.4433 52.3078 30.4053 59.2806 40 59.2806C49.5947 59.2806 57.5567 52.3078 59.0706 43.1655H79.9785C78.3607 63.7771 61.0797 80 40 80C18.9203 80 1.63933 63.7771 0.0215476 43.1655Z" fill="white"/>
                        <path d="M40 52.9496C47.1702 52.9496 52.9827 47.1519 52.9827 40C52.9827 32.8481 47.1702 27.0504 40 27.0504C32.8298 27.0504 27.0173 32.8481 27.0173 40C27.0173 47.1519 32.8298 52.9496 40 52.9496Z" fill="white"/>
                    </svg>
                    <img id="pkmn-card-heart-${id}" class="pkmn-card-heart" src="./img/heart.svg" alt="heart-icon">    
                </div>
            </li>
        `;
    }

    /**
     * GENERATE TYPE BADGES HTML
     * @param {Array} types - array with all the types of the pokemon
     * @returns HTML
     */
    function generateTypeBadgesHTML(types) {
        let typesHTML = ''
        for (let i = 0; i < types.length; i++) {
            let type = types[i];
            typesHTML += /*html*/`
                <div class="type ${type}">${type}</div>
            `
        };
        return typesHTML;
    }

    /**
     * activate scroll eventListener to load more pokemon on scroll
     */
    function onscrollLoadMorePokemon() {
        let pkmnList = document.getElementById('pkmn-list');
        if (pkmnList.scrollHeight - pkmnList.offsetHeight - pkmnList.scrollTop < 10 ) {
            const end = currentIndex + 5 < searchPokemon.length ? currentIndex + 5 : searchPokemon.length;
            renderPokemonListItems(currentIndex,end);
        };
    }


    function loadMorePokemon() {
            const end = currentIndex + 5 < searchPokemon.length ? currentIndex + 20 : searchPokemon.length;
            renderPokemonListItems(currentIndex,end);
    }

//#endregion LIST VIEW







