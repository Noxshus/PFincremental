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
        Update("fighterclass", "Fighter"); //*******CONTINUE HERE */

        data.flag[1] = 2;
    }, 8000);

    EventReset();
}