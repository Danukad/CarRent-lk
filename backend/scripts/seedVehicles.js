require("dotenv").config();
const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");
const Company = require("../models/Company");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const adminUser = await User.findOne({ role: "admin" }) || await User.findOne();
  const thingiCompany = await Company.findOne({ companyName: /thingi/i }) || await Company.findOne();

  const vehiclesData = [
    {
      brand: "Suzuki",
      model: "Wagon R",
      year: 2018,
      pricePerDay: 20000,
      pricePerKmAfter100km: 1000,
      vehicleType: "mini-car",
      fuelType: "Hybrid",
      transmission: "Auto",
      description: "Comfortable and fuel efficient Japanese mini-car, ideal for city and island tours.",
      location: "Ganhela, Matara District, Southern Province, 81400",
      lat: 5.9549,
      lng: 80.555,
      images: [
        "https://res.cloudinary.com/gjjnq5g0/image/upload/v1790524197/carrents/defaults/nlthlhvfralvpvnhbbdo.png"
      ],
      owner: adminUser._id,
      company: null,
      isFeatured: true,
      availableFrom: new Date(),
      availableTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    {
      brand: "Toyota",
      model: "Axio",
      year: 2005,
      pricePerDay: 45634,
      pricePerKmAfter100km: 28,
      vehicleType: "car",
      fuelType: "Petrol",
      transmission: "Auto",
      description: "Reliable sedan with great legroom and air conditioning.",
      location: "Samsung, Edward Lane, Bambalapitiya, Milagiriya",
      lat: 6.8967,
      lng: 79.8572,
      images: [
        "https://res.cloudinary.com/gjjnq5g0/image/upload/v1790311226/carrents/vehicles/m3ikszgfxmexlo4qubtx.jpg"
      ],
      owner: adminUser._id,
      company: null,
      isFeatured: true,
      availableFrom: new Date(),
      availableTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    {
      brand: "Suzuki",
      model: "Wagon R",
      year: 2008,
      pricePerDay: 456,
      pricePerKmAfter100km: 556,
      vehicleType: "mini-car",
      fuelType: "Diesel",
      transmission: "Auto",
      description: "Economical runabout for quick errands and daily commute.",
      location: "Samsung, Edward Lane, Bambalapitiya, Milagiriya",
      lat: 6.8967,
      lng: 79.8572,
      images: [
        "https://res.cloudinary.com/gjjnq5g0/image/upload/v1790337207/carrents/vehicles/ceexyowunh7acgcgvc03.jpg"
      ],
      owner: thingiCompany ? thingiCompany.user : adminUser._id,
      company: thingiCompany ? thingiCompany._id : null,
      isFeatured: true,
      availableFrom: new Date(),
      availableTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    {
      brand: "Suzuki",
      model: "Every",
      year: 2020,
      pricePerDay: 10000,
      pricePerKmAfter100km: 34,
      vehicleType: "mini-van",
      fuelType: "Diesel",
      transmission: "Auto",
      description: "Spacious compact microvan, perfect for small groups and luggage transport.",
      location: "Suduwella, Slave Island, Colombo, Colombo District",
      lat: 6.9271,
      lng: 79.8612,
      images: [
        "https://res.cloudinary.com/gjjnq5g0/image/upload/v1790524234/carrents/defaults/zkgwkpwwir7l8ixicvjn.png"
      ],
      owner: adminUser._id,
      company: null,
      isFeatured: true,
      availableFrom: new Date(),
      availableTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    {
      brand: "TVS",
      model: "King",
      year: 2000,
      pricePerDay: 4500,
      pricePerKmAfter100km: 25,
      vehicleType: "threewheeler",
      fuelType: "Petrol",
      transmission: "Manual",
      description: "Authentic Sri Lankan Tuk Tuk experience. Easy navigation through busy streets.",
      location: "Harapalagala, Kandy",
      lat: 7.2906,
      lng: 80.6337,
      images: [
        "https://res.cloudinary.com/gjjnq5g0/image/upload/v1790524320/carrents/defaults/a3az0yk5atobp1ci2e4d.png"
      ],
      owner: adminUser._id,
      company: null,
      isFeatured: false,
      availableFrom: new Date(),
      availableTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    {
      brand: "Honda",
      model: "Dio",
      year: 2019,
      pricePerDay: 3500,
      pricePerKmAfter100km: 15,
      vehicleType: "bicycle",
      fuelType: "Petrol",
      transmission: "Auto",
      description: "Zippy lightweight scooter with underseat storage, ideal for coastal rides.",
      location: "Mirissa, Southern Province",
      lat: 5.9483,
      lng: 80.4716,
      images: [
        "https://res.cloudinary.com/gjjnq5g0/image/upload/v1790524342/carrents/defaults/bf3pg6qy5r6r7wjdix6x.png"
      ],
      owner: thingiCompany ? thingiCompany.user : adminUser._id,
      company: thingiCompany ? thingiCompany._id : null,
      isFeatured: false,
      availableFrom: new Date(),
      availableTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    {
      brand: "Hero",
      model: "Sprint",
      year: 1988,
      pricePerDay: 1500,
      pricePerKmAfter100km: 0,
      vehicleType: "bicycle",
      fuelType: "Manual",
      transmission: "Manual",
      description: "Classic vintage touring bicycle for eco-friendly sightseeing.",
      location: "Colombo Fort, Colombo",
      lat: 6.9344,
      lng: 79.8428,
      images: [
        "https://res.cloudinary.com/gjjnq5g0/image/upload/v1790340486/carrents/vehicles/gnqqiielfjycupgrc8er.jpg"
      ],
      owner: adminUser._id,
      company: null,
      isFeatured: true,
      availableFrom: new Date(),
      availableTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    {
      brand: "Toyota",
      model: "Prius",
      year: 2008,
      pricePerDay: 24000,
      pricePerKmAfter100km: 45,
      vehicleType: "car",
      fuelType: "Hybrid",
      transmission: "Auto",
      description: "Super fuel-efficient hybrid sedan with smooth suspension and generous trunk space.",
      location: "Boralesgamuwa, Western Province",
      lat: 6.8417,
      lng: 79.9056,
      images: [
        "https://res.cloudinary.com/gjjnq5g0/image/upload/v1790524186/carrents/defaults/njzonjz9pb5swcki6per.png"
      ],
      owner: adminUser._id,
      company: null,
      isFeatured: true,
      availableFrom: new Date(),
      availableTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    {
      brand: "Mercedes Benz",
      model: "C-Class",
      year: 2007,
      pricePerDay: 55000,
      pricePerKmAfter100km: 65,
      vehicleType: "premium-car",
      fuelType: "Petrol",
      transmission: "Auto",
      description: "Luxury German sedan with premium leather interior, sunroof, and prestige drive.",
      location: "Colombo 07, Cinnamon Gardens",
      lat: 6.9114,
      lng: 79.8646,
      images: [
        "https://res.cloudinary.com/gjjnq5g0/image/upload/v1790524207/carrents/defaults/uzke0ksf5zwzufph6ucp.png"
      ],
      owner: adminUser._id,
      company: null,
      isFeatured: true,
      availableFrom: new Date(),
      availableTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }
  ];

  await Vehicle.deleteMany({});
  const created = await Vehicle.insertMany(vehiclesData);
  console.log(`✅ Successfully seeded ${created.length} vehicles with permanent Cloudinary images!`);
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
