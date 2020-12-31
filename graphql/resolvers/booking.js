const Booking = require('../../models/booking');
const Event = require('../../models/event');

const { cleanedUpBooking, cleanedUpEvent} = require('./resolveUtils');

module.exports = {
    getBookings: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Permission denied!');
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => cleanedUpBooking(booking));
        } catch (e) {
            console.log(e);
        }
    },
    bookEvent: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Permission denied!');
        }
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            user: req.userId,
            event: fetchedEvent
        })
        const result = await booking.save();
        return cleanedUpBooking(result);
    },
    cancelBooking: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Permission denied!');
        }
        try{
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = cleanedUpEvent(booking.event);
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } catch (e) {
            throw e;
        }
    }
}