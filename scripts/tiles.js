import { score } from "./score.js";
import { timer } from "./timer.js";
import { history } from "./history.js";
import { createBingoTable } from "./utils.js";

//Random ID
const randomID = () => {
  let id = Math.random().toString(16).slice(2);
  return id;
};

//Called every time a tile was clicked on
const tileClicked = (e) => {
  tiles.skippable = false;

  //Toggle selection
  let tile = e.target;
  tile.classList.toggle("selected");

  let allTiles = Array.from(tiles.getAll());
  let selectedTiles = allTiles.filter((tile) =>
    tile.classList.contains("selected")
  );
  let winningTiles = [];

  //Clear tile colours
  allTiles.forEach(
    (tile) =>
      !tile.classList.contains("free") && tile.classList.remove("selected")
  );
  allTiles.forEach((tile) => tile.classList.remove("win"));

  //Set colour on selected tiles
  selectedTiles.forEach((tile) => tile.classList.add("selected"));

  //Search for winning tiles/bingo
  for (let i = 0; i < 5; i++) {
    let selectedInRow = allTiles
      .filter((tile) => tile.y == i)
      .filter((tile) => tile.classList.contains("selected"));
    let selectedInColumn = allTiles
      .filter((tile) => tile.x == i)
      .filter((tile) => tile.classList.contains("selected"));
    if (selectedInColumn.length == 5)
      winningTiles = winningTiles.concat(selectedInColumn);
    if (selectedInRow.length == 5)
      winningTiles = winningTiles.concat(selectedInRow);
  }
  let selectedDiagonally1 = allTiles
    .filter((tile) => tile.y == tile.x)
    .filter((tile) => tile.classList.contains("selected"));
  let selectedDiagonally2 = allTiles
    .filter((tile) => 4 - tile.y == tile.x)
    .filter((tile) => tile.classList.contains("selected"));
  if (selectedDiagonally1.length == 5)
    winningTiles = winningTiles.concat(selectedDiagonally1);
  if (selectedDiagonally2.length == 5)
    winningTiles = winningTiles.concat(selectedDiagonally2);

  //set different color for winning tiles
  winningTiles.forEach((tile) => tile.classList.add("win"));

  //On winning condition call function assigned from index.js
  if (winningTiles.length > 0 && tiles.onWin != null) tiles.onWin();

  // Save and update history div
  let historyBox = document.getElementById("historyBox");
  history.save({
    id: tiles.id,
    date: new Date(),
    score: score.get(),
    time: timer.getTime(),
    pb: timer.getPB(),
    card: tiles.getAll(),
  });
  history.updateIn(historyBox);
};

export const tiles = {
  id: null,

  //Let the player skip the bingo without losing a point
  //if no tiles were selected before
  skippable: true,

  //Function assigned by index.js
  onWin: null,

  //Create tiles inside supplied element
  createIn: (div) => {
    // Create table element
    let table = createBingoTable((cell, i, j) => {
      cell.className = "tile";
      cell.y = i;
      cell.x = j;
      //Center slot is a free slot
      if (i === 2 && j === 2) {
        cell.classList.add("selected", "free");
      } else {
        cell.addEventListener("click", tileClicked);
      }
    });
    div.appendChild(table);
  },

  //add new text to each tile according to newSlots
  regenerate: (newSlots) => {
    //re-render history div
    let historyBox = document.getElementById("historyBox");
    history.init();
    history.reRenderIn(historyBox);

    //Tiles initialization
    tiles.id = randomID();
    tiles.skippable = true;

    tiles.getAll().forEach((thisSlot) => {
      let randomSlot = newSlots.pop();

      if (thisSlot.classList.contains("free")) {
        //The free slot should always be selected and contains no text inside
        thisSlot.classList.remove("win");
        thisSlot.innerText = "";
      } else {
        //Reset classes, add slot string and helperText
        thisSlot.classList.remove("win", "selected");
        thisSlot.innerText = randomSlot.string;
        if (randomSlot.helperText) {
          let helperText = document.createElement("span");
          helperText.innerText = randomSlot.helperText;
          thisSlot.appendChild(helperText);
        }
      }
    });
  },

  //Return all tiles
  getAll: () => {
    return Array.from(document.getElementsByClassName("tile"));
  },
};
