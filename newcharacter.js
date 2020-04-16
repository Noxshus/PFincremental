function BuildAncestryButtons(_character)
{
    BuildText(_character, "Select an Ancestry...", "buttons");
    BuildButton(_character, "SelectAncestry('" + _character + "', 'Human')", "Human", (_character + "humanbutton"));
    BuildButton(_character, "SelectAncestry('" + _character + "', 'Halfling')", "Halfling", (_character + "halflingbutton"));

    UpdateToolTipAncestryButton(_character + "humanbutton", "Human", "8", "Medium", "25", "2 Any", "None", "Human, Humanoid", "None");
    UpdateToolTipAncestryButton(_character + "halflingbutton", "Halfling", "6", "Small", "25", "Dexterity, Wisdom, 1 Any", "Strength", "Halfling, Humanoid", "Keen Eyes");
}

function BuildBackgroundButtons(_character)
{
    BuildText(_character, "Select a Background...", "buttons");
    BuildButton(_character, "SelectBackground('" + _character + "', 'Criminal')", "Criminal", (_character + "criminalbutton"));
    BuildButton(_character, "SelectBackground('" + _character + "', 'Herbalist')", "Herbalist", (_character + "herbalistbutton"));
    BuildButton(_character, "SelectBackground('" + _character + "', 'Warrior')", "Warrior", (_character + "warriorbutton"));

    UpdateToolTipBackgroundButton(_character + "criminalbutton", "Criminal", "Dexterity", "Intelligence", "1 Any", "Stealth", "Underworld Lore", "Experienced Smuggler");
    UpdateToolTipBackgroundButton(_character + "herbalistbutton", "Herbalist", "Constitution", "Wisdom", "1 Any", "Nature", "Herbalism Lore", "Natural Medicine");
    UpdateToolTipBackgroundButton(_character + "warriorbutton", "Warrior", "Strength", "Constitution", "1 Any", "Intimidation", "Warfare Lore", "Intimidating Glare");
}

function BuildChoiceAbilityBoostButtons(_character, _choiceAbilityBoostArray) //backgrounds offer a choice between 2 ability boosts - build appropriate buttons here.
{
    BuildText(_character, "Select an Ability Boost...", "buttons");

    if (_choiceAbilityBoostArray[0] > 0)
    {
        BuildButton(_character, "SelectChoiceAbilityBoost('" + _character + "', '[1, 0, 0, 0, 0, 0]')", "Strength", (_character + "strengthbutton"));
        UpdateToolTipButton(_character + "strengthbutton", "An Ability Boost for Strength");
    }
    if (_choiceAbilityBoostArray[1] > 0)
    {
        BuildButton(_character, "SelectChoiceAbilityBoost('" + _character + "', '[0, 1, 0, 0, 0, 0]')", "Dexterity", (_character + "dexteritybutton"));
        UpdateToolTipButton(_character + "dexteritybutton", "An Ability Boost for Dexterity");
    }
    if (_choiceAbilityBoostArray[2] > 0)
    {
        BuildButton(_character, "SelectChoiceAbilityBoost('" + _character + "', '[0, 0, 1, 0, 0, 0]')", "Constitution", (_character + "constitutionbutton"));
        UpdateToolTipButton(_character + "constitutionbutton", "An Ability Boost for Constitution");
    }
    if (_choiceAbilityBoostArray[3] > 0)
    {
        BuildButton(_character, "SelectChoiceAbilityBoost('" + _character + "', '[0, 0, 0, 1, 0, 0]')", "Intelligence", (_character + "intelligencebutton"));
        UpdateToolTipButton(_character + "intelligencebutton", "An Ability Boost for Intelligence");
    }
    if (_choiceAbilityBoostArray[4] > 0)
    {
        BuildButton(_character, "SelectChoiceAbilityBoost('" + _character + "', '[0, 0, 0, 0, 1, 0]')", "Wisdom", (_character + "wisdombutton"));
        UpdateToolTipButton(_character + "wisdombutton", "An Ability Boost for Wisdom");
    }
    if (_choiceAbilityBoostArray[5] > 0)
    {
        BuildButton(_character, "SelectChoiceAbilityBoost('" + _character + "', '[0, 0, 0, 0, 0, 1]')", "Charisma", (_character + "charismabutton"));
        UpdateToolTipButton(_character + "charismabutton", "An Ability Boost for Charisma");
    }
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

    ApplyAbilityBoosts(_character, _abilityBoostsArray);
    ApplyAbilityFlaws(_character, _abilityFlawsArray);
}

function SelectBackground(_character, _background)
{ //attach this function to a BUTTON
    let _choiceAbilityBoostArray = [];
    switch (_background) {
        case "Criminal":
            _choiceAbilityBoostArray = AssignBackground(_character, _background, [0, 1, 0, 1, 0, 0], 1, "stealth", "Underworld", ["Experienced Smuggler"]);
            break;
        case "Herbalist":
            _choiceAbilityBoostArray = AssignBackground(_character, _background, [0, 0, 1, 0, 1, 0], 1, "nature", "Herbalism", ["Natural Medicine"]);
            break;
        case "Warrior":
            _choiceAbilityBoostArray = AssignBackground(_character, _background, [1, 0, 1, 0, 0, 0], 1, "intimidation", "Warfare", ["Intimidating Glare"]);
            break;
    }

    //Clear Node
    Update((_character + "buttons"), "");

    //Next Step
    BuildChoiceAbilityBoostButtons(_character, _choiceAbilityBoostArray);
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

    return _choiceAbilityBoostArray; //we return this because the buttons built next are dependent on it
}

function SelectChoiceAbilityBoost(_character, _selectedAbilityBoostArray)
{ //attach this to the respective buttons
    ApplyAbilityBoosts(_character, JSON.parse(_selectedAbilityBoostArray)); //parse it because it's arrived in a string format

    //Clear Node
    Update((_character + "buttons"), "");

    //Next Step
    console.log("Next step should be to pick class");
}

function ApplyAbilityBoosts(_character, _abilityBoostsArray)
{ //0 - 5: _strength, _dexterity, _constitution, _intelligence, _wisdom, _charisma
    data[_character].attributes.strength.level = data[_character].attributes.strength.level + (_abilityBoostsArray[0] * 2); //*2 because an ability boost gives +2, until at 18 (to be implemented)
    data[_character].attributes.dexterity.level = data[_character].attributes.dexterity.level + (_abilityBoostsArray[1] * 2);
    data[_character].attributes.constitution.level = data[_character].attributes.constitution.level + (_abilityBoostsArray[2] * 2);
    data[_character].attributes.intelligence.level = data[_character].attributes.intelligence.level + (_abilityBoostsArray[3] * 2);
    data[_character].attributes.wisdom.level = data[_character].attributes.wisdom.level + (_abilityBoostsArray[4] * 2);
    data[_character].attributes.charisma.level = data[_character].attributes.charisma.level + (_abilityBoostsArray[5] * 2);

    Update(_character + "strength", data[_character].attributes.strength.level);
    Update(_character + "dexterity", data[_character].attributes.dexterity.level);
    Update(_character + "constitution", data[_character].attributes.constitution.level);
    Update(_character + "intelligence", data[_character].attributes.intelligence.level);
    Update(_character + "wisdom", data[_character].attributes.wisdom.level);
    Update(_character + "charisma", data[_character].attributes.charisma.level);
}

function ApplyAbilityFlaws(_character, _abilityFlawsArray)
{ 
    data[_character].attributes.strength.level = data[_character].attributes.strength.level - (_abilityFlawsArray[0] * 2); //*2 because an ability flaw gives -2
    data[_character].attributes.dexterity.level = data[_character].attributes.dexterity.level - (_abilityFlawsArray[1] * 2);
    data[_character].attributes.constitution.level = data[_character].attributes.constitution.level - (_abilityFlawsArray[2] * 2);
    data[_character].attributes.intelligence.level = data[_character].attributes.intelligence.level - (_abilityFlawsArray[3] * 2);
    data[_character].attributes.wisdom.level = data[_character].attributes.wisdom.level - (_abilityFlawsArray[4] * 2);
    data[_character].attributes.charisma.level = data[_character].attributes.charisma.level - (_abilityFlawsArray[5] * 2);

    Update(_character + "strength", data[_character].attributes.strength.level);
    Update(_character + "dexterity", data[_character].attributes.dexterity.level);
    Update(_character + "constitution", data[_character].attributes.constitution.level);
    Update(_character + "intelligence", data[_character].attributes.intelligence.level);
    Update(_character + "wisdom", data[_character].attributes.wisdom.level);
    Update(_character + "charisma", data[_character].attributes.charisma.level);
}

