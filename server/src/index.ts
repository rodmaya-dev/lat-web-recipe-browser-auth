import express, { type Request, type Response } from "express";
import { PORT } from "./config.js";
import recipesRouter from "./routes/recipes.js";

const app = express();

app.use(express.json());

app.use("/recipes", recipesRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
