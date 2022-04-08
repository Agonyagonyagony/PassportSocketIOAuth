import "dotenv/config";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import * as session from "express-session";
import * as passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";
import * as cookieParser from "cookie-parser";
import * as express from "express";

const port = process.env.PORT || 3001;

const app = express();

const sessionMiddleware = session({
  secret: "secret",
  cookie: {
    secure: "false",
  },
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/spotify/callback",
      passReqToCallback: true,
    },
    function (req, accessToken, refreshToken, expires_in, profile, done) {
      const user = profile;
      done(null, user);
    }
  )
);

app.use(cookieParser());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/spotify", passport.authenticate("spotify"));

app.get(
  "/auth/spotify/callback",
  passport.authenticate("spotify", { failureRedirect: "/login" }),
  function (req, res) {
    console.log(req.session);
    // console.log(req.session.cookie);
    // Successful authentication, redirect home.
    // // res.cookie("connect.sid", JSON.stringify(req.session.cookie));
    res.redirect("/");
  }
);

app.get("/", (req, res) => {});

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.on("connection", (socket: Socket) => {
  console.log("socket initialization completed");
  console.log(socket.request.user ?? "none");
  console.log(socket.request.passport ?? "none");
  socket.on("say", (data) => {
    console.log(data, "received information");
    socket.emit("message", { hello: "who are you" });
  });
});

server.listen(port, () => {
  console.log(`application is running at: http://localhost:${port}`);
});
