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
          pageNumber: 20,
          navigationPageNumber: 29
        },
        {
          id: 'our-school',
          title: 'Our school',
          pageNumber: 35,
          navigationPageNumber: 44
        },
        {
          id: 'my-food-bag',
          title: 'My food bag',
          pageNumber: 51
        },
        {
          id: 'animal-friends',
          title: 'Animal friends',
          pageNumber: 17,
          navigationPageNumber: 26
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
          image: require('@/data/grade_3_english_book/grade_3_english_book_page_19/grade_3_english_book.pdf_page_19.png'),
          blocks: [
            {
              id: 2,
              text: "Listen and say.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_19/block_19_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Grade 3",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_19/block_19_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Grade 4",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_19/block_19_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Grade 5",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_19/block_19_5_audio.mp3'),
            },
            {
              id: 6,
              text: "Grade 6",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_19/block_19_6_audio.mp3'),
            },
            {
              id: 7,
              text: "I'm in grade five.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_19/block_19_7_audio.mp3'),
            },
            {
              id: 8,
              text: "I'm in grade six.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_19/block_19_8_audio.mp3'),
            },
            {
              id: 9,
              text: "I'm in grade three. I'm in grade four.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_19/block_19_9_audio.mp3'),
            },
            {
              id: 10,
              text: "What grade are you in?",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_19/block_19_10_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 21,
          image: require('@/data/grade_3_english_book/grade_3_english_book_page_21/grade_3_english_book.pdf_page_21.png'),
          blocks: [
            {
              id: 2,
              text: "12",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_21/block_21_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Play the game. Listen and practise.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_21/block_21_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Stand in a circle. Ask a friend to stand in the middle. Pass the ball. Practise. \"Where do you live?\" \"I live in ............................",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_21/block_21_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Say.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_21/block_21_5_audio.mp3'),
            },
            {
              id: 6,
              text: "Meenu, this is my friend, Rasini.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_21/block_21_6_audio.mp3'),
            },
            {
              id: 7,
              text: "Hello! Rasini.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_21/block_21_7_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 22,
          image: require('@/data/grade_3_english_book/grade_3_english_book_page_22/grade_3_english_book.pdf_page_22.png'),
          blocks: [
            {
              id: 2,
              text: "Sahan, this is my friend, Nizam.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_22/block_22_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Hello! Sahan.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_22/block_22_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Hello! Nizam.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_22/block_22_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Make groups of three. Introduce your friend.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_22/block_22_5_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 23,
          image: require('@/data/grade_3_english_book/grade_3_english_book_page_23/grade_3_english_book.pdf_page_23.png'),
          blocks: [
            {
              id: 2,
              text: "Listen and repeat.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_23/block_23_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Hello! I'm Rashini. What's your name?",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_23/block_23_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Hello! I'm Tharindu.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_23/block_23_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Nice to meet you!",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_23/block_23_5_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 26,
          image: require('@/data/grade_3_english_book/grade_3_english_book_page_26/grade_3_english_book.pdf_page_26.png'),
          blocks: [
            {
              id: 1,
              text: "17 Listen and say.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_26/block_26_1_audio.mp3'),
            },
            {
              id: 2,
              text: "This is my pet. It is a cat.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_26/block_26_2_audio.mp3'),
            },
            {
              id: 4,
              text: "This is my pet. It is a dog.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_26/block_26_4_audio.mp3'),
            },
            {
              id: 5,
              text: "This is my pet. It is a bird.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_26/block_26_5_audio.mp3'),
            },
            {
              id: 7,
              text: "This is my pet. It is a fish.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_26/block_26_7_audio.mp3'),
            },
            {
              id: 8,
              text: "This is my pet. It is a rabbit.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_26/block_26_8_audio.mp3'),
            },
            {
              id: 10,
              text: "What is your pet?",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_26/block_26_10_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 27,
          image: require('@/data/grade_3_english_book/grade_3_english_book_page_27/grade_3_english_book.pdf_page_27.png'),
          blocks: [
            {
              id: 2,
              text: "Sing the song.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_27/block_27_2_audio.mp3'),
            },
            {
              id: 3,
              text: "My pet, my pet. I have a pet.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_27/block_27_3_audio.mp3'),
            },
            {
              id: 4,
              text: "What pet do you have? A cat, a cat. I have a cat.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_27/block_27_4_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 29,
          image: require('@/data/grade_3_english_book/grade_3_english_book_page_29/grade_3_english_book.pdf_page_29.png'),
          blocks: [
            {
              id: 2,
              text: "Listen and say.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_29/block_29_2_audio.mp3'),
            },
            {
              id: 3,
              text: "This is my family.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_29/block_29_3_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 30,
          image: require('@/data/grade_3_english_book/grade_3_english_book_page_30/grade_3_english_book.pdf_page_30.png'),
          blocks: [
            {
              id: 2,
              text: "Listen and say.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_30/block_30_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Where do you live?",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_30/block_30_3_audio.mp3'),
            },
            {
              id: 4,
              text: "I live in Colombo.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_30/block_30_4_audio.mp3'),
            },
            {
              id: 6,
              text: "I live in Kandy.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_30/block_30_6_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 31,
          image: require('@/data/grade_3_english_book/grade_3_english_book_page_31/grade_3_english_book.pdf_page_31.png'),
          blocks: [
            {
              id: 2,
              text: "Listen and say.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_31/block_31_2_audio.mp3'),
            },
            {
              id: 3,
              text: "This is a house.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_31/block_31_3_audio.mp3'),
            },
            {
              id: 4,
              text: "This is a school.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_31/block_31_4_audio.mp3'),
            },
            {
              id: 7,
              text: "This is a shop.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_31/block_31_7_audio.mp3'),
            },
            {
              id: 10,
              text: "This is a hospital.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_31/block_31_10_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 44,
          image: require('@/data/grade_3_english_book/grade_3_english_book_page_44/grade_3_english_book.pdf_page_44.png'),
          blocks: [
            {
              id: 2,
              text: "Hi, I'm Raveen. This is my school.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_44/block_44_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Listen and say.",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_44/block_44_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Our school 3",
              audio: require('@/data/grade_3_english_book/grade_3_english_book_page_44/block_44_4_audio.mp3'),
            },
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Grade 4 English Book',
      author: 'Ministry of Education',
      backgroundColor: '#7ED321',
      hasData: true,
      tableOfContents: [
        {
          id: 'good-practices',
          title: 'Good practices',
          pageNumber: 98
        },
        {
          id: 'environment',
          title: 'Environment',
          pageNumber: 100
        },
        {
          id: 'activities',
          title: 'Activities',
          pageNumber: 105
        }
      ],
      pages: [
        {
          pageNumber: 98,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_98/english PB G-4.pdf_page_98.png'),
          blocks: [
            {
              id: 1,
              text: "For free distribution 89",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_98/block_98_1_audio.mp3'),
            },
            {
              id: 2,
              text: "9 Good practices",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_98/block_98_2_audio.mp3'),
            },
            {
              id: 4,
              text: "Listen and say.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_98/block_98_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Do not throw litter on the ground.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_98/block_98_5_audio.mp3'),
            },
            {
              id: 6,
              text: "Do not pluck leaves.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_98/block_98_6_audio.mp3'),
            },
            {
              id: 7,
              text: "Do not waste water.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_98/block_98_7_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 99,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_99/english PB G-4.pdf_page_99.png'),
          blocks: [
            {
              id: 1,
              text: "Excuse me May I... Please Thank you You're welcome",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_99/block_99_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Lesson 2",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_99/block_99_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Act out.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_99/block_99_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Rasini : Excuse me teacher, may I come in? Teacher : Yes, you may.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_99/block_99_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Waruni : Please give me your pen. Meena : Here you are. Waruni : Thank you. Meena : You're welcome.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_99/block_99_5_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 100,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_100/english PB G-4.pdf_page_100.png'),
          blocks: [
            {
              id: 1,
              text: "How are you? I'm fine. I'm very well. I'm great.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_100/block_100_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Sonia : How are you, Kumar? Kumar : I'm fine. Thank you. How about you? Sonia : I'm very well. Thank you.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_100/block_100_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Teacher : How are you all today? Children: We're fine. Thank you. How are you teacher? Teacher : I'm great. Thank you.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_100/block_100_3_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 101,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_101/english PB G-4.pdf_page_101.png'),
          blocks: [
            {
              id: 1,
              text: "Lesson 3",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_101/block_101_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Read and match.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_101/block_101_2_audio.mp3'),
            },
            {
              id: 3,
              text: "This is our school bus. Let's protect it.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_101/block_101_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Trees are useful.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_101/block_101_4_audio.mp3'),
            },
            {
              id: 5,
              text: "This is our school wall. Let's keep it clean.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_101/block_101_5_audio.mp3'),
            },
            {
              id: 6,
              text: "We dump garbage into the bin.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_101/block_101_6_audio.mp3'),
            },
            {
              id: 7,
              text: "The road is busy. Let's follow the road rules.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_101/block_101_7_audio.mp3'),
            },
            {
              id: 8,
              text: "They help us. Let's say thank you.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_101/block_101_8_audio.mp3'),
            },
            {
              id: 9,
              text: "Let's wait for our turn.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_101/block_101_9_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 102,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_102/english PB G-4.pdf_page_102.png'),
          blocks: [
            {
              id: 1,
              text: "Lesson 4",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_102/block_102_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Read the good practices.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_102/block_102_2_audio.mp3'),
            },
            {
              id: 3,
              text: "How many do you practise?",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_102/block_102_3_audio.mp3'),
            },
            {
              id: 4,
              text: "We have a good sleep.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_102/block_102_4_audio.mp3'),
            },
            {
              id: 5,
              text: "We brush our teeth everyday. We get up early.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_102/block_102_5_audio.mp3'),
            },
            {
              id: 6,
              text: "We take dinner together. We eat healthy food. We wash our hands before meals.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_102/block_102_6_audio.mp3'),
            },
            {
              id: 7,
              text: "We drink boiled water. We are kind to animals.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_102/block_102_7_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 103,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_103/english PB G-4.pdf_page_103.png'),
          blocks: [
            {
              id: 1,
              text: "Lesson 5",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_103/block_103_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Let's sing.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_103/block_103_2_audio.mp3'),
            },
            {
              id: 5,
              text: "Brush your teeth up and down. Brush your teeth round and round. Brush your teeth from left to right. Brush your teeth in the morning and night. Brush, brush, brush, brush, brush, brush, Brush your teeth in the morning and night.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_103/block_103_5_audio.mp3'),
            },
            {
              id: 7,
              text: "Brush your teeth to keep them white. Brush your teeth so that your smile is bright. Brush your teeth it's so much fun. Brush your teeth when you start the day. Brush, brush, brush, brush, brush, brush, Brush your teeth when you start the day.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_103/block_103_7_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 104,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_104/english PB G-4.pdf_page_104.png'),
          blocks: [
            {
              id: 3,
              text: "Brush your teeth just open and wide. Brush your teeth from side to side. Brush your teeth you sleepyhead. Brush your teeth before you go to bed. Brush, brush, brush, brush, brush, brush, Brush your teeth before you go to bed.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_104/block_104_3_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 105,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_105/english PB G-4.pdf_page_105.png'),
          blocks: [
            {
              id: 1,
              text: "Lesson 6",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_105/block_105_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Read aloud.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_105/block_105_2_audio.mp3'),
            },
            {
              id: 4,
              text: "fresh fruits",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_105/block_105_4_audio.mp3'),
            },
            {
              id: 5,
              text: "green leaves",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_105/block_105_5_audio.mp3'),
            },
            {
              id: 6,
              text: "fresh vegetables",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_105/block_105_6_audio.mp3'),
            },
            {
              id: 7,
              text: "cereal",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_105/block_105_7_audio.mp3'),
            },
            {
              id: 8,
              text: "Let's eat …",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_105/block_105_8_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 106,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_106/english PB G-4.pdf_page_106.png'),
          blocks: [
            {
              id: 1,
              text: "What are the types of food you eat?",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_106/block_106_1_audio.mp3'),
            },
            {
              id: 2,
              text: "I eat ...................... I don't eat ..................",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_106/block_106_2_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 107,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_107/english PB G-4.pdf_page_107.png'),
          blocks: [
            {
              id: 1,
              text: "Lesson 7",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_107/block_107_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Read aloud.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_107/block_107_2_audio.mp3'),
            },
            {
              id: 4,
              text: "Trees give us vegetables.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_107/block_107_4_audio.mp3'),
            },
            {
              id: 6,
              text: "Trees give us medicine.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_107/block_107_6_audio.mp3'),
            },
            {
              id: 8,
              text: "Trees give us shade.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_107/block_107_8_audio.mp3'),
            },
            {
              id: 9,
              text: "Trees give us cool air.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_107/block_107_9_audio.mp3'),
            },
            {
              id: 12,
              text: "Trees give us beautiful flowers.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_107/block_107_12_audio.mp3'),
            },
            {
              id: 14,
              text: "Trees give us fruits.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_107/block_107_14_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 108,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_108/english PB G-4.pdf_page_108.png'),
          blocks: [
            {
              id: 1,
              text: "Read aloud.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_1_audio.mp3'),
            },
            {
              id: 2,
              text: "We need trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_2_audio.mp3'),
            },
            {
              id: 3,
              text: "We love nature too.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_3_audio.mp3'),
            },
            {
              id: 4,
              text: "We love trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Let's protect trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_5_audio.mp3'),
            },
            {
              id: 6,
              text: "Let's plant trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_6_audio.mp3'),
            },
            {
              id: 7,
              text: "Trees are useful.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_7_audio.mp3'),
            },
            {
              id: 8,
              text: "We need trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_8_audio.mp3'),
            },
            {
              id: 9,
              text: "Let's protect trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_9_audio.mp3'),
            },
            {
              id: 10,
              text: "Let's plant trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_10_audio.mp3'),
            },
            {
              id: 11,
              text: "Trees are useful.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_11_audio.mp3'),
            },
            {
              id: 12,
              text: "We need trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_12_audio.mp3'),
            },
            {
              id: 13,
              text: "Let's protect trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_13_audio.mp3'),
            },
            {
              id: 14,
              text: "Let's plant trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_14_audio.mp3'),
            },
            {
              id: 15,
              text: "Trees are useful.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_15_audio.mp3'),
            },
            {
              id: 16,
              text: "We need trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_16_audio.mp3'),
            },
            {
              id: 17,
              text: "Let's protect trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_17_audio.mp3'),
            },
            {
              id: 18,
              text: "Let's plant trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_18_audio.mp3'),
            },
            {
              id: 19,
              text: "Trees are useful.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_19_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 109,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_109/english PB G-4.pdf_page_109.png'),
          blocks: [
            {
              id: 1,
              text: "Lesson 8",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_109/block_109_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Let's play hopscotch.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_109/block_109_2_audio.mp3'),
            },
            {
              id: 3,
              text: "We need trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_109/block_109_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Let's protect trees. Let's plant trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_109/block_109_4_audio.mp3'),
            },
            {
              id: 5,
              text: "We love nature.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_109/block_109_5_audio.mp3'),
            },
            {
              id: 6,
              text: "We love nature.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_109/block_109_6_audio.mp3'),
            },
            {
              id: 7,
              text: "Trees are useful.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_109/block_109_7_audio.mp3'),
            },
            {
              id: 8,
              text: "Trees are beautiful. Trees are our friends.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_109/block_109_8_audio.mp3'),
            },
          ]
        }
      ]
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
