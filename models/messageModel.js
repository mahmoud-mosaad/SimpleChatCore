const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    text: {
      type: String,
    },
    record: {
      type: String,
    },
    attachments: {
      type: String,
    },
    timestamp: {
      type: String,
      required: true,
    },
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'author_id',
      required: true,
    },
    thread_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'thread_id',
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
