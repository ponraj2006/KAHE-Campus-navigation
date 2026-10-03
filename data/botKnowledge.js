
export const QUICK_PILLS = [
  'Admission Enquiry',
  'Academic Calendar',
  'Student Login',
  'Apply for Programs',
  'Program Details',
  'Campus Navigation'
];

// Initial chatbot message
export const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: 'Hi! I am the KAHE Assistant. How can I help you today?',
    time: 'Just now'
  }
];

/**
 * Check whether a query contains any keyword from a list.
 */
const containsKeyword = (query, keywords) => {
  return keywords.some((keyword) => query.includes(keyword));
};

/**
 * Generate chatbot response based on user query.
 */
export const getSmartBotResponse = (userQuery) => {
  const query = userQuery.toLowerCase().trim();

  // Empty message
  if (!query) {
    return {
      text: 'Please enter your question. I will be happy to help you.',
      details: []
    };
  }

  // --------------------------------------------------
  // 1. CAMPUS NAVIGATION
  // --------------------------------------------------
  if (
    containsKeyword(query, [
      'where is',
      'how to reach',
      'how can i reach',
      'location of',
      'navigate',
      'navigation',
      'direction',
      'route',
      'block',
      'building',
      'department',
      'library',
      'canteen',
      'hostel',
      'lab',
      'office'
    ])
  ) {
    return {
      text: 'Sure! I can help you find a location on the KAHE campus.',
      details: [
        'Tell me the place or building you want to find.',
        'For example: "Where is S Block?"',
        'You can also ask: "How do I reach the library?"'
      ],
      actions: [
        {
          label: 'Open Campus Map',
          link: '#campus-map'
        }
      ],
      intent: 'campus_navigation'
    };
  }

  // --------------------------------------------------
  // 2. ADMISSION
  // --------------------------------------------------
  if (
    containsKeyword(query, [
      'admission',
      'apply',
      'application',
      'eligibility',
      'join',
      'joining',
      'admission process'
    ])
  ) {
    return {
      text: 'I can help you with KAHE admission information.',
      details: [
        'UG admission is generally based on qualifying examination requirements.',
        'PG admission requires a relevant undergraduate qualification.',
        'For the current admission year, please verify the latest eligibility and application requirements with KAHE.'
      ],
      actions: [
        {
          label: 'Apply Online',
          link: '#apply'
        },
        {
          label: 'Admission Details',
          link: '#admission'
        }
      ],
      intent: 'admission'
    };
  }

  // --------------------------------------------------
  // 3. ACADEMIC CALENDAR / EXAM
  // --------------------------------------------------
  if (
    containsKeyword(query, [
      'calendar',
      'academic calendar',
      'exam',
      'examination',
      'cia',
      'internal exam',
      'semester',
      'exam date',
      'exam schedule'
    ])
  ) {
    return {
      text: 'I can help you find academic and examination information.',
      details: [
        'Check the official academic calendar for semester dates.',
        'Examination schedules and CIA dates may vary by program and semester.',
        'Please use the latest university/college academic calendar for current dates.'
      ],
      actions: [
        {
          label: 'Academic Calendar',
          link: '#academic-calendar'
        },
        {
          label: 'Exam Schedule',
          link: '#exam-schedule'
        }
      ],
      intent: 'academic_calendar'
    };
  }

  // --------------------------------------------------
  // 4. STUDENT LOGIN / CAMU
  // --------------------------------------------------
  if (
    containsKeyword(query, [
      'login',
      'student login',
      'student portal',
      'portal',
      'camu',
      'attendance',
      'marks',
      'result',
      'fees'
    ])
  ) {
    return {
      text: 'You can access student services through the KAHE student/ERP portal.',
      details: [
        'Check attendance and academic information.',
        'View marks and examination information.',
        'Check fee-related information and other student services.'
      ],
      actions: [
        {
          label: 'Open MyCAMU',
          link: 'https://www.mycamu.co.in'
        },
        {
          label: 'Reset Password',
          link: '#reset-password'
        }
      ],
      intent: 'student_portal'
    };
  }

  // --------------------------------------------------
  // 5. PROGRAMS / COURSES
  // --------------------------------------------------
  if (
    containsKeyword(query, [
      'program',
      'programs',
      'course',
      'courses',
      'degree',
      'b.tech',
      'bca',
      'b.sc',
      'mca',
      'm.sc',
      'engineering',
      'computer science'
    ])
  ) {
    return {
      text: 'KAHE offers programs across multiple academic disciplines.',
      details: [
        'Engineering and Technology',
        'Computer Science and Applications',
        'Arts and Science',
        'Commerce and Management',
        'Pharmacy and other disciplines'
      ],
      actions: [
        {
          label: 'Engineering & Technology',
          link: '#engineering'
        },
        {
          label: 'Arts & Science',
          link: '#arts-science'
        },
        {
          label: 'Computer Science',
          link: '#computer-science'
        }
      ],
      intent: 'program_details'
    };
  }

  // --------------------------------------------------
  // 6. HOSTEL / FACILITIES
  // --------------------------------------------------
  if (
    containsKeyword(query, [
      'hostel',
      'accommodation',
      'room',
      'facility',
      'facilities',
      'wifi',
      'canteen',
      'gym',
      'medical'
    ])
  ) {
    return {
      text: 'I can provide information about KAHE campus facilities and accommodation.',
      details: [
        'Hostel facilities are available for students.',
        'Campus facilities may include dining, Wi-Fi, recreation and student support services.',
        'Availability and specific facilities may vary.'
      ],
      actions: [
        {
          label: 'Hostel Information',
          link: '#hostel'
        },
        {
          label: 'Campus Facilities',
          link: '#facilities'
        }
      ],
      intent: 'campus_facilities'
    };
  }

  // --------------------------------------------------
  // 7. SCHOLARSHIP / FEES
  // --------------------------------------------------
  if (
    containsKeyword(query, [
      'scholarship',
      'scholarships',
      'fee',
      'fees',
      'concession',
      'financial aid',
      'discount'
    ])
  ) {
    return {
      text: 'I can help you find information about fees and scholarships.',
      details: [
        'Scholarship eligibility depends on the applicable scholarship scheme.',
        'Fee structures can vary by program and academic year.',
        'Please check the latest official fee and scholarship information before applying.'
      ],
      actions: [
        {
          label: 'Fee Details',
          link: '#fees'
        },
        {
          label: 'Scholarship Details',
          link: '#scholarship'
        }
      ],
      intent: 'fees_scholarship'
    };
  }

  // --------------------------------------------------
  // 8. CONTACT / HELP DESK
  // --------------------------------------------------
  if (
    containsKeyword(query, [
      'contact',
      'phone',
      'telephone',
      'email',
      'help desk',
      'helpdesk',
      'office'
    ])
  ) {
    return {
      text: 'You can contact the KAHE help desk for official information and assistance.',
      details: [
        'Phone: 1800-843-2828',
        'Email: info@kahedu.edu.in',
        'For the latest contact details, please verify them through the official KAHE website.'
      ],
      actions: [
        {
          label: 'Contact KAHE',
          link: '#contact'
        }
      ],
      intent: 'contact'
    };
  }

  // --------------------------------------------------
  // 9. GREETING
  // --------------------------------------------------
  if (
    containsKeyword(query, [
      'hi',
      'hello',
      'hey',
      'good morning',
      'good afternoon',
      'good evening'
    ])
  ) {
    return {
      text: 'Hello! 👋 I am the KAHE Assistant. How can I help you?',
      details: [
        'You can ask about admissions, programs, exams, student login, fees, scholarships or campus navigation.'
      ],
      intent: 'greeting'
    };
  }

  // --------------------------------------------------
  // 10. FALLBACK
  // --------------------------------------------------
  return {
    text: `I understand that you are asking about "${userQuery}". However, I don't have enough information to answer that accurately.`,
    details: [
      'Try asking about admission or eligibility.',
      'Ask about programs or courses.',
      'Ask about student login or CAMU.',
      'Ask about fees or scholarships.',
      'Ask where a campus building or department is located.'
    ],
    actions: [
      {
        label: 'Contact Help Desk',
        link: '#contact'
      }
    ],
    intent: 'unknown'
  };
};

