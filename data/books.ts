import { Book } from '@/types/book';

export const getAllBooks = (): Book[] => {
  return [
    {
      id: 1,
      title: 'Grade 3 English Book',
      author: 'Ministry of Education',
      backgroundColor: '#4A90E2',
      hasData: true,
      tableOfContents: [
        {
          id: 'myself',
          title: 'Myself',
          pageNumber: 1
        },
        {
          id: 'my-home',
          title: 'My home',
          pageNumber: 21
        },
        {
          id: 'our-school',
          title: 'Our school',
          pageNumber: 44
        },
        {
          id: 'my-food-bag',
          title: 'My food bag',
          pageNumber: 51
        },
        {
          id: 'animal-friends',
          title: 'Animal friends',
          pageNumber: 67
        },
        {
          id: 'clothes-we-wear',
          title: 'Clothes we wear',
          pageNumber: 85
        },
        {
          id: 'playing-is-fun',
          title: 'Playing is fun',
          pageNumber: 94
        },
        {
          id: 'world-around-me',
          title: 'World around me',
          pageNumber: 111
        }
      ],
      pages: [
        {
          pageNumber: 19,
          image: require('@/data/grade_3_english_book_page_19/grade_3_english_book.pdf_page_19.png'),
          blocks: [
            {
              id: 2,
              text: "Listen and say.",
              audio: require('@/data/grade_3_english_book_page_19/block_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Grade 3",
              audio: require('@/data/grade_3_english_book_page_19/block_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Grade 4",
              audio: require('@/data/grade_3_english_book_page_19/block_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Grade 5",
              audio: require('@/data/grade_3_english_book_page_19/block_5_audio.mp3'),
            },
            {
              id: 6,
              text: "Grade 6",
              audio: require('@/data/grade_3_english_book_page_19/block_6_audio.mp3'),
            },
            {
              id: 7,
              text: "I'm in grade f ive.",
              audio: require('@/data/grade_3_english_book_page_19/block_7_audio.mp3'),
            },
            {
              id: 8,
              text: "I'm in grade six.",
              audio: require('@/data/grade_3_english_book_page_19/block_8_audio.mp3'),
            },
            {
              id: 9,
              text: "I'm in grade three. I'm in grade four.",
              audio: require('@/data/grade_3_english_book_page_19/block_9_audio.mp3'),
            },
            {
              id: 10,
              text: "What grade are you in?",
              audio: require('@/data/grade_3_english_book_page_19/block_10_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 21,
          image: require('@/data/grade_3_english_book_page_21/grade_3_english_book.pdf_page_21.png'),
          blocks: [
            {
              id: 2,
              text: "12",
              audio: require('@/data/grade_3_english_book_page_21/block_21_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Play the game. Listen and practise.",
              audio: require('@/data/grade_3_english_book_page_21/block_21_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Stand in a circle. Ask a friend to stand in the middle. Pass the ball. Practise. \"Where do you live?\" \"I live in ............................",
              audio: require('@/data/grade_3_english_book_page_21/block_21_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Say.",
              audio: require('@/data/grade_3_english_book_page_21/block_21_5_audio.mp3'),
            },
            {
              id: 6,
              text: "Meenu, this is my friend, Rasini.",
              audio: require('@/data/grade_3_english_book_page_21/block_21_6_audio.mp3'),
            },
            {
              id: 7,
              text: "Hello! Rasini.",
              audio: require('@/data/grade_3_english_book_page_21/block_21_7_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 22,
          image: require('@/data/grade_3_english_book_page_22/grade_3_english_book.pdf_page_22.png'),
          blocks: [
            {
              id: 2,
              text: "Sahan, this is my friend, Nizam.",
              audio: require('@/data/grade_3_english_book_page_22/block_22_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Hello! Sahan.",
              audio: require('@/data/grade_3_english_book_page_22/block_22_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Hello! Nizam.",
              audio: require('@/data/grade_3_english_book_page_22/block_22_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Make groups of three. Introduce your friend.",
              audio: require('@/data/grade_3_english_book_page_22/block_22_5_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 23,
          image: require('@/data/grade_3_english_book_page_23/grade_3_english_book.pdf_page_23.png'),
          blocks: [
            {
              id: 2,
              text: "Listen and repeat.",
              audio: require('@/data/grade_3_english_book_page_23/block_23_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Hello! I'm Rashini. What's your name?",
              audio: require('@/data/grade_3_english_book_page_23/block_23_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Hello! I'm Tharindu.",
              audio: require('@/data/grade_3_english_book_page_23/block_23_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Nice to meet you!",
              audio: require('@/data/grade_3_english_book_page_23/block_23_5_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 26,
          image: require('@/data/grade_3_english_book_page_26/grade_3_english_book.pdf_page_26.png'),
          blocks: [
            {
              id: 1,
              text: "17 Listen and say.",
              audio: require('@/data/grade_3_english_book_page_26/block_26_1_audio.mp3'),
            },
            {
              id: 2,
              text: "This is my pet. It is a cat.",
              audio: require('@/data/grade_3_english_book_page_26/block_26_2_audio.mp3'),
            },
            {
              id: 4,
              text: "This is my pet. It is a dog.",
              audio: require('@/data/grade_3_english_book_page_26/block_26_4_audio.mp3'),
            },
            {
              id: 5,
              text: "This is my pet. It is a bird.",
              audio: require('@/data/grade_3_english_book_page_26/block_26_5_audio.mp3'),
            },
            {
              id: 7,
              text: "This is my pet. It is a fish.",
              audio: require('@/data/grade_3_english_book_page_26/block_26_7_audio.mp3'),
            },
            {
              id: 8,
              text: "This is my pet. It is a rabbit.",
              audio: require('@/data/grade_3_english_book_page_26/block_26_8_audio.mp3'),
            },
            {
              id: 10,
              text: "What is your pet?",
              audio: require('@/data/grade_3_english_book_page_26/block_26_10_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 27,
          image: require('@/data/grade_3_english_book_page_27/grade_3_english_book.pdf_page_27.png'),
          blocks: [
            {
              id: 2,
              text: "Sing the song.",
              audio: require('@/data/grade_3_english_book_page_27/block_27_2_audio.mp3'),
            },
            {
              id: 3,
              text: "My pet, my pet. I have a pet.",
              audio: require('@/data/grade_3_english_book_page_27/block_27_3_audio.mp3'),
            },
            {
              id: 4,
              text: "What pet do you have? A cat, a cat. I have a cat.",
              audio: require('@/data/grade_3_english_book_page_27/block_27_4_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 29,
          image: require('@/data/grade_3_english_book_page_29/grade_3_english_book.pdf_page_29.png'),
          blocks: [
            {
              id: 2,
              text: "Listen and say.",
              audio: require('@/data/grade_3_english_book_page_29/block_29_2_audio.mp3'),
            },
            {
              id: 3,
              text: "This is my family.",
              audio: require('@/data/grade_3_english_book_page_29/block_29_3_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 30,
          image: require('@/data/grade_3_english_book_page_30/grade_3_english_book.pdf_page_30.png'),
          blocks: [
            {
              id: 2,
              text: "Listen and say.",
              audio: require('@/data/grade_3_english_book_page_30/block_30_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Where do you live?",
              audio: require('@/data/grade_3_english_book_page_30/block_30_3_audio.mp3'),
            },
            {
              id: 4,
              text: "I live in Colombo.",
              audio: require('@/data/grade_3_english_book_page_30/block_30_4_audio.mp3'),
            },
            {
              id: 6,
              text: "I live in Kandy.",
              audio: require('@/data/grade_3_english_book_page_30/block_30_6_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 31,
          image: require('@/data/grade_3_english_book_page_31/grade_3_english_book.pdf_page_31.png'),
          blocks: [
            {
              id: 2,
              text: "Listen and say.",
              audio: require('@/data/grade_3_english_book_page_31/block_31_2_audio.mp3'),
            },
            {
              id: 3,
              text: "This is a house.",
              audio: require('@/data/grade_3_english_book_page_31/block_31_3_audio.mp3'),
            },
            {
              id: 4,
              text: "This is a school.",
              audio: require('@/data/grade_3_english_book_page_31/block_31_4_audio.mp3'),
            },
            {
              id: 7,
              text: "This is a shop.",
              audio: require('@/data/grade_3_english_book_page_31/block_31_7_audio.mp3'),
            },
            {
              id: 10,
              text: "This is a hospital.",
              audio: require('@/data/grade_3_english_book_page_31/block_31_10_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 32,
          image: require('@/data/grade_3_english_book_page_32/grade_3_english_book.pdf_page_32.png'),
          blocks: [
            {
              id: 2,
              text: "Listen and say.",
              audio: require('@/data/grade_3_english_book_page_32/block_32_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Where is the school?",
              audio: require('@/data/grade_3_english_book_page_32/block_32_3_audio.mp3'),
            },
            {
              id: 4,
              text: "It is here.",
              audio: require('@/data/grade_3_english_book_page_32/block_32_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Where is the hospital?",
              audio: require('@/data/grade_3_english_book_page_32/block_32_5_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 44,
          image: require('@/data/grade_3_english_book_page_44/grade_3_english_book.pdf_page_44.png'),
          blocks: [
            {
              id: 2,
              text: "Hi, I'm Raveen. This is my school.",
              audio: require('@/data/grade_3_english_book_page_44/block_44_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Listen and say.",
              audio: require('@/data/grade_3_english_book_page_44/block_44_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Our school 3",
              audio: require('@/data/grade_3_english_book_page_44/block_44_4_audio.mp3'),
            },
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'The Adventures of Little Star',
      author: 'Creative Stories',
      backgroundColor: '#7ED321',
      hasData: false,
    },
    {
      id: 3,
      title: 'Rainbow Friends',
      author: 'Fun Learning',
      backgroundColor: '#F5A623',
      hasData: false,
    },
    {
      id: 4,
      title: 'The Brave Little Mouse',
      author: 'Animal Tales',
      backgroundColor: '#D0021B',
      hasData: false,
    },
  ];
};
