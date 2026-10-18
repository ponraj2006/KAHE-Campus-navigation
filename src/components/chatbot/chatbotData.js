/**
 * chatbotData.js - starting content for the chatbot.
 * QUICK_PILLS: questions shown as buttons at the top (array of strings)
 * INITIAL_MESSAGES: the first message(s) in every new chat
 */

export const QUICK_PILLS = [
  'Where is the library?',
  'Where is the admissions office?',
  'Where is room 207?',
  'Who is the HOD of computer science?'
];

export const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text:
      "Hello! I'm the KAHE Assistant. Ask me where a room, block or department is. " +
      'You can type a room number like S207, or just 207 and I will ask which block.',
    details: [],
    actions: [],
    time: ''
  }
];
