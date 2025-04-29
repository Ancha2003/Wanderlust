const  User = require("../models/user")

module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup");
}
//signup form
module.exports.signUp =async (req,res) => {
    try {
        let { username , email, password } = req.body;
        const newUser=  new User({email,username});
      const registerUser = await  User.register(newUser,password);
      console.log(registerUser);
      req.login(registerUser, (err) => {
        if (err){ 
            return next(err); //handle login
        }       
            req.flash("success", "welcome to wanderlust");
        res.redirect(req.session.redirectURL || "/listings");// redirect to the original URL or default to "/listings";
    })
    } catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
}

// login 
module.exports.renderLoginForm =  (req,res) => {
    res.render("users/login.ejs");
}

module.exports.login =async (req, res) => {
    console.log("✅ Login successful");

    const redirectUrl = res.locals.redirectURL || "/listings";
    console.log("🚀 Redirecting user to:", redirectUrl);

    delete req.session.redirectURL;
    req.flash("success", "Welcome back to Wanderlust!");
    
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res) => {
    req.logout((err) => {
        if(err){
          return  next(err);
        }
        req.flash("success","you are logout! ");
        res.redirect("/listings");
    })
}