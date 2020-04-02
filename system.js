var data = { //saved between sessions
    money: [0, 0, 0, 0], //copper, silver, gold, platinum

    fighter: new Character ("fighter", "", ""),
}

var global = { //only used in this session
    fighterTask: "",
}

function Character(_class, _ancestry, _background)
{
    this.class = _class;
    this.level = 1;
    this.ancestry = _ancestry;
    this.background = _background;
    this.strength = 10;
    this.dexterity = 10;
    this.constitution = 10;
    this.intelligence = 10;
    this.wisdom = 10;
    this.charisma = 10;
    this.skills = new CharacterSkills();
    //this.skillold(_acrobatics, _arcana, _athletics, _crafting, _deception, _diplomacy, _intimidation, _lore, _medicine, _nature, _occultisim, _performance, _religion, _society, _stealth, _survival, _thievery)
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
    this.level = 0;
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

function GainExperience(_character, _skill, _xpGained)
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

function LevelUp(_character, _skill)
{
    data[_character].skills[_skill].level++;
    data[_character].skills[_skill].xp = data[_character].skills[_skill].xp - data[_character].skills[_skill].xpToLevel;
    data[_character].skills[_skill].xpToLevel = GrowthCurve("skill", data[_character].skills[_skill].level);
    Update((data[_character].class + data[_character].skills[_skill].name), data[_character].skills[_skill].level);
}

function GrowthCurve(_growthType, _level) //returns the value to be USED
{
    switch (_growthType)
    {
        case "skill": //linear growth
            return (_level * 100) + 100; // 0 - 100, 1 - 200, 2 - 300
    }
}

//DEV FUNCTIONS

function DevIncreaseAthleticsXpFighter()
{
    data.fighter.skills.athletics.xp = data.fighter.skills.athletics.xp + 90;

    let _percent = (data.fighter.skills.athletics.xp / data.fighter.skills.athletics.xpToLevel) * 100;
    UpdateWidth((data.fighter.class + data.fighter.skills.athletics.name + "xp"), _percent + "%");
}