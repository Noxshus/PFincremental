var data = { //saved between sessions
    money: [0, 0, 0, 0], //copper, silver, gold, platinum
    event: [], //used to bank events, which the player can access at their discretion

    flag: Array(100).fill(false),

    fighter: new Character ("fighter", "", "", 8),
}

var global = { //only used in this session
    eventTimer: 0, //used to prevent events from appearing all at once
    global: new GlobalCharacter(), //used primarily for the global ticker
    fighter: new GlobalCharacter(),
}

function Character(_class, _ancestry, _background, _health)
{
    this.class = _class;
    this.level = 1;
    this.ancestry = _ancestry;
    this.background = _background;
    this.healthMax = _health; //should be dictated by ANCESTRY
    this.health = _health;
    this.staminaMax = _health;
    this.stamina = _health;
    this.attributes = new CharacterAttributes();
    this.skills = new CharacterSkills();
    this.restQuality = 1; //this should be dictated by accomodation
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
    this.xp = 0;
    this.xpToLevel = 100;   
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

function Skill(_name)
{
    this.name = _name;
    this.level = "Untrained";
    this.xp = 0;
    this.xpToLevel = 100;
}

function GlobalCharacter() //used to consolidate some attributes, used only in the global var (not saved between sessions)
{
    this.tickerLength = 0;
    this.task = 0;
}

function GainAttributeExperience(_character, _attribute, _xpGained)
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

function GainLevel(_character, _attribute)
{
    data[_character].attributes[_attribute].level++;
    data[_character].attributes[_attribute].xp = data[_character].attributes[_attribute].xp - data[_character].attributes[_attribute].xpToLevel;
    data[_character].attributes[_attribute].xpToLevel = GrowthCurve("attribute", data[_character].attributes[_attribute].level);
    Update((data[_character].class + data[_character].attributes[_attribute].name), data[_character].attributes[_attribute].level);
}

//Tasks

function Task(_class, _difficultyClass, _staminaCost, _skill, _attribute, _moneyReward, _attributeXP, _successText, _failureText, _taskName)
{ //scalable task for individual class tasks - special handling can go into the specific functions instead
    if (ReduceStamina(_class, 1) == true)
    {
        let {_result, _roll, _skillModifier, _attributeModifier, _totalRoll} = SkillCheck(_difficultyClass, data[_class].skills[_skill].level, data[_class].attributes[_attribute].level);

        if (_result == true)
        {
            data.money[0] = data.money[0] + _moneyReward;
            GainAttributeExperience(_class, _attribute, 1);
            UpdateTicker(_class, ("Rolled: "  + _roll + " + " + _skillModifier + " + " + _attributeModifier + " = " + _totalRoll + " vs " + _difficultyClass + ". " + _successText));
        }
        else
        {
            UpdateTicker(_class, ("Rolled: "  + _roll + " + " + _skillModifier + " + " + _attributeModifier + " = " + _totalRoll + " vs " + _difficultyClass + ". " + _failureText));
        }

        Update("copper", data.money[0]);
    }
    else
    {
        UpdateTicker(_class, ("You're too tired to work."));
        let _functionName = _class.capitalize() + "Task";
        window[_functionName]("Rest('" + _class + "'," + _taskName + ")"); //Rest automatically after running out of stamina - note that there's a single ' inside the "". Not 100% sure why, but JS didn't seem to be sending the contents of _class as a string
    }
}

//Stamina 

function ReduceStamina(_class, _cost)
{
    if (data[_class].stamina >= _cost)
    {
        data[_class].stamina = data[_class].stamina - _cost;
        Update(_class + "staminatext", data[_class].stamina);
        UpdatePercentWidth(_class + "stamina", data[_class].stamina, data[_class].staminaMax);
        return true;
    }
    return false;
}

function Rest(_class, _previousTask) //should be called by the respective class task function & looped. If called with a previous task, it'll restart that when finishing
{
    if (data[_class].stamina < data[_class].staminaMax)
    {
        data[_class].stamina = data[_class].stamina + data[_class].restQuality;
        Update(_class + "staminatext", data[_class].stamina);
        UpdatePercentWidth(_class + "stamina", data[_class].stamina, data[_class].staminaMax);
        UpdateTicker(_class, ("Zzzz..."));
    }
    else
    {
        UpdateTicker(_class, ("You're good to go."));
        if (_previousTask != "") //only should be "" is player called it by clicking the button, otherwise we should be provided with the previous task name, so we can return to it once rest is complete
        {
            let _functionName = _class.capitalize() + "Task"; //Need to caps the _class because naming convention functions start in caps
            window[_functionName](_previousTask); //referencing the function by its name, sending back the previous task as parameter
        }
        else
        {
            clearInterval(global[_class].task);
        }
    }
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

function ReturnModifierAttribute(_number)
{
    if (_number > 10)
    {
        return Math.floor(_number - 10); //11 = 0, 12 = 1, 13 = 1, 14 = 2
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

//Misc

function Update(_id, _content) 
{
    document.getElementById(_id).innerHTML = _content;
}

function UpdatePercentWidth(_id, _numerator, _denominator) //used by progress bars mainly / assuming we're using base 100 for the %
{
    let _percent = (_numerator / _denominator) * 100;
    document.getElementById(_id).style.width = _percent + "%";
}

function UpdateTicker(_class, _text)
{
    let _node = document.createElement("LI"); 
    let _textNode = document.createTextNode(_text);
    _node.appendChild(_textNode);
    document.getElementById(_class + "tickertext").appendChild(_node);

    document.getElementById(_class + "ticker").scrollTop = document.getElementById(_class + "ticker").scrollHeight; //scrolls to the top when adding a new element

    if (global[_class].tickerLength < 100) //limit the size of ticker. Crude implementation using a counter
    {
        global[_class].tickerLength++;
    }
    else
    {
        document.getElementById(_class + "tickertext").removeChild(document.getElementById(_class + "tickertext").children[0]);
    }
}

function RandomInteger(min, max) //https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function GrowthCurve(_growthType, _level) //returns the value to be USED
{
    switch (_growthType)
    {
        case "attribute": //linear growth
            return (_level * 100) + 100; // 0 - 100, 1 - 200, 2 - 300
    }
}

String.prototype.capitalize = function() //used to capitalise the first letter of a string
{ //https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
    return this.charAt(0).toUpperCase() + this.slice(1);
}

//DEV FUNCTIONS

function DevIncreaseStrengthXpFighter()
{
    data.fighter.attributes.strength.xp = data.fighter.attributes.strength.xp + 99;

    UpdatePercentWidth((data.fighter.class + data.fighter.attributes.strength.name + "xpprogress"), data.fighter.attributes.strength.xp, data.fighter.attributes.strength.xpToLevel);
}