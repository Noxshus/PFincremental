var data = { //saved between sessions
    money: [0, 0, 0, 0], //copper, silver, gold, platinum

    fighter: new Character ("fighter", "", "", 8),
}

var global = { //only used in this session
    fighterTask: "",
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

function Update(_id, _content) 
{
    document.getElementById(_id).innerHTML = _content;
}

function UpdateWidth(_id, _content)
{
    document.getElementById(_id).style.width = _content;
}

/*function GainSkillExperience(_character, _skill, _xpGained)
{   //data[blabla] is a dynamic reference since we're passing the NAME of the property, not the actual object
    data[_character].skills[_skill].xp = data[_character].skills[_skill].xp + _xpGained;
    let _numberOfLevelUps = CheckForLevelUp(data[_character].skills[_skill].xp, data[_character].skills[_skill].level, data[_character].skills[_skill].xpToLevel, "skill")
    if (_numberOfLevelUps > 0)
    {
        for (i = 0; i < _numberOfLevelUps; i++)
        {
            LevelUp(_character, _skill);
        }
    }

    //Update((data[_character].class + data[_character].skills[_skill].name + "xp"), data[_character].skills[_skill].xp);
    let _percent = (data[_character].skills[_skill].xp / data[_character].skills[_skill].xpToLevel) * 100;
    UpdateWidth((data[_character].class + data[_character].skills[_skill].name + "xp"), _percent + "%");
}*/

function GainAttributeExperience(_character, _attribute, _xpGained)
{
    data[_character].attributes[_attribute].xp = data[_character].attributes[_attribute].xp + _xpGained;
    let _numberOfLevelUps = CheckForLevelUp(data[_character].attributes[_attribute].xp, data[_character].attributes[_attribute].level, data[_character].attributes[_attribute].xpToLevel, "attribute")
    if (_numberOfLevelUps > 0)
    {
        for (i = 0; i < _numberOfLevelUps; i++)
        {
            LevelUp(_character, _attribute);
        }
    }

    //Update((data[_character].class + data[_character].attributes[_attribute].name + "xp"), data[_character].attributes[_attribute].xp);
    let _percent = (data[_character].attributes[_attribute].xp / data[_character].attributes[_attribute].xpToLevel) * 100;
    UpdateWidth((data[_character].class + data[_character].attributes[_attribute].name + "xpprogress"), _percent + "%");
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

function LevelUp(_character, _attribute)
{
    data[_character].attributes[_attribute].level++;
    data[_character].attributes[_attribute].xp = data[_character].attributes[_attribute].xp - data[_character].attributes[_attribute].xpToLevel;
    data[_character].attributes[_attribute].xpToLevel = GrowthCurve("attribute", data[_character].attributes[_attribute].level);
    Update((data[_character].class + data[_character].attributes[_attribute].name), data[_character].attributes[_attribute].level);
}

//Rolls

function SkillCheck(_difficulty, _skillLevel, _attribute)
{
    const _roll = RollD20(1);
    const _skillModifier = ReturnModifierSkill(_skillLevel);
    const _attributeModifier = ReturnModifierAttribute(_attribute);
    let _result = false;

    if ((_roll + _skillModifier + _attributeModifier) >= _difficulty)
    {
        _result = true;
    }
    else
    {
        _result = false;
    }

    return {_result, _roll, _skillModifier, _attributeModifier};
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

function GetRoll() 
{
    return {
        roll: GetRollValue(),
        skillModifier: GetSkillModifier(),
        attributeModifier: GetAttributeModifier(),
    };
}

//Misc

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

//DEV FUNCTIONS

function DevIncreaseStrengthXpFighter()
{
    data.fighter.attributes.strength.xp = data.fighter.attributes.strength.xp + 99;

    let _percent = (data.fighter.attributes.strength.xp / data.fighter.attributes.strength.xpToLevel) * 100;
    UpdateWidth((data.fighter.class + data.fighter.attributes.strength.name + "xpprogress"), _percent + "%");
}