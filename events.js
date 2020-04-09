function EventCheck() //should be tied to a button in the window. Will access the first element (should be the oldest), run the relevent event, then delete it from the array.
{
    if (data.event.length >= 1) //only run if an event exists - button should be disabled if nothing is available, but just in-case
    {
        let _event = data.event.shift(); //shift remove the first element, returns it & shifts all other elements downwards
        Update("eventsbadge", data.event.length);
        let _eventsButton = document.getElementById("eventsbutton"); 
        _eventsButton.setAttribute("disabled", "");
        switch (_event)
        {
            case "fightersword":
                EventFighterSword();
                break;
        }
    }
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
            let _eventsButton = document.getElementById("eventsbutton"); 
            _eventsButton.setAttribute("disabled", "");
        }, (global.eventTimer - 2000));    
    }
    global.eventTimer = 0;
}

function EventFighterSword() //fighter finds sword while farming
{
    EventDisplayText("You till the earth day in and day out. The monotony often causes your mind wander elsewhere.");
    EventDisplayText("You dream of adventure, fame, glory. Times gone by.");
    EventDisplayText("Today, however, your trance is suddenly broken.");
    EventDisplayText("Your hoe strikes not earth, but steel.");
    EventDisplayText("You extract an untarnished sword from the ground.");
    EventDisplayText("The grip fits you like a hand-crafted glove. It feels as though it has been made for you.");
    EventDisplayText("That can't be right. Right...?");

    EventReset();
}