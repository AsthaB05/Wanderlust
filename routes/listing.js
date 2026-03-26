const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../init/controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});


router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing))


//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.get("/filter/:category", wrapAsync(async (req, res) => {
    let { category } = req.params;

    const filteredListings = await Listing.find({ category });

    if (!filteredListings.length) {
        req.flash("error", "No listings found for this category");
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allListings: filteredListings });
}));


router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;


//index route
// router.get("/",wrapAsync(listingController.index));


//create route
// router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.createListing));

//show route
// router.get("/:id",wrapAsync(listingController.showListing));


//update route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

//delete route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

