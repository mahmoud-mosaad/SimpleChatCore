const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    thread_ids: {
      type: [String],
      required: true,
    },
    // threads: [
    //   { 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'Thread' 
    //   }
    // ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
