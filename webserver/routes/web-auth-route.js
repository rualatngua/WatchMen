var config = require('../../config/web');
var passport = require('passport');
var url = require('url');

var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

module.exports = (function (){

  function isAdmin(email){
    var admins = (process.env.WATCHMEN_ADMINS || '').split(',').map(function(email){ return email.trim (); });
    return admins.indexOf(email)>-1;
  }

  return {
    
    /**
     * Configure application with authentication mechanisms
     * @param  {Application} app
     */
    configureApp : function (app){

      passport.use(new GoogleStrategy({
          clientID: config.auth.GOOGLE_CLIENT_ID,
          clientSecret: config.auth.GOOGLE_CLIENT_SECRET,
          passReqToCallback: true,
          callbackURL: url.resolve(config.public_host_name || '', '/auth/google/callback')
        },
        function(request, accessToken, refreshToken, profile, done) {
          var email = profile.emails[0].value;
          done(null, { email : email, isAdmin: isAdmin(email) });
        }
      ));

      passport.serializeUser(function(user, done) {
        done(null, user);
      });

      passport.deserializeUser(function(obj, done) {
        done(null, obj);
      });

      app.use(passport.initialize());
      app.use(passport.session());

      app.get('/auth/google', passport.authenticate('google', {
        scope: 'https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
      }));

      app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/'
      }), function(req, res) {
          // successful authentication
          res.redirect('/');
      });

      app.get('/logout', function (req, res){
        req.logOut();
        res.redirect('/');
      });
    }
  };

}());