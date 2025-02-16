import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  messages: [
    {
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
