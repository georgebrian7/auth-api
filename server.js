require("dotenv").config();

const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const app = express();
app.use(express.json());

app.post("/auth/signup", async (req, res) => {
  const { email, password } = req.body;


  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json({ user: data.user });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;


  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ error: "Invalid login credentials" });
  }

  return res.status(200).json({  access_token: data.session.access_token,
    refresh_token: data.session.refresh_token, });
});

app.get("/public/info", (req, res) => {
   if (error) {
    return res.status(401).json({ error: "Invalid login credentials" });
  }

  return res.status(200).json({ message: "Welcome stranger! This info is public." });
});

app.get("/protected/profile", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Access token required" });
  }
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
    return res.status(401).json({ error: "Access token required" });
  }

  const token = parts[1];

  return res.status(200).json({ message: "token received" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});