import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        dueDate: dueDate ? new Date(`${dueDate}T00:00:00`) : null,
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
    const { page = "1", limit = "10", search = "", status, date, startDate, endDate } = req.query;

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
    if (status !== undefined && status !== "all") {
      where.completed = status === "true";
    }

    // filter by specific date (12:00 AM to 11:59 PM local time)
    if (date) {
      const startOfDay = new Date(`${date}T00:00:00`);
      const endOfDay = new Date(`${date}T23:59:59.999`);

      where.dueDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    // filter by date range (12:00 AM to 11:59 PM local time)
    if (startDate && endDate) {
      const start = new Date(`${startDate}T00:00:00`);
      const end = new Date(`${endDate}T23:59:59.999`);

      where.dueDate = {
        gte: start,
        lte: end,
      };
    }

    // get tasks
    const tasks = await prisma.task.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: {
        dueDate: "asc",
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
    const { title, dueDate } = req.body;

    const task = await prisma.task.findUnique({
  where: {
  id: id as string
}
    });

    // check task exists + belongs to user
    if (!task || task.userId !== req.userId) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (dueDate) updateData.dueDate = new Date(`${dueDate}T00:00:00`);

    const updatedTask = await prisma.task.update({
    where: {
  id: id as string
},
      data: updateData,
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

export const getTasksByMonth = async (req: AuthRequest, res: Response) => {
  try {
    const { year, month, status } = req.query;

    if (!year || !month) {
      return res.status(400).json({ message: "Year and month are required" });
    }

    const yearNum = parseInt(year as string);
    const monthNum = parseInt(month as string) - 1; // JavaScript months are 0-indexed

    // First day of the month
    const startOfMonth = new Date(yearNum, monthNum, 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Last day of the month
    const endOfMonth = new Date(yearNum, monthNum + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const where: any = {
      userId: req.userId,
      dueDate: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    };

    // filter by status
    if (status !== undefined) {
      where.completed = status === "true";
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: {
        dueDate: "asc",
      },
    });

    res.json({
      success: true,
      data: tasks,
      month: monthNum + 1,
      year: yearNum,
    });
  } catch (error) {
    console.error("Get Tasks By Month Error:", error);
    res.status(500).json({ message: "Error fetching tasks by month" });
  }
};