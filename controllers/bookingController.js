const Booking = require('../Models/booking');
const Listing = require('../Models/listing');

// Show booking form for a specific listing
exports.showBookingForm = async (req, res) => {
    try {
        const listingId = req.params.id; // Get the listingId from the URL
        const listing = await Listing.findById(listingId); // Find the listing by ID

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Render the booking form with the listing data
        res.render('listings/book', { listing });
    } catch (error) {
        console.error('Error retrieving booking form:', error);
        res.status(500).json({ message: 'An error occurred while retrieving the booking form' });
    }
};

// Create a booking
exports.createBooking = async (req, res) => {
    try {
        const {
            firstName, lastName, email, phone, checkIn, checkOut, guests, requests,
            cardName, cardNumber, expiryDate, cvv, listingId
        } = req.body;


        // Create a new booking
        const booking = new Booking({
            firstName,
            lastName,
            email,
            phone,
            checkIn,
            checkOut,
            guests,
            requests,
            cardName,
            cardNumber,
            expiryDate,
            cvv,
            listing: listingId
        });

        // Save the booking to the database
        await booking.save();

        // Find the listing and update it with booking information (e.g., available dates)
        const listing = await Listing.findById(listingId);
        if (listing) {
            // Update the listing with any necessary booking info
            // For example, you can reduce availability or set a "booked" flag
            listing.bookings.push(booking._id);
            await listing.save();
        }
        req.flash("success", "Your Booking has been Confirmed ");

        // Redirect to the listings page after successful booking
        res.redirect('/listings'); // Change this to your listings page URL
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'An error occurred while creating the booking' });
    }
};

