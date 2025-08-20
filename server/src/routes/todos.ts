import { Router } from "express";
import { prisma } from "../db";
import { requireAuth, type AuthRequest } from "../middleware/auth";

const router = Router();

// todos of current user
router.get("/", requireAuth, async (req: AuthRequest, res) => {
   const userId = req.user!.userId;
   const todos = await prisma.todo.findMany({ 
      where: { userId }, 
      orderBy: { id: 'desc' },
   });
   res.json(todos);
});

// create new todo
router.post("/", requireAuth, async (req: AuthRequest, res) => {
   const userId = req.user!.userId;

   const { title } = req.body as { title?: string };
   if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "title required" });
   };

   const todo = await prisma.todo.create({
      data: { title: title.trim(), userId, completed: false }
   });

   res.status(201).json(todo);
});

// update todo
router.put("/:id", requireAuth, async (req: AuthRequest, res) => {
   const userId = req.user!.userId;

   const id = Number(req.params.id);
   if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "invalid id" });
   };

   const existing = await prisma.todo.findUnique({ where: { id } });
   if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "not found" });
   };

   const { title, completed } = req.body as { title?: string; completed?: boolean };
   const data: { title?: string; completed?: boolean } = {};

   if (typeof title === "string") {
      const t = title.trim();
      if (!t) return res.status(400).json({ error: "title required" });
      data.title = t;
   };
   if (typeof completed === "boolean") {
      data.completed = completed;
   };
   if (!("title" in data) && !("completed" in data)) {
      return res.status(400).json({ error: "nothing to update" });
   };

   const updated = await prisma.todo.update({ where: { id }, data });
   
   return res.status(200).json(updated);
});

// delete todo
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
   const userId = req.user!.userId;

   const id = Number(req.params.id);
   if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "invalid id" });
   };

   const existing = await prisma.todo.findUnique({ where: { id } });
   if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "not found" });
   };

   await prisma.todo.delete({ where: { id } });

   return res.status(204).end();
});

export default router;