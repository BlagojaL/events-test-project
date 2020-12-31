const Event = require('../../models/event');
const User = require('../../models/user');
const { cleanedUpEvent } = require('./resolveUtils');

module.exports = {
    getEvents: async () => {
        try{
            const events = await Event.find();
            return events.map(event => cleanedUpEvent(event));
        } catch (e){
            console.log(e);
        }
    },
    createEvent: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Permission denied!');
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });
        let createdEvent;
        try{
            const result = await event.save();
            createdEvent = cleanedUpEvent(result);
            const creator = await User.findById('5fe7f3b344a1b187b0c7b150');
            if(!creator){
                throw new Error('User not found');
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch (e) {
            console.log(e);
        }
    }
}