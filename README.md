# Wanderlust Booking Platform

A full-stack Airbnb-inspired web app built with Node.js, Express, MongoDB, and EJS.

## 🚀 Live Demo
[Link coming after deployment]

## ✨ Features (Phase 1 Complete)
- Browse all property listings
- View listing details
- Create, edit and delete listings
- Server-side validation with Joi
- Client-side Bootstrap form validation
- Custom error handling middleware
- Responsive UI with Bootstrap 5

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Templating:** EJS, ejs-mate
- **Styling:** Bootstrap 5, CSS3
- **Validation:** Joi
- **Tools:** method-override, dotenv

## 📦 Setup Instructions
1. Clone the repo
2. Run `npm install`
3. Create `.env` file → add `MONGO_URL=mongodb://127.0.0.1:27017/wanderlust`
4. Run `node init/index.js` to seed database
5. Run `node app.js`
6. Visit `http://localhost:8080/listings`

## 🗺️ Upcoming Features
- User authentication (Passport.js)
- Image uploads (Cloudinary)
- Interactive maps (Mapbox)
- Reviews and ratings
- Search and filters