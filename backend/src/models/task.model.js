import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 30,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    taskType: {
      type: String,
      enum: {
        values: ["personal", "collaborative"],
        message: "Invalid role",
      },
      default: "personal",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "in_progress", "completed"],
        message: "Invalid status",
      },
      default: "pending",
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Invalid priority",
      },
      default: "medium",
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
      index: true,
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    subtasksCount: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

//--- CUSTOMIZE JSON OUTPUT ---//
taskSchema.methods.toJSON = function () {
  const task = this.toObject();
  delete task.__v;
  return task;
}


export const Task = mongoose.model("Task", taskSchema);
