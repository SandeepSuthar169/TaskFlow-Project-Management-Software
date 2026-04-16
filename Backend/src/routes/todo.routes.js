import express from "express";
import {
  createTodo,
  getAllTodos,
  updateTodo,
  deleteTodo,
  createSubtask,
  updateSubTask,
  deleteSubtask
} from "../controllers/todo.controllers.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"
const router = express.Router();

router.post  ("/todos"    , verifyJWT, createTodo );
router.get   ("/todos"    , verifyJWT, getAllTodos);
router.put   ("/todos/:id", verifyJWT, updateTodo );
router.delete("/todos/:id", verifyJWT, deleteTodo );


router.post  ("/todos/:todoId/subtask"           , verifyJWT, createSubtask)
router.post  ("/todos/:todoId/subtask/:parentId" , verifyJWT, createSubtask)

router.put   ("/todos/:todoId/subtask/:subtaskId", verifyJWT, updateSubTask)
router.delete("/todos/:todoId/subtask/:subtaskId", verifyJWT, deleteSubtask)


export default router;