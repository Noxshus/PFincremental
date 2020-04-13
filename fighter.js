function FighterTask(_task)
{
    clearInterval(global.fighter.task); //end the previous task before starting the next one
    global.fighter.task = setInterval(_task, 1000);
}

function TaskFarmLabour() //Farm Labour button
{
    Task("fighter", 10, 1, "athletics", "strength", 1, 1, "The hours are long, but the earth was bountiful.", "Sweat and aches are your only reward.", "TaskFarmLabour");

    if (RollD100(1) >= 95 && data.flag[0] == 0) //5% chance
    {
        data.flag[0] = 1;
        AddEvent("fightersword");
    }
}

function TaskFighterTraining() //Fighter training button
{
    Task("fighter", 10, 1, "athletics", "strength", 0, 5, "A swing a day keeps the goblin away.", "Progress is slow and frustrating.", "TaskFighterTraining");

    if (RollD100(1) >= 95 && data.flag[1] == 0) //5% chance
    {
        data.flag[1] = 1;
        AddEvent("fightertraining");
    }
}