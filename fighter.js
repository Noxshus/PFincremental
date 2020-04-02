function FighterTask(_task)
{
    clearInterval(data.fighterTask); //end the previous task before starting the next one
    data.fighterTask = setInterval(_task, 1000);
}

function ManualLabour()
{
    data.money[0] = data.money[0] + 1; //1 copper
    GainExperience("fighter", "athletics", 1);
    Update("copper", data.money[0]);
}