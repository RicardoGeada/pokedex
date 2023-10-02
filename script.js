
let currentPokemon;
let loadedPokemon = [];


async function init() {
    for (let i = 1; i < 10; i++) {
        await loadPokemon(i);
        addPokemon();
    }
    
}

/**
 * load pokemon information from api and store it in currentPokemon variable
 * @param {number} number - number of the pokemon in the pokédex
 */
async function loadPokemon(number) {
    let url = `https://pokeapi.co/api/v2/pokemon/${number}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
    console.log(currentPokemon);
}


function addPokemon() {
    let number = currentPokemon['id'];
    number = number.toString().padStart(4, '0'); // #0001 pad a string until it reaches the desired length
    let name = currentPokemon['name'];
    name = name.charAt(0).toUpperCase() + name.slice(1); // capitalize first letter
    let types = currentPokemon['types'];
    let image = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    let pkmnList = document.getElementById('pkmn-list');
    pkmnList.innerHTML += pkmnListItemHTML(number,name,types,image);
    addTypes(number,types);
}


function addTypes(number,types) {
    let typeContainer = document.getElementById(`pkmn-type-container-${number}`);
    for (let i = 0; i < types.length; i++) {
        let type = types[i]['type']['name'];
        let typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
        typeContainer.innerHTML += /*html*/`
            <div class="type ${type}">${typeCapitalized}</div>
        `
    }

}

function pkmnListItemHTML(number,name,types,image) {
    return /*html*/`
        <li class="pkmn-list-item">
            <div class="pkmn-card ${types[0]['type']['name']}">
                <div class="pkmn-card-number">#${number}</div>
                <div class="pkmn-card-name-type-container">
                    <div class="pkmn-card-name">${name}</div>
                    <div id="pkmn-type-container-${number}" class="pkmn-type-container">
                    </div>
                </div>
                <img class="pkmn-card-image" src="${image}" alt="${name}_img">
                <svg class="svg-pokeball-white" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M80 37.1223C78.5213 16.3741 61.1777 0 40 0C18.8223 0 1.47873 16.3741 0 37.1223H20.884C22.2768 27.8389 30.3049 20.7194 40 20.7194C49.6951 20.7194 57.7232 27.8389 59.116 37.1223H80Z" fill="red"/>
                    <path d="M0.0215476 43.1655H20.9294C22.4433 52.3078 30.4053 59.2806 40 59.2806C49.5947 59.2806 57.5567 52.3078 59.0706 43.1655H79.9785C78.3607 63.7771 61.0797 80 40 80C18.9203 80 1.63933 63.7771 0.0215476 43.1655Z" fill="white"/>
                    <path d="M40 52.9496C47.1702 52.9496 52.9827 47.1519 52.9827 40C52.9827 32.8481 47.1702 27.0504 40 27.0504C32.8298 27.0504 27.0173 32.8481 27.0173 40C27.0173 47.1519 32.8298 52.9496 40 52.9496Z" fill="white"/>
                </svg>    
            </div>
        </li>
    `
}