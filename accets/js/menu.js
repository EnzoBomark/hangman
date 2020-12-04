//#region  GLOBAL VARIABLES
//grab all elements for master volume
let masterVolume = document.querySelectorAll('audio');
//Get boolean status for volume
let soundState = document.getElementById('checkbox');
//Get individual sounds for playback
let deathSound = document.getElementById('deathSound');
let winSound = document.getElementById('winSound');
let clickSound = document.getElementById('clickSound');
// Set countries Array from arrayLists.js as standart list
let wordList = countries;
//#endregion GLOBAL VARIABLES

//#region FUNCTIONS
soundState.addEventListener('change', checkbox => {
    function volume(check) { // If checkbox is equal to true return 0.1 else return 0
        return (check ? 0.1 : 0); //conditional status
    }

    document.getElementById('soundBtn').innerHTML = checkbox.target.checked ? 'Sound On' : 'Sound Off';
    masterVolume.forEach(element => element.volume = volume(checkbox.target.checked)); //return (check ? 0.1 : 0);
    clickSound.play();
});

// Only allow one checkbox to be checked at once
function onlyOne(checkbox) {
    let checkboxes = document.getElementsByName('check') // Grab all checkboxes with [name ="check"]

    checkboxes.forEach((item) => {
        item == checkbox ? item.checked = true : item.checked = false; // If item is equal to onlyOne(checkbox) check item else remove check
        if (item.checked == true) { // If item is checked, grab item id to compare witch list to choose
            if (item.id == 'countries') wordList = countries;
            if (item.id == 'states') wordList = states;
            if (item.id == 'animals') wordList = animals;
        }
    })
    clickSound.play();
}

//#endregion FUNCTIONS

// Set master volume to 0.1 on startup
masterVolume.forEach(element => element.volume = 0.1);