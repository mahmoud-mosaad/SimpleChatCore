const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ThreadSchema = new Schema(
  {
    name: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    user_ids: {
      type: [String],
      required: true,
    },
    // user_ids: [
    //   { 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'user_ids' 
    //   }
    // ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Thread", ThreadSchema);
