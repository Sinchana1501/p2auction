# p2auction backend

Express + MongoDB (Mongoose) API for the p2auction app.

## Endpoints

| Method | Route              | Description                  |
|--------|--------------------|-------------------------------|
| GET    | `/sayhello`         | Health check                  |
| POST   | `/signup`           | Create a new user             |
| POST   | `/signin`           | Log in with rollNo + password |
| POST   | `/addauctiondata`   | Create an auction listing     |
| GET    | `/getauctiondata`   | List all auctions             |

## Local setup

```bash
npm install
cp .env.example .env   # then fill in MONGO_URI
npm run dev            # nodemon, auto-restarts on changes
# or
npm start               # plain node
```

## Deploying to Render

1. Push this repo to GitHub (already done if you're reading this there).
2. Go to https://dashboard.render.com → **New** → **Blueprint**, and point it at this repo. Render will read `render.yaml` automatically and set up the service.
   - Alternatively: **New** → **Web Service**, connect the repo, and set:
     - Build command: `npm install`
     - Start command: `npm start`
3. In the Render dashboard, under **Environment**, add:
   - `MONGO_URI` — your MongoDB connection string
4. Deploy. Render will give you a public URL like `https://p2auction.onrender.com`.
5. Test it: `curl https://p2auction.onrender.com/sayhello`

## Important: rotate your MongoDB credentials

The original `MONGO_URI` was committed to this repo's git history in a public GitHub repo, which means it's already exposed. Before/after deploying:

1. Go to MongoDB Atlas → Database Access.
2. Change the password for the `Sinchana` user (or delete it and create a new user).
3. Update `MONGO_URI` in Render's environment settings (and your local `.env`) with the new password.

Note: rewriting git history to remove the old secret does **not** fully protect you — anyone who already saw it may have a copy. Rotating the password is the only real fix.
