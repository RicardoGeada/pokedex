/**
 * POPUP DETAIL VIEW
 * 
 * @param {number} id - id of the pokemon e.g. bulbusaur id = 1;
 * @param {JSON} prevPokemon - JSON DATA from the previous pokemon
 * @param {JSON} nextPokemon - JSON DATA from the next pokemon
 * @param {Array} pkmnTypes - the types of the current pokemon
 * @param {number} pkmnNumber - id of the pokemon padded into format '0001'
 * @param {string} pkmnName - name of the pokemon 
 * @param {URL} pkmnImage - URL to the default artwork e.g. 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
 * @param {string} pkmnFlavorText - the last flavor text of the currentSpecies in english
 * @param {string} pkmnSpecies - species name of the current pokemon
 * @param {number} pkmnHeight - height in m
 * @param {number} pkmnWeight - weight in kg
 * @param {string} pkmnAbilities - all the abilities of the pokemon listed in a string
 * @param {HTML} pkmnGenderRatio - HTML for the gender info
 * @param {string} pkmnEggGroups - all the egg groups of the pokemon listed in a string
 * @param {number} pkmnEggCycle - number of egg cycles to hatch an egg
 * @param {number} pkmnHP - pokmemon health-points
 * @param {number} pkmnATK - pokmemon attack
 * @param {number} pkmnDEF - pokmemon defense
 * @param {number} pkmnSpATK - pokmemon special attack
 * @param {number} pkmnSpDEF - pokmemon special defense
 * @param {number} pkmnSPEED - pokmemon speed
 * @param {number} pkmnStatTotal - pokmemon total stats
 * @returns HTML
 */
function popupDetailViewHTML(id,prevPokemon,nextPokemon,pkmnTypes,pkmnNumber,pkmnName,pkmnImage,pkmnFlavorText,pkmnSpecies,pkmnHeight,pkmnWeight,pkmnAbilities,pkmnGenderRatio,pkmnEggGroups,pkmnEggCycle,pkmnHP,pkmnATK,pkmnDEF,pkmnSpATK,pkmnSpDEF,pkmnSPEED,pkmnStatTotal) {
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
                ${generateTypeBadgesHTML(pkmnTypes)}
            </div>
            <div id="popup-dv-image-slider" class="popup-dv-image-slider" onscroll="slideToPokemon(${id})">
                ${generatePrevSlideHTML(prevPokemon)}
                <div id="image-slide-current" class="image-slide">
                    <img class="popup-dv-pkmn-image" src="${pkmnImage}" alt="${pkmnName}_img" onerror="this.src='./img/not-found.svg'">
                </div>
                ${generateNextSlideHTML(nextPokemon)}
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

//#region IMAGE SLIDES

    /**
     * GENERATE PREV SLIDE
     * @param {JSON} prevPokemon - JSON DATA from the previous pokemon
     * @returns HTML for the previous slide
     */
    function generatePrevSlideHTML(prevPokemon) {
        if (prevPokemon != null) {
            return /*html*/`
                <div id="image-slide-prev" class="image-slide pkmn-hidden">
                    <img class="popup-dv-pkmn-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${prevPokemon['id']}.png" alt="${prevPokemon['name']}_img" onerror="this.src='./img/not-found.svg'">
                </div>
            `;
        } else {
            return '';
        };
    }


    /**
     * GENERATE NEXT SLIDE 
     * @param {JSON} nextPokemon - JSON DATA from the next pokemon
     * @returns HTML for the next slide
     */
    function generateNextSlideHTML(nextPokemon) {
        if (nextPokemon != null) {
            return /*html*/`
                <div id="image-slide-next" class="image-slide pkmn-hidden">
                    <img class="popup-dv-pkmn-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${nextPokemon['id']}.png" alt="${nextPokemon['name']}_img" onerror="this.src='./img/not-found.svg'">
                </div>
            `;
        } else {
            return '';
        };
    }

//#endregion IMAGE SLIDES


/**
 * GENERATE GENDER RATIO HTML
 * 
 * @returns HTML for the gender info
 */
function generateGenderRatioHTML() {
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
        `;
    } else {
        return /*html*/`
        <tr class="info-slide-tr">
             <td class="category">Gender</td>
             <td class="info gender-info">
                Genderless
             </td>
         </tr> 
     `;
    }
}

/**
 * EVOLUTION CHAIN HTML
 * 
 * @param {JSON} base - base pokemon
 * @param {JSON} evolution - pokemon evolution
 * @param {HTML} evolutionDetails - HTML of all evolution details
 * @returns HTML
 */
function evolutionChainHTML(base,evolution,evolutionDetails) {
    return /*html*/`
        <tr class="info-slide-tr">
            <td class="evolution-base">
                <img class="evolution-image" src="${base['image']}" alt="${base['name']}_img" onclick="openDetailView(${base['id']})" onerror="this.src='./img/not-found.svg'">
                <div class="evolution-name">${base['name']}</div>
            </td>
            <td class="evolution-trigger">
                ${evolutionDetails}
            </td>
            <td class="evolves-to">
                <img class="evolution-image" src="${evolution['image']}" alt="${evolution['name']}_img" onclick="openDetailView(${evolution['id']})" onerror="this.src='./img/not-found.svg'">
                <div class="evolution-name">${evolution['name']}</div>
            </td>
        </tr> 
    `;
}

//#region EVOLUTION DETAILS

    /**
     * EVOLUTION DETAIL - TRIGGER
     * 
     * @param {JSON} evolutionDetails - all the evolution details
     * @returns HTML
     */
    function generateTriggerHTML(evolutionDetails) {
        if (evolutionDetails['trigger']) {
            return /*html*/`
            <div class="trigger">${evolutionDetails['trigger']['name']}</div>
        `;
        } else {
            return /*html*/`
            <div class="trigger"></div>
        `;
        }
        
    }


    /**
     * EVOLUTION DETAIL - GENDER
     * 
     * @param {JSON} evolutionDetails - all the evolution details
     * @returns HTML
     */
    function generateGenderInfoHTML(evolutionDetails) {
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

    /**
     * EVOLUTION DETAIL - HELD ITEM
     * 
     * @param {JSON} evolutionDetails - all the evolution details
     * @returns HTML
     */
    function generateHeldItemHTML(evolutionDetails) {
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

    /**
     * EVOLUTION DETAIL - ITEM
     * 
     * @param {JSON} evolutionDetails - all the evolution details
     * @returns HTML
     */
    function generateItemHTML(evolutionDetails) {
        if (evolutionDetails['item'] != null) {
            return /*html*/`
                <div class="item">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${evolutionDetails['item']['name']}.png" alt="${evolutionDetails['item']['name']}" onerror="this.src='./img/not-found.svg'">
                    <div>${evolutionDetails['item']['name']}</div>
                </div> 
            `;
        } else {
            return '';
        }
    }

    /**
     * EVOLUTION DETAIL - KNOWN MOVE
     * 
     * @param {JSON} evolutionDetails - all the evolution details
     * @returns HTML
     */
    function generateKnownMoveHTML(evolutionDetails) {
        if(evolutionDetails['known_move'] != null) {
            return /*html*/`
                <div class="known-move">${evolutionDetails['known_move']['name']}</div>
            `
        } else {
            return '';
        }
    }

    /**
     * EVOLUTION DETAIL - KNOWN MOVE TYPE
     * 
     * @param {JSON} evolutionDetails - all the evolution details
     * @returns HTML
     */
    function generateKnownMoveTypeHTML(evolutionDetails) {
        if(evolutionDetails['known_move_type'] != null) {
            return /*html*/`
                <div class="known-move-type">${evolutionDetails['known_move_type']['name']}-move</div>
            `
        } else {
            return '';
        }
    }

    /**
     * EVOLUTION DETAIL - LOCATION
     * 
     * @param {JSON} evolutionDetails - all the evolution details
     * @returns HTML
     */
    function generateLocationHTML(evolutionDetails) {
        if (evolutionDetails['location'] != null) {
            return /*html*/`
                <div class="location">location</div>
            `;
        } else {
            return '';
        }
    }

    /**
     * EVOLUTION DETAIL - MIN AFFECTION
     * 
     * @param {JSON} evolutionDetails - all the evolution details
     * @returns HTML
     */
    function generateMinAffectionHTML(evolutionDetails) {
        if (evolutionDetails['min_affection'] != null) {
            return /*html*/`
                <div class="min-affection">min-affection: ${evolutionDetails['min_affection']}</div>
            `;
        } else {
            return '';
        }
    }

    /**
     * EVOLUTION DETAIL - MIN BEAUTY
     * 
     * @param {JSON} evolutionDetails - all the evolution details
     * @returns HTML
     */
    function generateMinBeautyHTML(evolutionDetails) {
        if (evolutionDetails['min_beauty'] != null) {
            return /*html*/`
                <div class="min-beauty">min-beauty: ${evolutionDetails['min_beauty']}</div>
            `;
        } else {
            return '';
        }
    }

    /**
     * EVOLUTION DETAIL - MIN HAPPINESS
     * 
     * @param {JSON} evolutionDetails - all the evolution details
     * @returns HTML
     */
    function generateMinHappinessHTML(evolutionDetails) {
        if (evolutionDetails['min_happiness'] != null) {
            return /*html*/`
                <div class="min-happiness">min-happiness: ${evolutionDetails['min_happiness']}</div>
            `;
        } else {
            return '';
        }
    }

    /**
     * EVOLUTION DETAIL - MIN LVL
     * 
     * @param {JSON} evolutionDetails - all the evolution details
     * @returns HTML
     */
    function generateMinLvlHTML(evolutionDetails) {
        if (evolutionDetails['min_level'] != null) {
            return /*html*/`
                <div class="min-lvl">Lvl. ${evolutionDetails['min_level']}</div>
            `;
        } else {
            return '';
        }
    }

    /**
     * EVOLUTION DETAIL - NEEDS OVERWORLD RAIN
     * 
     * @param {JSON} evolutionDetails - all the evolution details
     * @returns HTML
     */
    function generateNeedsOverworldRainHTML(evolutionDetails) {
        if (evolutionDetails['needs_overworld_rain']) {
            return /*html*/`
                <div class="needs-overworld-rain">raining</div>
            `;
        } else {
            return '';
        }
    }


    /**
     * EVOLUTION DETAIL - PARTY SPECIES
     * 
     * @param {JSON} evolutionDetails - all the evolution details
     * @returns HTML
     */
    function generatePartySpeciesHTML(evolutionDetails) {
        if (evolutionDetails['party_species'] != null) {
            let pokemon = allPokemon.find( p => p['id'] == evolutionDetails['party_species']['url'].match(/\/(\d+)\/$/)[1])
            return /*html*/`
                <div class="party-species">
                    <div>Party Pokemon:</div>
                    <img class="party-species-img" src="${pokemon['image']}" alt="${pokemon['name']}_img" onclick="openDetailView(${pokemon['id']})" onerror="this.src='./img/not-found.svg'">
                </div>
            `
        } else {
            return '';
        }
    }

    /**
     * EVOLUTION DETAIL - PARTY TYPE
     * 
     * @param {JSON} evolutionDetails - all the evolution details
     * @returns HTML
     */
    function generatePartyTypeHTML(evolutionDetails) {
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

    /**
     * EVOLUTION DETAIL - RELATIVE PHYSICAL STATS
     * 
     * @param {JSON} evolutionDetails - all the evolution details
     * @returns HTML
     */
    function generateRelativePhysicalStatsHTML(evolutionDetails) {
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


    /**
     * EVOLUTION DETAIL - TIME OF DAY
     * 
     * @param {JSON} evolutionDetails - all the evolution details
     * @returns HTML
     */
    function generateTimeOfDayHTML(evolutionDetails) {
        if (evolutionDetails['time_of_day'] != '') {
            return /*html*/`
                <div class="time-of-day">${evolutionDetails['time_of_day']}</div>
            `
        } else {
            return '';
        }
    }

    /**
     * EVOLUTION DETAIL - TRADE SPECIES
     * 
     * @param {JSON} evolutionDetails - all the evolution details
     * @returns HTML
     */
    function generateTradeSpeciesHTML(evolutionDetails) {
        if (evolutionDetails['trade_species'] != null) {
            let pokemon = allPokemon.find( p => p['id'] == evolutionDetails['trade_species']['url'].match(/\/(\d+)\/$/)[1])
            return /*html*/`
                <div class="trade-species">
                    <div>Trade Pokemon:</div>
                    <img class="trade-species-img" src="${pokemon['image']}" alt="${pokemon['name']}_img" onclick="openDetailView(${pokemon['id']})" onerror="this.src='./img/not-found.svg'">
                </div>
            `
        } else {
            return '';
        }
    }

    /**
     * EVOLUTION DETAIL - TURN UPSIDE
     * 
     * @param {JSON} evolutionDetails - all the evolution details
     * @returns HTML
     */
    function generateTurnUpsideDownHTML(evolutionDetails) {
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

//#endregion EVOLUTION DETAILS