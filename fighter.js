function FighterTask(_task)
{
    clearInterval(data.fighterTask); //end the previous task before starting the next one
    data.fighterTask = setInterval(_task, 1000);
}

function TaskFarmLabour()
{
    let {_result, _roll, _skillModifier, _attributeModifier} = SkillCheck(10, data.fighter.skills.athletics.level, data.fighter.attributes.strength.level);

    if (_result == true)
    {
        data.money[0] = data.money[0] + 1; //1 copper
        GainAttributeExperience("fighter", "strength", 1);
    }

    let node = document.createElement("LI");                 // Create a <li> node
    let textnode = document.createTextNode(_result + " " + _roll + " " + _skillModifier + " " + _attributeModifier);         // Create a text node
    node.appendChild(textnode);                              // Append the text to <li>
    document.getElementById("fighterticker").appendChild(node);     // Append <li> to <ul> with id="myList" 

    Update("copper", data.money[0]);
}