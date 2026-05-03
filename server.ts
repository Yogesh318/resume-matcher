import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory store for scraped jobs (simulated database)
  let scrapedJobs: any[] = [];

  // API Route for Chrome extension to send scraped data
  app.post("/api/scrape", (req, res) => {
    const { title, company, description, url } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newJob = {
      id: Date.now().toString(),
      title,
      company: company || "Unknown Company",
      description,
      url: url || "",
      scrapedAt: new Date().toISOString(),
    };
    scrapedJobs.push(newJob);
    console.log("New job scraped:", newJob.title);
    res.json({ message: "Job scraped successfully", job: newJob });
  });

  // Get all scraped jobs
  app.get("/api/scraped-jobs", (req, res) => {
    res.json(scrapedJobs);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
