function BuildAncestryButtons(_character)
{
    BuildText(_character, "Select an Ancestry...", "buttons");
    BuildButton(_character, "SelectAncestry('" + _character + "', 'Human')", "Human", (_character + "humanbutton"));
    BuildButton(_character, "SelectAncestry('" + _character + "', 'Halfling')", "Halfling", (_character + "halflingbutton"));


    UpdateToolTipAncestryButton(_character + "humanbutton", "Human", "8", "Medium", "25", "2 Any", "None", "Human, Humanoid", "None");
    UpdateToolTipAncestryButton(_character + "halflingbutton", "Halfling", "6", "Small", "25", "Dexterity, Wisdom, Any", "Strength", "Halfling, Humanoid", "Keen Eyes");
}

function BuildBackgroundButtons(_character)
{
    BuildText(_character, "Select a Background...", "buttons");
    BuildButton(_character, "SelectBackground('" + _character + "', 'Criminal')", "Criminal", (_character + "criminalbutton"));
    BuildButton(_character, "SelectBackground('" + _character + "', 'Herbalist')", "Herbalist", (_character + "herbalistbutton"));
    BuildButton(_character, "SelectBackground('" + _character + "', 'Warrior')", "Warrior", (_character + "warriorbutton"));
}

function SelectAncestry(_character, _ancestry)
{ //attach this function to a BUTTON
    switch (_ancestry) {
        case "Human":
            AssignAncestry(_character, _ancestry, 8, "Medium", 25, ["Human", "Humanoid"], [], 2, [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]);
            break;
        case "Halfling":
            AssignAncestry(_character, _ancestry, 6, "Small", 25, ["Halfling", "Humanoid"], ["Keen Eyes"], 1, [0, 1, 0, 0, 1, 0], [1, 0, 0, 0, 0, 0]);
            break;
    }

    //Clear Node
    Update((_character + "buttons"), "");

    //Next Step
    BuildBackgroundButtons(_character);
}

function AssignAncestry(_character, _ancestryName, _health, _size, _speed, _traitsArray, _featsArray, _freeAbilityBoosts, _abilityBoostsArray, _abilityFlawsArray)
{
    data[_character].ancestry = _ancestryName;
    Update(_character + "ancestry", data[_character].ancestry);

    data[_character].healthMax = data[_character].healthMax + _health;
    data[_character].health = data[_character].health + _health;
    Update(_character + "healthtext", data[_character].health);
    Update(_character + "healthmaxtext", data[_character].healthMax);
    UpdatePercentWidth((_character + "health"), data[_character].health, data[_character].healthMax);

    data[_character].size = _size;
    data[_character].speed = _speed;

    _traitsArray.forEach(element => {
        data[_character].traits.push(element);
    });

    _featsArray.forEach(element => {
        data[_character].feats.push(element);
        let _elementLowerCaseNoSpaces = element;
        _elementLowerCaseNoSpaces = _elementLowerCaseNoSpaces.replace(/\s+/g, '-').toLowerCase(); //make the feat name lower caps + remove spaces, for the purpose of a DOM id
        UpdateFeats(_character, element, _character + _elementLowerCaseNoSpaces);
    });

    global[_character].freeAbilityBoosts = global[_character].freeAbilityBoosts + _freeAbilityBoosts;

    for (let i = 0; i < global[_character].abilityBoosts.length; i++)
    {
        global[_character].abilityBoosts[i] = global[_character].abilityBoosts[i] + _abilityBoostsArray[i];
    }

    for (let i = 0; i < global[_character].abilityFlaws.length; i++)
    {
        global[_character].abilityFlaws[i] = global[_character].abilityFlaws[i] + _abilityFlawsArray[i];
    }
}

function SelectBackground(_character, _background)
{ //attach this function to a BUTTON
    switch (_background) {
        case "Criminal":
            AssignBackground(_character, _background, [0, 1, 0, 1, 0, 0], 1, "stealth", "Underworld", ["Experienced Smuggler"]);
            break;
        case "Herbalist":
            AssignBackground(_character, _background, [0, 0, 1, 0, 1, 0], 1, "nature", "Herbalism", ["Natural Medicine"]);
            break;
        case "Warrior":
            AssignBackground(_character, _background, [1, 0, 1, 0, 0, 0], 1, "intimidation", "Warfare", ["Intimidating Glare"]);
            break;
    }

    //Clear Node
    Update((_character + "buttons"), "");

    //Next Step
    console.log("Next step should be to decide between the 2 ability boosts");
    console.log("Followed by any free skills");
}

function AssignBackground(_character, _backgroundName, _choiceAbilityBoostArray,_freeAbilityBoosts, _skill, _lore, _featsArray)
{
    data[_character]._background =  _backgroundName;

    global[_character].freeAbilityBoosts = global[_character].freeAbilityBoosts + _freeAbilityBoosts;

    if (data[_character].skills[_skill].level != "Trained")
    {
        data[_character].skills[_skill].level  = "Trained";
        Update(_character + _skill, data[_character].skills[_skill].level);
    }
    else
    {
        global[_character].freeSkillTraining++; //The PF rules state that skill training doesn't stack - the player can opt to choose training in any other skill instead
    }

    let _search = data[_character].skills.lore.find(o => o.name === _lore);
    if (_search != undefined)
    {
        data[_character].skills.lore.push(new Skill(_lore));
        ChangeLoreTraining(_character, _lore, "Trained");
        console.log(_search);
    }
    else
    {
        global[_character].freeSkillTraining++;
    }

    _featsArray.forEach(element => {
        data[_character].feats.push(element);
        let _elementLowerCaseNoSpaces = element;
        _elementLowerCaseNoSpaces = _elementLowerCaseNoSpaces.replace(/\s+/g, '-').toLowerCase(); //make the feat name lower caps + remove spaces, for the purpose of a DOM id
        UpdateFeats(_character, element, _character + _elementLowerCaseNoSpaces);
    });
}

function ApplyAbilityBoosts(_character, _strength, _dexterity, _constitution, _intelligence, _wisdom, _charisma)
{

}