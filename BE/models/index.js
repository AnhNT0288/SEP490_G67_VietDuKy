const { Sequelize } = require("sequelize");
const config = require("../db/config.js");

// Khởi tạo Sequelize với cấu hình từ `config.js`
const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: "mysql",
  dialectModule: require("mysql2"),
  logging: false, // Tắt log query SQL
});

// Kiểm tra kết nối
sequelize
  .authenticate()
  .then(() => console.log("Connected to MySQL successfully"))
  .catch((error) => console.error("Unable to connect to the database:", error));

// Import các model
//Role
const Role = require("./role.model.js")(sequelize, Sequelize);
//User
const User = require("./user.model.js")(sequelize, Sequelize);

const Booking = require("./booking.model")(sequelize, Sequelize);
//Restaurant
const Restaurant = require("./restaurant.model.js")(sequelize, Sequelize);
const RestaurantBooking = require("./restaurantBooking.model.js")(
  sequelize,
  Sequelize
);
//Hotel
const Hotel = require("./hotel.model.js")(sequelize, Sequelize);
const HotelBooking = require("./hotelBooking.model.js")(sequelize, Sequelize);
//Vehicle
const TypeVehicle = require("./typeVehicle.model.js")(sequelize, Sequelize);
const Vehicle = require("./vehicle.model.js")(sequelize, Sequelize);
const VehicleBooking = require("./vehicleBooking.model.js")(
  sequelize,
  Sequelize
);
//Customer
const Customer = require("./customer.model")(sequelize, Sequelize);
const PostExperience = require("./postExperience.model.js")(
  sequelize,
  Sequelize
);
const PaymentCard = require("./paymentCard.model.js")(sequelize, Sequelize);
const Payment = require("./payment.model.js")(sequelize, Sequelize);
//Notification
const Notification = require("./notification.model.js")(sequelize, Sequelize);
const NotificationType = require("./notificationType.model.js")(
  sequelize,
  Sequelize
);

//Article
const Article = require("./article.model.js")(sequelize, Sequelize);
//Directory
const Directory = require("./directory.model.js")(sequelize, Sequelize);

//Tour
const Tour = require("./tour.model")(sequelize, Sequelize);
const Passenger = require("./passenger.model")(sequelize, Sequelize);
const Voucher = require("./voucher.model")(sequelize, Sequelize);
const TypeTour = require("./typeTour.model")(sequelize, Sequelize);
const TravelTour = require("./travel_tour.model")(sequelize, Sequelize);
const Feedback = require("./feedback.model")(sequelize, Sequelize);
const GuideTour = require("./guideTour.model.js")(sequelize, Sequelize);
const TravelGuide = require("./travelGuide.model.js")(sequelize, Sequelize);
const Location = require("./location.model.js")(sequelize, Sequelize);
const Service = require("./service.model")(sequelize, Sequelize);
const TourInfo = require("./tour_info.model.js")(sequelize, Sequelize);
const DiscountService = require("./discountService.model.js")(
  sequelize,
  Sequelize
);
const ProgramDiscount = require("./programDiscount.model.js")(
  sequelize,
  Sequelize
);
const Topic = require("./topic.model")(sequelize, Sequelize);
const TourActivities = require("./tour_activities.model")(sequelize, Sequelize);
const TourService = require("./tour_service.model")(sequelize, Sequelize);
const TravelGuideLocation = require("./travelGuideLocation.model.js")(
  sequelize,
  Sequelize
);
const FavoriteTour = require("./favoriteTour.model.js")(sequelize, Sequelize);
const Like = require("./like.model.js")(sequelize, Sequelize);

// Mối quan hệ (Associations)
//Payment/Booking
Booking.hasMany(Payment, { foreignKey: "booking_id" });
Payment.belongsTo(Booking, { foreignKey: "booking_id" });
//Payment/Customer
Customer.hasMany(Payment, { foreignKey: "customer_id" });
Payment.belongsTo(Customer, { foreignKey: "customer_id" });

// User/Booking
User.hasMany(Booking, { foreignKey: "user_id" });
Booking.belongsTo(User, { foreignKey: "user_id" });

//Booking/RestaurantBooking
Booking.hasMany(RestaurantBooking, { foreignKey: "booking_id" });
RestaurantBooking.belongsTo(Booking, { foreignKey: "booking_id" });

//Restaurant/RestaurantBooking
Restaurant.hasMany(RestaurantBooking, { foreignKey: "restaurant_id" });
RestaurantBooking.belongsTo(Restaurant, { foreignKey: "restaurant_id" });

//Booking/HotelBooking
Booking.hasMany(HotelBooking, { foreignKey: "booking_id" });
HotelBooking.belongsTo(Booking, { foreignKey: "booking_id" });

//Hotel/HotelBooking
Hotel.hasMany(HotelBooking, { foreignKey: "hotel_id" });
HotelBooking.belongsTo(Hotel, { foreignKey: "hotel_id" });

//Booking/VehicleBooking
Booking.hasMany(VehicleBooking, { foreignKey: "booking_id" });
VehicleBooking.belongsTo(Booking, { foreignKey: "booking_id" });

//Vehicle/VehicleBooking
Vehicle.hasMany(VehicleBooking, { foreignKey: "vehicle_id" });
VehicleBooking.belongsTo(Vehicle, { foreignKey: "vehicle_id" });

//User/Customer
User.hasOne(Customer, { foreignKey: "user_id" });
Customer.belongsTo(User, { foreignKey: "user_id" });

//Customer/PaymentCard
Customer.hasMany(PaymentCard, { foreignKey: "customer_id" });
PaymentCard.belongsTo(Customer, { foreignKey: "customer_id" });

//User/Notification
User.hasMany(Notification, { foreignKey: "user_id" });
Notification.belongsTo(User, { foreignKey: "user_id" });

//NotificationType/Notification
NotificationType.hasMany(Notification, { foreignKey: "type_id" });
Notification.belongsTo(NotificationType, { foreignKey: "type_id", as: "type" });

//Booking/Notification
Booking.hasMany(Notification, { foreignKey: "booking_id" });
Notification.belongsTo(Booking, { foreignKey: "booking_id" });

//Feedback/User
User.hasMany(Feedback, { foreignKey: "user_id" });
Feedback.belongsTo(User, { foreignKey: "user_id", as: "user" });

//Feedback/TravelGuide
TravelGuide.hasMany(Feedback, { foreignKey: "travel_guide_id" });
Feedback.belongsTo(TravelGuide, {
  foreignKey: "travel_guide_id",
  as: "travelGuide",
});

//Tour/Feedback
Tour.hasMany(Feedback, { foreignKey: "tour_id" });
Feedback.belongsTo(Tour, { foreignKey: "tour_id", as: "tour" });

//Tour/Topic
Tour.belongsTo(Topic, { foreignKey: "topic_id", as: "topic" });
Topic.hasMany(Tour, { foreignKey: "topic_id" });

//Tour/TourService
Tour.belongsToMany(Service, {
  through: TourService,
  foreignKey: "tour_id",
  otherKey: "service_id",
  as: "Services",
});
Service.belongsToMany(Tour, {
  through: TourService,
  foreignKey: "service_id",
  otherKey: "tour_id",
  as: "Tours",
});

//Tour/TravelTour
//Tour/DepartureSchedule
Tour.hasMany(TravelTour, { foreignKey: "tour_id" });
TravelTour.belongsTo(Tour, { foreignKey: "tour_id" });

//Location/Tour
Location.hasMany(Tour, { foreignKey: "start_location" });
Location.hasMany(Tour, { foreignKey: "end_location" });
Tour.belongsTo(Location, { foreignKey: "start_location", as: "startLocation" });
Tour.belongsTo(Location, { foreignKey: "end_location", as: "endLocation" });

//ProgramDiscount/DiscountService
ProgramDiscount.hasMany(DiscountService, { foreignKey: "program_discount_id" });
DiscountService.belongsTo(ProgramDiscount, {
  foreignKey: "program_discount_id",
  as: "programDiscount",
});

//DepartureSchedule/DiscountService
TravelTour.hasMany(DiscountService, { foreignKey: "travel_tour_id" });
DiscountService.belongsTo(TravelTour, {
  foreignKey: "travel_tour_id",
  as: "travelTour",
});

//TravelGuide/GuideTour
TravelGuide.hasMany(GuideTour, { foreignKey: "travel_guide_id" });
GuideTour.belongsTo(TravelGuide, {
  foreignKey: "travel_guide_id",
  as: "travelGuide",
});

//DepartureSchedule/GuideTour
TravelTour.hasMany(GuideTour, { foreignKey: "travel_tour_id" });
GuideTour.belongsTo(TravelTour, {
  foreignKey: "travel_tour_id",
  as: "travelTour",
});

//User/TravelGuide
User.hasOne(TravelGuide, { foreignKey: "user_id" });
TravelGuide.belongsTo(User, { foreignKey: "user_id", as: "user" });

//User(user_id)/TravelGuide(staff_id)
User.hasMany(TravelGuide, { foreignKey: "staff_id" });
TravelGuide.belongsTo(User, { foreignKey: "staff_id", as: "staff" });

//Role/User
Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

//PostExperience/User
User.hasMany(PostExperience, { foreignKey: "id" });
PostExperience.belongsTo(User, { foreignKey: "id", as: "user" });

//Booking/Notification
Booking.hasMany(Notification, { foreignKey: "booking_id" });
Notification.belongsTo(Booking, { foreignKey: "booking_id" });

//DepartureSchedule/Booking
TravelTour.hasMany(Booking, { foreignKey: "travel_tour_id" });
Booking.belongsTo(TravelTour, { foreignKey: "travel_tour_id" });

//TypeTour/Tour
TypeTour.hasMany(Tour, { foreignKey: "type_id" });
Tour.belongsTo(TypeTour, { foreignKey: "type_id", as: "typeTour" });

//Passenger/Booking
Passenger.hasMany(Booking, { foreignKey: "booking_id" });
Booking.belongsTo(Passenger, { foreignKey: "booking_id", as: "passenger" });

//Tour/TourActivities
Tour.hasMany(TourActivities, { foreignKey: "tour_id" });
TourActivities.belongsTo(Tour, { foreignKey: "tour_id" });

//User/Aritcle
User.hasMany(Article, { foreignKey: "user_id" });
Article.belongsTo(User, { foreignKey: "user_id", as: "author" });

//Directory/Article
Directory.hasMany(Article, { foreignKey: "directory_id" });
Article.belongsTo(Directory, { foreignKey: "directory_id", as: "directory" });

//TravelGuide/TravelGuideLocation
TravelGuide.hasMany(TravelGuideLocation, {
  foreignKey: "travel_guide_id",
});
TravelGuideLocation.belongsTo(TravelGuide, {
  foreignKey: "travel_guide_id",
  as: "TravelGuideLocations",
});

//Location/TravelGuideLocation
Location.hasMany(TravelGuideLocation, { foreignKey: "location_id" });
TravelGuideLocation.belongsTo(Location, {
  foreignKey: "location_id",
  as: "location",
});

//TravelGuide/Location
TravelGuide.belongsToMany(Location, {
  through: TravelGuideLocation,
  foreignKey: "travel_guide_id",
  otherKey: "location_id",
  as: "locations",
});

//FavoriteTour/User
User.hasMany(FavoriteTour, { foreignKey: "user_id" });
FavoriteTour.belongsTo(User, { foreignKey: "user_id", as: "user" });

//FavoriteTour/Tour
Tour.hasMany(FavoriteTour, { foreignKey: "tour_id" });
FavoriteTour.belongsTo(Tour, { foreignKey: "tour_id", as: "tour" });

//Like/User
User.hasMany(Like, { foreignKey: "user_id" });
Like.belongsTo(User, { foreignKey: "user_id", as: "user" });

//Like/Feedback
Feedback.hasMany(Like, {
  foreignKey: "target_id",
  constraints: false,
  scope: { target_type: "feedback" },
});
Like.belongsTo(Feedback, {
  foreignKey: "target_id",
  constraints: false,
  as: "feedback",
});

// Like/PostExperience
PostExperience.hasMany(Like, {
  foreignKey: "target_id",
  constraints: false,
  scope: { target_type: "postExperience" },
});
Like.belongsTo(PostExperience, {
  foreignKey: "target_id",
  constraints: false,
  as: "postExperience",
});

// Like/Article
Article.hasMany(Like, {
  foreignKey: "target_id",
  constraints: false,
  scope: { target_type: "article" },
});
Like.belongsTo(Article, {
  foreignKey: "target_id",
  constraints: false,
  as: "article",
});

//Passenger/TravelGuide
Passenger.belongsTo(TravelGuide, {
  foreignKey: "travel_guide_id",
  as: "travelGuide",
});
TravelGuide.hasMany(Passenger, {
  foreignKey: "travel_guide_id",
  as: "passengers",
});

Tour.hasMany(TourInfo, { foreignKey: "tour_id", as: "tourInfo" });
TourInfo.belongsTo(Tour, { foreignKey: "tour_id", as: "tour" });

// Đối tượng `db` để chứa Sequelize và Models
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User;

db.Booking = Booking;

db.Restaurant = Restaurant;
db.RestaurantBooking = RestaurantBooking;

db.Hotel = Hotel;
db.HotelBooking = HotelBooking;

db.TypeVehicle = TypeVehicle;
db.Vehicle = Vehicle;
db.VehicleBooking = VehicleBooking;

db.Customer = Customer;
db.PostExperience = PostExperience;
db.PaymentCard = PaymentCard;
db.Payment = Payment;

db.Notification = Notification;
db.NotificationType = NotificationType;

db.Role = Role;

db.Tour = Tour;
db.TypeTour = TypeTour;
db.Passenger = Passenger;
db.Voucher = Voucher;
db.TravelTour = TravelTour;
db.Feedback = Feedback;
db.GuideTour = GuideTour;
db.TravelGuide = TravelGuide;
db.Location = Location;
db.Service = Service;
db.DiscountService = DiscountService;
db.ProgramDiscount = ProgramDiscount;
db.TourActivities = TourActivities;
db.TourService = TourService;
db.Topic = Topic;
db.Article = Article;
db.Directory = Directory;
db.TravelGuideLocation = TravelGuideLocation;
db.FavoriteTour = FavoriteTour;
db.Like = Like;
db.TourInfo = TourInfo;
module.exports = db;
