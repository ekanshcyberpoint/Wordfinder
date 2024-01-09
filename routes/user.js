//routes user.js
const express = require('express');
const User = require('../models/user');
const { route } = require('./section');
const section = require('../models/section');
const router = express.Router();

// Route to render the user dashboard
router.get('/dashboard', async (req, res) => {
    try {
        // Check if the user ID is present in the session
        if (!req.session.userId) {
            return res.status(404).send('User id  not found');
        }
        // Find the user by their ID
        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Render the user dashboard view with the user object
        res.render('user/dashboard', { user });
    } catch (error) {
        console.error('Error rendering user dashboard:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to render the user profile
router.get('/profile', async (req, res) => {
    try {
        // Find the user by their ID
        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Render the user profile view with the user object
        res.render('user/profile', { user });
    } catch (error) {
        console.error('Error rendering user profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle editing the user profile
router.get('/edit-profile', async (req, res) => {
    try {
        // Find the user by their ID
        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Render the edit user profile view with the user object
        res.render('user/edit-profile', { user });
    } catch (error) {
        console.error('Error rendering edit user profile:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/create-profile', (req, res) => {
    res.render('user/create-profile');
});

// Route to handle the creation of the user profile
router.post('/create-profile', async (req, res) => {
    const { username, bio, portfolioLink } = req.body;

    try {
        // Find the user by their ID
        const user = await User.findById(req.session.userId);


        // Update the user profile fields
        user.username = username;
        user.bio = bio;
        user.portfolioLink = portfolioLink;

        // Save the updated user profile
        await user.save();

        // Redirect to the user dashboard or any other page
        res.redirect('/user/dashboard');
    } catch (error) {
        console.error('Error creating user profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle the update of the user profile
router.put('/update-profile', async (req, res) => {
    const { username, bio, portfolioLink } = req.body;

    try {
        // Find the user by their ID
        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update the user profile fields
        user.username = username;
        user.bio = bio;
        user.portfolioLink = portfolioLink;

        // Save the updated user profile
        await user.save();

        // Redirect to the user dashboard or any other page
        res.redirect('/user/dashboard');
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

//use pages 
router.get('/pages',async(req,res)=>{
    try {
        const sections = await section.find();
        res.render("user/pages.ejs",{sections});
    } catch (error) {
        console.log(error);
    }
});
// Route to handle user logout
router.get('/logout', (req, res) => {
    // Clear the user session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            // Redirect to the home page or login page after logout
            res.redirect('/dashboard');
        }
    });
});


module.exports = router;