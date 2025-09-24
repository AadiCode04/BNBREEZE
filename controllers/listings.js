const Listing = require("../models/listing.js");

//Index route
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};


//New route
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};


//Show route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
  // console.log("Current User ID:", req.user._id);
  // console.log("Listing Owner ID:", listing.owner._id);
  res.render("listings/show.ejs", { listing });
};


//Create Route
module.exports.createLisitng = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url , filename };
  newListing.geometry = req.body.listing.geometry;
  
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

//Edit Route
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload" , "/upload/h_300,w_250" );
  res.render("listings/edit.ejs", { listing , originalImageUrl });
};


//Update Route
module.exports.updateLisitng = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  let { id } = req.params;
  let listing =await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if(typeof req.file !== "undefined"){

    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url , filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};


//Delete Route
module.exports.deleteLisitng = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Delete");
  res.redirect("/listings");
}