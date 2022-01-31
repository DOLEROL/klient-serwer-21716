const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const toDoSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    todo: {
      type: String,
      lowercase: true,
      required: true,
    },
    state: {
      type: String,
      lowercase: true,
      enum: [
        "todo",
        "done"
      ],
      reguired: true,
    },
  },
  { timestamps: true }
);

const ToDo = mongoose.model("ToDo", toDoSchema);

module.exports = ToDo;
