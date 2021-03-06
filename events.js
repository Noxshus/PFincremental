function EventCheck() //should be tied to a button in the window. Will access the first element (should be the oldest), run the relevent event, then delete it from the array.
{
    if (data.event.length >= 1) //only run if an event exists - button should be disabled if nothing is available, but just in-case
    {
        let _event = data.event.shift(); //shift remove the first element, returns it & shifts all other elements downwards
        Update("eventsbadge", data.event.length);
        document.getElementById("eventsbutton").disabled = true;
        switch (_event)
        {

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