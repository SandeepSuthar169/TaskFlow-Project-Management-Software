import mongoose from "mongoose";

const subTodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false
  },
  subtasks: [] 
}, { _id: true });

// Main To-Do schema
const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false
  },

  subtasks: [subTodoSchema] ,

}, {
  timestamps: true
});

TodoSchema.index(
  {
    parentId: 1,
    rootId: 1
   }
)


export const  Todo = mongoose.model("Todo", TodoSchema);

