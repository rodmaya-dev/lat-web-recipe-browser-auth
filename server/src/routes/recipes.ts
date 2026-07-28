import { Router, type Request, type Response } from "express";
import { recipes } from "../data/recipes.js";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ data: recipes });
});

router.get("/:id", (req: Request, res: Response) => {
  const recipe = recipes.find((r) => r.id === req.params.id);
  if (!recipe) {
    console.error(`GET /recipes/${req.params.id} 404: recipe not found`);
    res.status(404).json({ message: "Receta no encontrada" });
    return;
  }
  res.json({ data: recipe });
});

router.put("/:id/likes", (req: Request, res: Response) => {
  const recipe = recipes.find((r) => r.id === req.params.id);
  if (!recipe) {
    console.error(`PUT /recipes/${req.params.id}/likes 404: recipe not found`);
    res.status(404).json({ message: "Receta no encontrada" });
    return;
  }

  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ message: "Se requiere userId" });
    return;
  }

  if (recipe.likes.includes(userId)) {
    recipe.likes = recipe.likes.filter((id) => id !== userId);
  } else {
    recipe.likes.push(userId);
  }

  res.json({ data: recipe });
});

export default router;
