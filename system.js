var data = { //saved between sessions
    money: [0, 0, 0, 0], //copper, silver, gold, platinum
}

var global = { //only used in this session
    fighterTask: "",
}

function update(_id, _content) 
{
    document.getElementById(_id).innerHTML = _content;
}
