const Event = require('../../models/event')
const User = require('../../models/user')

const { dateToString } = require('../../utils/utils');

const events = async (eventIds) => {
    try{
        const events = await Event.find({_id: {$in: eventIds}});
        return events.map(event => {
            console.log(event);
            return cleanedUpEvent(event);
        });
    } catch (error) {
        console.log(error);
    }
};

const singleEvent = async eventId => {
    try{
        const event = await Event.findById(eventId);
        return cleanedUpEvent(event);
    } catch (e) {
        console.log(e);
    }
}

const user = async (userId) => {
    try{
        const user =  await User.findById(userId);
        return {
            ...user._doc,
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    } catch (error) {
        console.log(error);
    }
};

const cleanedUpBooking = booking => {
    return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    };
};

const cleanedUpEvent = event => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
};



exports.cleanedUpEvent = cleanedUpEvent;
exports.cleanedUpBooking = cleanedUpBooking;