import express from 'express';
import Chat from '../models/AIChat.js';

const router = express.Router();

// Save a new chat message
router.post('/save-chat', async (req, res) => {
  const { userId, title, messages } = req.body; // Expect title from frontend

  try {
    let chat = await Chat.findOne({ userId, title });

    if (!chat) {
      chat = new Chat({ userId, title, messages, savedAt: new Date() });
    } else {
      // Update existing chat with new messages and timestamp
      chat.messages = messages;
      chat.savedAt = new Date();
    }

    await chat.save();

    res.status(200).json({ message: 'Chat saved successfully!' });
  } catch (error) {
    console.error('Error saving chat:', error);
    res.status(500).json({ message: 'Error saving chat' });
  }
});


// Get chat history for a user
router.get('/get-chat/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const chat = await Chat.findOne({ userId });
  
      // Log the chat to see the structure
      console.log('Chat:', chat);
  
      if (chat) {
        res.status(200).json(chat.messages);  // Return the messages
      } else {
        res.status(404).json({ message: 'No chat history found for this user.' });
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      res.status(500).json({ message: 'Error retrieving chat history' });
    }
  });
  
export default router;
