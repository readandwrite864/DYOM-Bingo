import {requirements} from "./slotsData.js"

//Requirements list
let requirementsList = [];

//On option click, change color and add/remove requirement name from the list
let optionClicked = (e) => {
  let div = e.target;
  let selected = (e.target.selected = !e.target.selected);
  div.style.backgroundColor = selected ? "rgba(255, 204, 204, 0.75)" : "#eee";
  div.style.borderColor = selected ? "rgba(255, 49, 49, 0.75)" : "#ccc";

  if (selected) requirementsList.push(div.obj.name);
  else
    requirementsList = requirementsList.filter((name) => name !== div.obj.name);


    //If a function was supplied from index.js, call it to signal options change
    if(req.onChange != null)
        req.onChange();
};



export const req = {
    //Function supplied from index.js
    onChange: null,


    //Create option buttons
    createIn: (div) => {
        //Create option buttons from a requirement list
        requirements.forEach((req) => {
          let div = document.createElement("div");
          div.className = "formdiv";
          div.innerText = req.description;
          div.obj = req;
          div.addEventListener("click", optionClicked);
          div.addEventListener("mouseenter", () => {
            div.style.backgroundColor = div.selected
              ? "rgba(255, 204, 204, 0.75)"
              : "#ffffcf";
            div.style.borderColor = div.selected
              ? "rgba(255, 49, 49, 0.75)"
              : "#ffdf70";
          });

          div.addEventListener("mouseleave", () => {
            div.style.backgroundColor = div.selected
              ? "rgba(255, 204, 204, 0.75)"
              : "#eee";
            div.style.borderColor = div.selected ? "rgba(255, 49, 49, 0.75)" : "#ccc";
          });
          div.selected = false;
          document.getElementById("options").appendChild(div);
        });

    },

    //Return all currently set options
    getAll: () => {
         return requirementsList;
    }

}