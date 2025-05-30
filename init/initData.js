const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
const { faker } = require('@faker-js/faker');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB...");
}

const NUM_USERS = 6;
const NUM_LISTINGS = 20;
const REVIEWS_PER_LISTING = 9;

const sampleImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1470165301023-58dab8118cc9?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1602391833977-358a52198938?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1618140052121-39fc6db33972?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1533619239233-6280475a633a?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=60"
];

const listingTypes = [
  { type: "Mountain Retreat", desc: "Nestled high in the mountains, this retreat offers a serene getaway with breathtaking panoramic views of rolling peaks. Enjoy crisp, fresh air, scenic hiking trails, and cozy cabins with fireplaces. Perfect for disconnecting from the hustle of everyday life and embracing nature’s tranquility." },
  { type: "Beach House", desc: "Wake up to the soothing sound of waves and the golden glow of sunrise over the ocean. This beachfront escape offers direct access to sandy shores, perfect for sunbathing, swimming, and evening walks. Enjoy open-air patios, fresh seafood, and the ultimate coastal relaxation experience." },
  { type: "City Apartment", desc: "Located in the vibrant heart of the city, this modern apartment offers stylish interiors with all amenities. Walk to trendy cafes, cultural landmarks, and bustling nightlife. Enjoy skyline views from the balcony, convenient transport links, and the perfect mix of comfort and urban adventure." },
  { type: "Countryside Farmhouse", desc: "Escape to a charming farmhouse set amidst rolling fields and picturesque landscapes. Experience life on a working farm, where you can enjoy fresh produce, peaceful surroundings, and cozy rustic decor. Ideal for those looking to unwind and reconnect with nature at a leisurely pace." },
  { type: "Lake Cabin", desc: "A rustic yet cozy cabin situated on the tranquil shores of a beautiful lake. Enjoy fishing, canoeing, and lakeside picnics, or simply relax by the water with a good book. Perfect for nature lovers who cherish peaceful surroundings, starry nights, and the calming effect of gentle waves." },
  { type: "Historic Castle", desc: "Step into history and live like royalty in this majestic castle. Featuring grand halls, antique furnishings, and sweeping views, this enchanting stay lets you explore medieval architecture and timeless elegance. Experience the magic of stone walls, hidden corridors, and a regal escape unlike any other." },
  { type: "Desert Camp", desc: "Venture into the heart of the desert, where golden dunes stretch as far as the eye can see. Stay in traditional tents equipped with comfortable amenities, savor local cuisine, and gaze at mesmerizing star-filled skies. Ideal for adventurers seeking an authentic, unforgettable desert experience." },
  { type: "Snow Chalet", desc: "A warm and inviting wooden chalet nestled in a winter wonderland. After a day on the slopes, unwind by the fireplace with a cup of cocoa. Enjoy breathtaking snowy landscapes, ski-in/ski-out convenience, and the perfect mix of adventure and relaxation in a cozy alpine setting." },
  { type: "Jungle Lodge", desc: "Immerse yourself in the heart of a lush jungle, surrounded by exotic wildlife and towering trees. Wake up to birdsong, explore hidden waterfalls, and enjoy eco-friendly accommodations. A true escape for nature lovers seeking adventure, tranquility, and a deep connection to the wilderness." },
  { type: "Island Bungalow", desc: "Experience paradise in a private bungalow on a secluded tropical island. Lounge on white sandy beaches, swim in crystal-clear waters, and soak in breathtaking sunset views. A perfect getaway for those seeking peace, tranquility, and the unmatched beauty of nature’s finest surroundings." },
  { type: "Treehouse", desc: "Perched among the treetops, this unique accommodation offers stunning forest views and an unforgettable experience. Feel the gentle sway of trees, listen to rustling leaves, and immerse yourself in nature. A perfect retreat for adventurers and dreamers wanting to escape into a magical, elevated haven." },
  { type: "Boathouse", desc: "Wake up surrounded by gentle waves in this charming boathouse. Enjoy peaceful mornings by the water, watch boats drift by, and take in mesmerizing sunrises. Whether you’re fishing, kayaking, or simply unwinding with a book, this floating retreat offers a truly unique and relaxing escape." },
  { type: "Arctic Igloo", desc: "Experience the beauty of the frozen north in a warm glass igloo. Sleep under shimmering northern lights, surrounded by breathtaking snowy landscapes. Cozy interiors ensure comfort while offering an unparalleled view of the sky. A rare and magical stay for those seeking something extraordinary." },
  { type: "Urban Loft", desc: "A sleek and stylish loft in a dynamic cityscape. Featuring modern design, high ceilings, and expansive windows with city views. Walk to nearby art galleries, music venues, and eclectic restaurants. The ideal spot for those who love fast-paced city life with all its vibrant energy." },
  { type: "Safari Tent", desc: "Stay in luxury amid the untamed beauty of the savannah. Wake up to the sights and sounds of roaming wildlife, enjoy open-air dining, and experience breathtaking sunsets. This tented camp combines adventure with elegance, offering an unforgettable safari experience under the vast African sky." },
  { type: "Vineyard Villa", desc: "Surrounded by rolling vineyards, this elegant villa offers a sophisticated retreat for wine lovers. Savor local vintages, enjoy picturesque views, and unwind in luxurious accommodations. A perfect escape for those seeking relaxation, refined elegance, and a taste of the countryside’s finest flavors." },
  { type: "Cave Home", desc: "Delve into history with a stay in an authentic cave home, where ancient charm meets modern comfort. Cool stone walls create a unique atmosphere, offering tranquility and a connection to centuries-old traditions. A fascinating escape for those looking for something truly different." },
  { type: "Dome House", desc: "A futuristic escape offering panoramic views and an innovative design. This unique dome-shaped home provides an eco-friendly, aesthetically stunning experience. Perfect for stargazing, enjoying open-concept living, and experiencing the harmony of modern architecture within a beautiful landscape." },
  { type: "Tiny Home", desc: "Enjoy minimalistic living in this thoughtfully designed tiny home. Despite its compact size, it offers smart space utilization, cozy interiors, and eco-conscious amenities. A perfect retreat for travelers seeking simplicity, sustainability, and a unique way to experience the comforts of home." },
  { type: "Eco Lodge", desc: "Sustainability meets comfort in this eco-friendly lodge, designed to harmonize with nature. Solar energy, organic materials, and green initiatives provide an environmentally responsible stay. Ideal for conscious travelers looking for relaxation while leaving a positive impact on the planet." }
];

const reviewComments = [
  "Absolutely loved my stay! Highly recommended.",
  "The location was perfect and the host was very helpful.",
  "Clean, comfortable, and exactly as described.",
  "Would definitely come back again!",
  "A unique experience, thank you for hosting us.",
  "The view was stunning and the amenities were great.",
  "Felt like home away from home.",
  "The property exceeded our expectations.",
  "Great value for the price.",
  "A peaceful and relaxing getaway.",
  "The host went above and beyond to make us feel welcome.",
  "Perfect for a family vacation.",
  "The pictures don't do it justice!",
  "Everything was spotless and well maintained.",
  "We enjoyed every moment of our trip.",
  "The neighborhood was quiet and safe.",
  "Check-in was smooth and easy.",
  "The beds were super comfortable.",
  "Would recommend to friends and family.",
  "Can't wait to visit again!",
  "The decor was beautiful and stylish.",
  "Lots of thoughtful touches throughout the property.",
  "Close to great restaurants and shops.",
  "The outdoor space was amazing.",
  "We saw lots of wildlife nearby.",
  "Perfect spot for a romantic getaway.",
  "The kitchen was fully equipped.",
  "Loved the fireplace and cozy atmosphere.",
  "The sunsets were unforgettable.",
  "A truly memorable experience."
];

async function seed() {
  // Clean up
  await Listing.deleteMany({});
  await Review.deleteMany({});
  await User.deleteMany({});

  // Create users
  const userData = [
    { username: "alice", email: "alice@example.com", password: "hello" },
    { username: "bob", email: "bob@example.com", password: "hello" },
    { username: "carol", email: "carol@example.com", password: "hello" },
    { username: "dave", email: "dave@example.com", password: "hello" },
    { username: "eve", email: "eve@example.com", password: "hello" },
    { username: "frank", email: "frank@example.com", password: "hello" }
  ];

  // Register users with passport-local-mongoose
  const users = [];
  for (let data of userData) {
    const user = new User({ username: data.username, email: data.email });
    const registeredUser = await User.register(user, data.password);
    users.push(registeredUser);
  }

  // Create listings
  const listings = [];
  for (let i = 0; i < NUM_LISTINGS; i++) {
  const owner = users[Math.floor(Math.random() * users.length)];
  const typeObj = listingTypes[i % listingTypes.length];
  const city = faker.location.city();
  const country = faker.location.country();
  const image = sampleImages[i % sampleImages.length]; // Assign images sequentially
  const listing = new Listing({
    title: `${typeObj.type} in ${city}`,
    description: `${typeObj.desc}`,
    image: image,
    price: faker.number.int({ min: 500, max: 10000 }),
    location: city,
    country: country,
    owner: owner._id
  });
  await listing.save();
  listings.push(listing);
  }

  // Create reviews for each listing
  for (let listing of listings) {
    const reviewIds = [];
    // Get reviewers who are not the owner
    const possibleReviewers = users.filter(u => !u._id.equals(listing.owner));
    for (let j = 0; j < REVIEWS_PER_LISTING; j++) {
      if (possibleReviewers.length === 0) break; // Avoid infinite loop
      const reviewer = possibleReviewers[Math.floor(Math.random() * possibleReviewers.length)];
      const review = new Review({
        rating: faker.number.int({ min: 3, max: 5 }),
        comments: faker.helpers.arrayElement(reviewComments),
        author: reviewer._id
      });
      await review.save();
      reviewIds.push(review._id);
    }
    listing.reviews = reviewIds;
    await listing.save();
  }

  console.log("Database seeded with meaningful users, listings, and reviews!");
}

main()
  .then(seed)
  .then(() => mongoose.connection.close());