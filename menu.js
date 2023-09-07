function player() {
    /* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
    document.getElementById("player").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.player')) {
      var dropdowns = document.getElementsByClassName("player-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

function difficulty() {
    document.getElementById("difficulty").classList.toggle("show");
    }

    window.onclick = function(event) {
    if (!event.target.matches('.difficulty')) {
        var dropdowns = document.getElementsByClassName("difficulty-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
        }
    }
}

function pieceSet() {
    document.getElementById("pieceSet").classList.toggle("show");
    }

    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function(event) {
    if (!event.target.matches('.pieceSet')) {
        var dropdowns = document.getElementsByClassName("pieceSet-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
        }
    }
}

function standardSet() {
    // Set piece variables to match set
    for (let i = 0; i < pieceList.length; i++)
    {
        document.getElementById(`${pieceList[i].file}${pieceList[i].rank}image`).src=`Pieces/standardSet/${pieceList[i].color}_${pieceList[i].pieceType}.png`
    }
}


function fantasySet() {
    //loop through piece list, check if 0, if not then change img attribute
    for (let i = 0; i < pieceList.length; i++)
    {
        document.getElementById(`${pieceList[i].file}${pieceList[i].rank}image`).src=`Pieces/fantasySet/${pieceList[i].color}_${pieceList[i].pieceType}.png`
    }
}


function chrisSet() {
    for (let i = 0; i < pieceList.length; i++)
    {
        document.getElementById(`${pieceList[i].file}${pieceList[i].rank}image`).src=`Pieces/chrisSet/${pieceList[i].color}_${pieceList[i].pieceType}.png`
    }
}

/* code for player switch not finished
function whitePlayer1(){
    whitesMove = true;
}

function blackPlayer1(){
    whitesMove = false;
}*/