//Used previously - do not load this sheet

/*
                        <button id="character0buttonrest" data-toggle="tooltip" data-html="true" title="<i>Example</i><br>Does nothing at the moment." type="button" class="btn character0text" onclick="character0Task('Rest(&quot;character0&quot;)')">Rest</button>
                        //Note the onclick here - this allowed passing a function with another function with a parameter, as a parameter by using escape characters
*/


/*
                        <button id="character0buttonfarmlabour" data-toggle="tooltip" data-html="true" title="<i>+1 strengthXP, +1 copper</i><br>Simple, backbreaking work for little pay. Uses Athletics." type="button" class="btn character0text" onclick="character0Task(TaskFarmLabour)">Farm Labour</button>
                        <button id="character0buttontrain" data-toggle="tooltip" data-html="true" title="<i>+5 strengthXP</i><br>Practice makes perfect. Uses Athletics." type="button" class="btn character0text d-none" onclick="character0Task(Taskcharacter0Training)">Train</button>
*/

/*

//Tasks

function Task(_class, _difficultyClass, _staminaCost, _skill, _attribute, _moneyReward, _attributeXP, _successText, _failureText, _taskName)
{ //scalable task for individual class tasks - special handling can go into the specific functions instead
    if (ReduceStamina(_class, 1) == true)
    {
        let {_result, _roll, _skillModifier, _attributeModifier, _totalRoll} = SkillCheck(_difficultyClass, data[_class].skills[_skill].level, data[_class].attributes[_attribute].level);

        if (_result == true) //succeeded the check
        {
            data.money[0] = data.money[0] + _moneyReward;
            GainAttributeExperience(_class, _attribute, 1);
            UpdateTicker(_class, ("Rolled: "  + _roll + " + " + _skillModifier + " + " + _attributeModifier + " = " + _totalRoll + " vs " + _difficultyClass + ". " + _successText), "green");
        }
        else //failed the check
        {
            UpdateTicker(_class, ("Rolled: "  + _roll + " + " + _skillModifier + " + " + _attributeModifier + " = " + _totalRoll + " vs " + _difficultyClass + ". " + _failureText), "red");
        }

        Update("copper", data.money[0]);
    }
    else //not enough stamina
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

*/

/*

function EventCheck() //should be tied to a button in the window. Will access the first element (should be the oldest), run the relevent event, then delete it from the array.
{
    if (data.event.length >= 1) //only run if an event exists - button should be disabled if nothing is available, but just in-case
    {
        let _event = data.event.shift(); //shift remove the first element, returns it & shifts all other elements downwards
        Update("eventsbadge", data.event.length);
        document.getElementById("eventsbutton").disabled = true;
        switch (_event)
        {
            case "fightersword":
                EventFighterSword();
                break;
            case "fightertraining":
                EventFighterTraining();
                break;
        }
    }
}

function AddEvent (_event)
{
    data.event.push(_event);
    document.getElementById("eventsbutton").disabled = false;
    Update("eventsbadge", data.event.length);
    EventDisplayText("An event is available!");
}

function EventDisplayText(_text) //prevents event text from running all at once
{
    setTimeout(UpdateTicker, global.eventTimer, "global", _text);
    global.eventTimer = global.eventTimer + 2000; //2 seconds
}

function EventReset() //run at the end of an event to prepare for the next event
{
    if (data.event.length >= 1) //re-enable button if there are events still available
    {
        setTimeout(function() { //run it in a timeout so that button enables roughly as soon as the last message appears
            document.getElementById("eventsbutton").disabled = false; 
        }, (global.eventTimer - 2000));    
    }
    global.eventTimer = 0;
}

function EventFighterSword() //fighter finds sword while farming
{
    EventDisplayText("Day in, day out, tilling the earth.");
    EventDisplayText("Monotony often causing the mind to wander.");
    EventDisplayText("Dreams of adventure, fame, glory. Times gone by...");
    EventDisplayText("Today, however, the trance is suddenly broken.");
    EventDisplayText("Iron meets not earth, but steel.");
    EventDisplayText("An untarnished sword, buried in the ground.");
    EventDisplayText("It looks expensive. The grip fits like a hand-crafted glove.");

    setTimeout(function() {
        data.fighter.weapon.name = "Longsword";
        data.fighter.weapon.damageRolls = 1;
        data.fighter.weapon.damageDice = 8;
        data.fighter.weapon.type = "Slashing";
        data.fighter.weapon.group = "Sword";
        data.fighter.weapon.traits = ["Versatile (Piercing)"];
        Update("fighterweaponname", "Longsword");
        UpdateToolTipWeapon("fighterweapontooltip", "fighter");
        UpdateMakeVisible("fighterbuttontrain");
        data.flag[0] = 2;
    }, 14000);

    EventReset();
}

function EventFighterTraining() //fighter recalls past while training
{
    EventDisplayText("The years have been long, but memory still serves.");
    EventDisplayText("Strike, move, stab, step, parry, riposte.");
    EventDisplayText("The thought of returning to the fields draws a deep sigh.")
    EventDisplayText("Yet, one must soldier on.");

    setTimeout(function() {
        Update("fighterclass", "Fighter");

        data.flag[1] = 2;
    }, 8000);

    EventReset();
}

*/

/*

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

*/