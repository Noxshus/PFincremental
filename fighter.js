function FighterTask(_task)
{
    clearInterval(global.fighter.task); //end the previous task before starting the next one
    global.fighter.task = setInterval(_task, 1000);
}

function TaskFarmLabour()
{
    if (ReduceStamina("fighter", 1) == true)
    {
        let {_result, _roll, _skillModifier, _attributeModifier} = SkillCheck(10, data.fighter.skills.athletics.level, data.fighter.attributes.strength.level);

        if (_result == true)
        {
            data.money[0] = data.money[0] + 1; //1 copper
            GainAttributeExperience("fighter", "strength", 1);
            UpdateTicker("fighter", ("Rolled: "  + _roll + " + " + _skillModifier + " + " + _attributeModifier + " vs 10. The hours are long, but the earth was bountiful."));
        }
        else
        {
            UpdateTicker("fighter", ("Rolled: "  + _roll + " + " + _skillModifier + " + " + _attributeModifier + " vs 10. Sweat and aches are your only reward."));
        }

        Update("copper", data.money[0]);
    }
    else
    {
        UpdateTicker("fighter", ("You're too tired to work."));
        clearInterval(global.fighter.task); //end the task if it's on-going
    }
}