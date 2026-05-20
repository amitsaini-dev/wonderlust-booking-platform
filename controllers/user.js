const User=require("../models/user");

module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup=async (req, res,next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        let user = await User.register(newUser, password);
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome! Account created successfully.");
            res.redirect("/listings");
        })
    }
    catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=(req, res) => {
    res.render("users/login.ejs")
};

module.exports.login= async (req, res,next) => {
    req.flash("success", "Welcome back");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req, res,next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully.")
        res.redirect("/listings");
    });
};