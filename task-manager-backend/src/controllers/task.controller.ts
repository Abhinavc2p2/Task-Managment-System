import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        userId: req.userId!,
      },
    });

    res.status(201).json({
      message: "Task created",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
};


export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { page = "1", limit = "10", search = "", status } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    const skip = (pageNumber - 1) * limitNumber;

    // build filter
    const where: any = {
      userId: req.userId,
    };

    // search by title
    if (search) {
      where.title = {
        contains: search as string,
        mode: "insensitive",
      };
    }

    // filter by status
    if (status !== undefined) {
      where.completed = status === "true";
    }

    // get tasks
    const tasks = await prisma.task.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: {
        createdAt: "desc",
      },
    });

    // total count (for pagination)
    const total = await prisma.task.count({ where });

    res.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
      },
    });
  } catch (error) {
    console.error("Get Tasks Error:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const task = await prisma.task.findUnique({
  where: {
  id: id as string
}
    });

    // check task exists + belongs to user
    if (!task || task.userId !== req.userId) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
    where: {
  id: id as string
},
      data: {
        title,
      },
    });

    res.json({
      message: "Task updated",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
    where: {
  id: id as string
}
    });

    if (!task || task.userId !== req.userId) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.task.delete({
     where: {
  id: id as string
}
    });

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
};

export const toggleTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
       where: {
  id: id as string
}
    });

    if (!task || task.userId !== req.userId) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
        where: {
  id: id as string
},
      data: {
        completed: !task.completed,
      },
    });

    res.json({
      message: "Task status updated",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling task" });
  }
};