import { diceImg } from "./constants";
  
export function getD6(n) { 
    return `<img src="data:image/png;base64,${diceImg[n-1]}" style="margin-left: 1px; margin-bottom: 4px;"/>`
}

export function getRandomTo(max) {
    return Math.floor(Math.random() * max) + 1;
}

export function getById(source, id) {
    if(!id) return;
    const p =  source.filter((b) => b.Id===parseInt(id))[0];
    return p;
}

export function getIndexById(source, id) {
    if(!id) return;
    return source.findIndex((b) => b.Id===parseInt(id));
}

export function updateProperty(setter, property, value) {
    setter((prev) => ({...prev,  [property]: value }));
}

export function  handleChangeById(event, source, setter){
    setter(getById(source, event.target.value));
}
