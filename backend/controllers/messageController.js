const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/messages
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, bookingId } = req.body;

    const message = await Message.create({
      senderId: req.user._id,
      receiverId,
      content,
      bookingId
    });

    await message.populate('senderId', 'name avatar');
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get conversation between two users
// @route   GET /api/messages/:otherUserId
exports.getConversation = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: req.params.otherUserId },
        { senderId: req.params.otherUserId, receiverId: req.user._id }
      ]
    })
      .populate('senderId', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { senderId: req.params.otherUserId, receiverId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations (unique users)
// @route   GET /api/messages
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get last message from each conversation
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', userId] },
              '$receiverId',
              '$senderId'
            ]
          },
          lastMessage: { $first: '$content' },
          lastMessageDate: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiverId', userId] }, { $eq: ['$isRead', false] }] },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { lastMessageDate: -1 } }
    ]);

    // Populate user info
    const populatedConversations = await User.populate(conversations, {
      path: '_id',
      select: 'name avatar email role'
    });

    res.json(populatedConversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
