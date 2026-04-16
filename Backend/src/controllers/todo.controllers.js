import mongoose from "mongoose";
import  {Todo}  from "../models/Todo.models.js";

export const createTodo = async (req, res) => {
  // try {
    const { title, completed, subtasks } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Todo text is required" });
    }

    const todo = await Todo.create({
      title,
      subtasks: subtasks || [],
      completed: completed || false,
      userId: req.user?._id, 
    });


    res.status(201).json({
      message: "Todo created successfully",
      todo,
    });
  // } catch (error) {
  //   console.error("Error in createTodo:", error);
  //   
  //   res.status(500).json(
  //     { 
  //       message: "Internal server error" 
  //     }
  //   );
  // }
};

export const getAllTodos = async (req, res) => {
  // try {
    const { userId } = req.user?._id
    const todos = await Todo
      .find({ userId })
      .sort({ createAt: -1})

    res.status(200).json({
      success: true,
      data: todos
    })
  
  // } catch (error) {
  //   console.error("Error in getTodos:", error);
  //   res.status(500).json({ 
  //     success: false,
  //     message: "Internal server error", 
  //   });
  // }
};

export const updateTodo = async (req, res) => {
  // try {
    const { id } = req.params;

    const updateTodo = await Todo.findByIdAndUpdate( 
      id,
      req.body,
      {
        new: true,
        runValidators: true
      } 
    )

    if (!updateTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // if (title !== undefined) updateTodo.title = title;
    // if (completed !== undefined) updateTodo.completed = completed;

    await updateTodo.save();

    res.status(200).json({
      message: "Todo updated successfully",
      updateTodo,
    });

  // } catch (error) {
  //   console.error("Error in updateTodo:", error);
  //   res.status(500).json({ message: "Internal server error" });
  // }
};

export const deleteTodo = async (req, res) => {
  // try {
    const { id } = req.params;

    const deleteTodo = await Todo.findByIdAndDelete({
      _id: id,
      userId: req.user._id,
    });

    console.log(id);
    console.log(req.user._id);
    

    // if (!deleteTodo) {
    //   return res.status(404).json({ message: "Todo not found" });
    // }

    res.status(200).json({ message: "Todo deleted successfully" });

  // } catch (error) {
  //   console.error("Error in deleteTodo:", error);
  //   res.status(500).json({ message: "Internal server error" });
  // }
};

// ==================================================================

const addNestedSubtask = (subtasks, parentId, newSubtask) => {
  return subtasks.map(task => {
    if (task._id.toString() === parentId) {
      return {
        ...task.toObject(),
        subtasks: [...task.subtasks, newSubtask]
      };
    }

    if (task.subtasks?.length) {
      return {
        ...task.toObject(),
        subtasks: addNestedSubtask(task.subtasks, parentId, newSubtask)
      };
    }

    return task;
  });
};


export const createSubtask = async (req, res) => {
  // try {
    const { todoId, parentId } = req.params;
    const { title, completed } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }

    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }


    const newSubtask = {
      _id: new mongoose.Types.ObjectId(),
      title,
      completed: completed || false,
      subtasks: []
    };

    // if adding directly to root
    if (!parentId) {
      todo.subtasks.push(newSubtask);

    } else {
      todo.subtasks = addNestedSubtask(
        todo.subtasks,
        parentId,
        newSubtask
      );
    }

    await todo.save();

    res.status(201).json({
      message: "Subtask created",
      data: todo
    });

  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }
};


// ==================================================================





// ==================================================================
const updateNested = (subtasks, subtaskId, data) => {

  for(let task of subtasks){
    if(task._id.toString() === subtaskId){
      if(data.title !== undefined) task.title = data.title 
      if(data.completed !== undefined) task.completed = data.completed 
      
      return true    
    }


    if (task.subtasks && task.subtasks.length > 0) {
      const updated = updateNested(task.subtasks, subtaskId, data)

      if(updated) return true
    }
    
  }
  return false

}

export const updateSubTask = async (req, res) => {
  try {
    const { todoId, subtaskId } = req.params;

    const todo = await Todo.findById(todoId)  // 30 

    if(!todo) return res.status(404).json({message: "Todo not found"})

    const updated = updateNested(todo.subtasks, subtaskId, req.body)

    if(!updated) return res.status(404).json({message: "Subtask not found"})
    
    todo.markModified("subtasks");

    await todo.save();

    res.status(200).json({
      message: "Subtask Updated",
      data: todo
    })
    
  } catch (error) {
      console.log(error);
      res.status(500).json({message: "Internal server error in Update Subtasks"})
  }
}



// ==================================================================

const deleteNestedSubtask = (subtasks, subtaskId) => {
  return subtasks
    .filter((task) => task._id.toString() !== subtaskId)
    .map((task) => {
      if(task.subtasks?.length){
        return {
          ...task.toObject(),
          subtasks: deleteNestedSubtask(task.subtasks, subtaskId)
        }
      }
      return task
    })
}

export const deleteSubtask = async (req, res) => {
  const { todoId, subtaskId } = req.params;

  const todo = await Todo.findById(todoId)

  if(!todo) {
    return res.status(404).json({
      message: "Todo not found"
  })}


  todo.subtasks - deleteNestedSubtask(
    todo.subtasks,
    subtaskId
  )

  await todo.save();

  res.status(200).json({
    message: "subtask delete",
    data: todo
  })
}

