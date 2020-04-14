var data = { //saved between sessions
    money: [0, 0, 0, 0], //copper, silver, gold, platinum
    event: [], //used to bank events, which the player can access at their discretion

    flag: Array(100).fill(0),

    character0: new Character ("", "", "", 8),
}

var global = { //only used in this session
    eventTimer: 0, //used to prevent events from appearing all at once
    global: new GlobalCharacter(), //used primarily for the global ticker
    character0: new GlobalCharacter(),
}

window.onload = function() 
{
    Update("character0weaponname", data.character0.weapon.name);
    UpdateToolTipWeapon("character0weapontooltip", "character0");
    
}

function Character(_class, _ancestry, _background, _health)
{
    this.class = _class;
    this.level = 1;
    this.xp = 0;
    this.xpToLevel = 1000;
    this.ancestry = _ancestry;
    this.background = _background;
    this.healthMax = _health; //should be dictated by ANCESTRY
    this.health = _health;
    this.attributes = new CharacterAttributes();
    this.skills = new CharacterSkills();
    this.restQuality = 1; //this should be dictated by accomodation
    this.weapon = new Weapon();
    this.armour = new Armour();
    //this.skillold(_acrobatics, _arcana, _athletics, _crafting, _deception, _diplomacy, _intimidation, _lore, _medicine, _nature, _occultisim, _performance, _religion, _society, _stealth, _survival, _thievery)
}

function CharacterAttributes()
{
    this.strength = new Attribute("strength");
    this.dexterity = new Attribute("dexterity");
    this.constitution = new Attribute("constitution");
    this.intelligence = new Attribute("intelligence");
    this.wisdom = new Attribute("wisdom");
    this.charisma = new Attribute("charisma");
}

function Attribute(_name)
{
    this.name = _name;
    this.level = 10;
}

function CharacterSkills()
{
    this.acrobatics = new Skill("acrobatics");
    this.arcana = new Skill("arcana");
    this.athletics = new Skill("athletics");
    this.crafting = new Skill("crafting");
    this.deception = new Skill("deception");
    this.diplomacy = new Skill("diplomacy");
    this.intimidation = new Skill("intimidation");
    this.lore = new Skill("lore");
    this.medicine = new Skill("medicine");
    this.nature = new Skill("nature");
    this.occultisim = new Skill("occultisim");
    this.performance = new Skill("performance");
    this.religion = new Skill("religion");
    this.society = new Skill("society");
    this.stealth = new Skill("stealth");
    this.survival = new Skill("survival");
    this.thievery = new Skill("thievery");
}

function Weapon()
{
    this.name = "Fist";
    this.damageRolls = 1; //meaning the 1 of the 1d4, only 1 roll of the dice
    this.damageDice = 4; //meaning 1-4, d4
    this.type = "Blunt"; //B - Blunt, S - Slashing, P - Piercing
    this.group = "Brawling";
    this.traits = ["Agile", "Finesse", "Nonlethal", "Unarmed"]; //searching an array is expensive, but no idea how else we're gonna handle this
}

function Armour()
{
    this.name = "None";
}

function Skill(_name)
{
    this.name = _name;
    this.level = "Untrained";
}

function GlobalCharacter() //used to consolidate some attributes, used only in the global var (not saved between sessions)
{
    this.tickerLength = 0;
    this.task = 0;
}

/*function GainAttributeExperience(_character, _attribute, _xpGained)
{
    data[_character].attributes[_attribute].xp = data[_character].attributes[_attribute].xp + _xpGained;
    let _numberOfLevelUps = CheckForLevelUp(data[_character].attributes[_attribute].xp, data[_character].attributes[_attribute].level, data[_character].attributes[_attribute].xpToLevel, "attribute")
    if (_numberOfLevelUps > 0)
    {
        for (i = 0; i < _numberOfLevelUps; i++)
        {
            GainLevel(_character, _attribute);
        }
    }

    UpdatePercentWidth((data[_character].class + data[_character].attributes[_attribute].name + "xpprogress"), data[_character].attributes[_attribute].xp, data[_character].attributes[_attribute].xpToLevel);
}*/

function GainExperience(_character, _xpGained)
{
    data[_character].xp = data[_character].xp + _xpGained;
    let _numberOfLevelUps = CheckForLevelUp(data[_character].xp, data[_character].level, data[_character].xpToLevel, "experience")
    if (_numberOfLevelUps > 0)
    {
        for (i = 0; i < _numberOfLevelUps; i++)
        {
            GainLevel(_character);
        }
    }

    UpdatePercentWidth((_character + "levelxpprogress"), data[_character].xp, data[_character].xpToLevel);
}

function CheckForLevelUp(_xp, _level, _xpToLevel, _type) //returns the number of levels gained (can be more than 1 if enough xp is earned at once)
{
    let _numberOfLevelUps = 0;
    while(_xp >= _xpToLevel) //simulate the number of level ups possible
    {
        _xp = _xp - _xpToLevel;
        _numberOfLevelUps++;
        _xpToLevel = GrowthCurve(_type, _level + _numberOfLevelUps);
    }

    return _numberOfLevelUps;
}

function GainLevel(_character)
{
    data[_character].level++;
    data[_character].xp = data[_character].xp - data[_character].xpToLevel;
    data[_character].xpToLevel = GrowthCurve("experience", data[_character].level);
    Update((_character + "level"), data[_character].level);
}

//Rolls

function SkillCheck(_difficulty, _skillLevel, _attribute)
{
    const _roll = RollD20(1);
    const _skillModifier = ReturnModifierSkill(_skillLevel);
    const _attributeModifier = ReturnModifierAttribute(_attribute);
    let _result = false;

    const _totalRoll = _roll + _skillModifier + _attributeModifier

    if (_totalRoll >= _difficulty)
    {
        _result = true;
    }
    else
    {
        _result = false;
    }

    return {_result, _roll, _skillModifier, _attributeModifier, _totalRoll};
}

function SkillCheckAndUpdateTicker(_character, _difficultyClass, _skill, _attribute)
{
    let {_result, _roll, _skillModifier, _attributeModifier, _totalRoll} = SkillCheck(_difficultyClass, data[_character].skills[_skill].level, data[_character].attributes[_attribute].level);

    if (_result == true) //succeeded the check
    {
        UpdateTicker(_character, ("Rolled: "  + _roll + " + " + _skillModifier + " + " + _attributeModifier + " = " + _totalRoll + " vs " + _difficultyClass + ". " + "Success!"), "green");
    }
    else //failed the check
    {
        UpdateTicker(_character, ("Rolled: "  + _roll + " + " + _skillModifier + " + " + _attributeModifier + " = " + _totalRoll + " vs " + _difficultyClass + ". " + "Failed!"), "red");
    }
}

function ReturnModifierAttribute(_number)
{
    if (_number > 10)
    {
        return Math.floor((_number - 10) / 2); //11 = 0, 12 = 1, 13 = 1, 14 = 2
    }
    else if (_number == 10)
    {
        return 0;
    }
    else if (_number < 10)
    {
        switch(_number) 
        {
            case 9:
            case 8:
                return -1;
            case 7:
            case 6:
                return -2;
            case 5:
            case 4:
                return -3;
            case 3:
            case 2:
                return -4;
            case 1:
                return -5;
        }
    }
}

function ReturnModifierSkill(_training)
{
    switch (_training)
    {
        case "Untrained":
            return 0;
        case "Trained":
            return 2;
        case "Expert":
            return 4;
        case "Master":
            return 6;
        case "Legendary":
            return 8;
    }   
}

function RollD20(_numberOfRolls)
{
    for (let i = 0; i < _numberOfRolls; i++)
    {
        return RandomInteger(1, 20);
    }
}

function RollD100(_numberOfRolls) //for percentiles - this was traditionally done using 2D10 instead, but no need in this case
{
    for (let i = 0; i < _numberOfRolls; i++)
    {
        return RandomInteger(1, 100);
    }
}

/* //Build HTML Functions

function BuildButton(_class, _buttonOnClickFunction, _buttonText)
{
    let _button = document.createElement("BUTTON");
    _button.setAttribute("data-toggle", "tooltip");
    _button.setAttribute("data-html", "true");
    _button.type = "button";
    element.classList.add("btn " + _class + "text");
    _button.onclick = _buttonOnClickFunction;
    _button.innerHTML = _buttonText;
    

    document.getElementById(_class + "buttons").appendChild(_button);

    //button data-toggle="tooltip" data-html="true" title="<div style='font-style:italic;'>+stamina</div>Take a load off and recover your stamina." type="button" class="btn fightertext" onclick="FighterTask('Rest(&quot;fighter&quot;)')">Rest</button>
}*/

//Update HTML Functions

function Update(_id, _content) 
{
    document.getElementById(_id).innerHTML = _content;
}

function UpdatePercentWidth(_id, _numerator, _denominator) //used by progress bars mainly / assuming we're using base 100 for the %
{
    let _percent = (_numerator / _denominator) * 100;
    document.getElementById(_id).style.width = _percent + "%";
}

/*function UpdateToolTipButton(_id, _cost, _description)
{
    document.getElementById(_id).setAttribute("data-original-title", 
    _content);
}*/

function UpdateToolTipWeapon(_id, _character) //more specific, used to update weapon tool tips as they're generally more complex
{
    let _traitsString = "";
    for (let i = 0; i < data[_character].weapon.traits.length; i++)
    {
        _traitsString = _traitsString + data[_character].weapon.traits[i];
        if (i != (data[_character].weapon.traits.length - 1)) //only add a comma if we're not at the end already
        {
            _traitsString = _traitsString + ", "
        }
    }
    document.getElementById(_id).setAttribute("data-original-title",
        "<b>Damage: </b>" + data[_character].weapon.damageRolls + "D" + data[_character].weapon.damageDice + " " + data[_character].weapon.type + "<br>" +
        "<b>Group: </b>" + data[_character].weapon.group + "<br>" +
        "<b>Traits: </b>" + _traitsString
    );
}

function UpdateMakeVisible(_id)
{
    document.getElementById(_id).classList.remove("d-none");
}

function UpdateTicker(_character, _text, _colour)
{
    let _node = document.createElement("LI"); 
    let _textNode = document.createTextNode(_text);
    _node.appendChild(_textNode);

    if(_colour != "")
    {
        switch (_colour)
        {
            case "green":
                _node.style.color = "#5cb85c";
                break;
            case "red":
                _node.style.color = "#d9534f";
                break;
        }
    }

    document.getElementById(_character + "tickertext").appendChild(_node);

    document.getElementById(_character + "ticker").scrollTop = document.getElementById(_character + "ticker").scrollHeight; //scrolls to the top when adding a new element

    if (global[_character].tickerLength < 100) //limit the size of ticker. Crude implementation using a counter
    {
        global[_character].tickerLength++;
    }
    else
    {
        document.getElementById(_character + "tickertext").removeChild(document.getElementById(_character + "tickertext").children[0]);
    }
}

//Misc Functions

function RandomInteger(min, max) //https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function GrowthCurve(_growthType, _level) //returns the value to be USED
{
    switch (_growthType)
    {
        case "experience": //linear growth
            return (_level * 1000) - 1000; // 1 - 1000, 2 - 2000, 3 - 3000
    }
}

String.prototype.capitalize = function() //used to capitalise the first letter of a string
{ //https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
    return this.charAt(0).toUpperCase() + this.slice(1);
}

//DEV FUNCTIONS

function DevIncreaseXpCharacter0()
{
    data.character0.xp = data.character0.xp + 950;

    UpdatePercentWidth(("character0levelxpprogress"), data.character0.xp, data.character0.xpToLevel);
}