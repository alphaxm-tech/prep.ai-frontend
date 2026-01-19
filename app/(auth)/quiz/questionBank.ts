// src/data/questionBank.ts

export type Company = "INFOSYS" | "TCS" | "WIPRO" | "ACCENTURE";

export type QuestionType = any;
//   | "number_series"
//   | "number_theory"
//   | "algebra"
//   | "set_theory"
//   | "logic_puzzle"
//   | "time_distance"
//   | "work_problem"
//   | "ratio_lcm"
//   | "mixture"
//   | "combinatorics"
//   | "counting"
//   | "arithmetic_progression"
//   | "clock"
//   | "physics"
//   | "arrangement"
//   | "bridge_crossing"
//   | "manufacturing_problem"
//   | "graph_logic";

export interface Question {
  id: number;
  company: Company;
  type: QuestionType;
  question: string;
  answer: string | number;
}

export const infosysQuestions: Question[] = [
  {
    id: 1,
    company: "INFOSYS",
    type: "number_series",
    question: "Find the missing number in the series: 2, 5, 10, 17, ?, 41",
    answer: 28,
  },
  {
    id: 2,
    company: "INFOSYS",
    type: "number_series",
    question: "Find the missing number: 8 : 18 :: 24 : ?",
    answer: 38,
  },
  {
    id: 3,
    company: "INFOSYS",
    type: "number_series",
    question: "Find the missing number in the series: 7, 14, 55, 110, ?",
    answer: 121,
  },
  {
    id: 4,
    company: "INFOSYS",
    type: "number_series",
    question: "Find the next number in the series: 2, 4, 7, 10, 15, 18",
    answer: 23,
  },
  {
    id: 5,
    company: "INFOSYS",
    type: "logic_puzzle",
    question:
      "Three people buy kerchiefs for Rs.30, get Rs.5 back, give Rs.2 tip. Where is the missing Rs.1?",
    answer: "There is no missing rupee",
  },
  {
    id: 6,
    company: "INFOSYS",
    type: "logic_puzzle",
    question:
      "How can 45 minutes be measured using two ropes that each burn in 30 minutes?",
    answer: "Light one rope at both ends and the other at one end",
  },
  {
    id: 7,
    company: "INFOSYS",
    type: "combinatorics",
    question:
      "Among 6561 balls, one is heavier. What is the minimum number of weighings required?",
    answer: 8,
  },
  {
    id: 8,
    company: "INFOSYS",
    type: "logic_puzzle",
    question:
      "A mango vendor crosses 30 toll booths with 90 mangoes. How many mangoes remain?",
    answer: 25,
  },
  {
    id: 9,
    company: "INFOSYS",
    type: "number_theory",
    question: "If GOOD = 164 and BAD = 21, what is JUMP?",
    answer: 240,
  },
  {
    id: 10,
    company: "INFOSYS",
    type: "number_theory",
    question: "If HAT = 58, what is KEEP?",
    answer: 74,
  },
  // (remaining Infosys questions can be appended similarly)
];

export const tcsQuestions: Question[] = [
  {
    id: 1,
    company: "TCS",
    type: "number_theory",
    question: "137+276=435, 731+672=?",
    answer: 534,
  },
  {
    id: 2,
    company: "TCS",
    type: "ratio_lcm",
    question: "Ratio 3:4, LCM=180",
    answer: "45 and 60",
  },
  {
    id: 3,
    company: "TCS",
    type: "algebra",
    question: "1/3x is 6 more than 1/6x",
    answer: 36,
  },
  {
    id: 4,
    company: "TCS",
    type: "algebra",
    question: "Money fraction problem",
    answer: 1800,
  },
  {
    id: 5,
    company: "TCS",
    type: "number_theory",
    question: "3-digit number puzzle",
    answer: 863,
  },
  {
    id: 6,
    company: "TCS",
    type: "time_distance",
    question: "Train & taxi distance",
    answer: 261.67,
  },
  {
    id: 7,
    company: "TCS",
    type: "combinatorics",
    question: "304 marbles packets",
    answer: 24,
  },
  {
    id: 8,
    company: "TCS",
    type: "measurement",
    question: "Min weights to weigh 40kg",
    answer: 4,
  },
  {
    id: 9,
    company: "TCS",
    type: "algebra",
    question: "Divide 50 reciprocal sum",
    answer: "20 and 30",
  },
  {
    id: 10,
    company: "TCS",
    type: "work_problem",
    question: "Gift contribution problem",
    answer: "3D/(M²−3M)",
  },
  {
    id: 11,
    company: "TCS",
    type: "counting",
    question: "x+y+z=30 constraints",
    answer: 180,
  },
  {
    id: 12,
    company: "TCS",
    type: "algebra",
    question: "28a+30b+31c=365",
    answer: 12,
  },
  {
    id: 13,
    company: "TCS",
    type: "number_theory",
    question: "Remainder when ÷17",
    answer: 5,
  },
  {
    id: 14,
    company: "TCS",
    type: "modular_arithmetic",
    question: "(3^431×3^301) ÷9",
    answer: 7,
  },
  {
    id: 15,
    company: "TCS",
    type: "modular_arithmetic",
    question: "(6^17+17^6)÷7",
    answer: 0,
  },
  {
    id: 16,
    company: "TCS",
    type: "number_theory",
    question: "46! ÷47 remainder",
    answer: 46,
  },
  {
    id: 17,
    company: "TCS",
    type: "number_theory",
    question: "Sum factorials ÷5",
    answer: 33,
  },
  {
    id: 18,
    company: "TCS",
    type: "number_theory",
    question: "Trailing zeros in 100!",
    answer: 24,
  },
  {
    id: 19,
    company: "TCS",
    type: "number_theory",
    question: "Highest power of 7 in 56!",
    answer: 8,
  },
  {
    id: 20,
    company: "TCS",
    type: "number_theory",
    question: "HCF same remainder",
    answer: 4,
  },
  {
    id: 21,
    company: "TCS",
    type: "number_theory",
    question: "Find n from remainders",
    answer: 7,
  },
  {
    id: 22,
    company: "TCS",
    type: "number_theory",
    question: "Successive division remainder",
    answer: "1,2,0",
  },
  {
    id: 23,
    company: "TCS",
    type: "series",
    question: "Last 3 digits of sum",
    answer: 968,
  },
  {
    id: 24,
    company: "TCS",
    type: "number_theory",
    question: "Zeros in 28!+29!",
    answer: 6,
  },
  {
    id: 25,
    company: "TCS",
    type: "number_series",
    question: "70,54,45,41,?",
    answer: 40,
  },
];

export const wiproQuestions: Question[] = [
  {
    id: 1,
    company: "WIPRO",
    type: "number_series",
    question: "Find the next number in the series: 6, 24, 120, 720, ?",
    answer: 5040,
  },
  {
    id: 2,
    company: "WIPRO",
    type: "number_series",
    question: "Find the next number in the series: 4, 18, 48, 100, 180, ?",
    answer: 294,
  },
  {
    id: 3,
    company: "WIPRO",
    type: "number_series",
    question: "Find the next number in the series: 4, 2, 2, 3, 6, 15, ?",
    answer: 45,
  },
  {
    id: 4,
    company: "WIPRO",
    type: "arithmetic_progression",
    question:
      "Two series are 16, 21, 26… and 17, 21, 25… Find the sum of first 100 common numbers.",
    answer: 10100,
  },
  {
    id: 5,
    company: "WIPRO",
    type: "number_series",
    question: "Find the missing number in the series: 1, 3, 7, 13, 21, 31, ?",
    answer: 43,
  },
  {
    id: 6,
    company: "WIPRO",
    type: "time_distance",
    question:
      "Six bells ring at intervals of 2, 4, 6, 8, 10 and 12 seconds. In 30 minutes, how many times will they ring together?",
    answer: 15,
  },
  {
    id: 7,
    company: "WIPRO",
    type: "word_problem",
    question:
      "A volleyball team drinks 42 liters of water. Girls drink 4L each, boys 7L each, coach drinks 9L. Find number of boys and girls.",
    answer: "3 boys and 2 girls",
  },
  {
    id: 8,
    company: "WIPRO",
    type: "algebra",
    question:
      "Total cost of cats and beans is Rs.360. After losing 2 cats and 0.5 kg beans, cost becomes Rs.340. Find cats and beans.",
    answer: "36 cats and 9 kg beans",
  },
  {
    id: 9,
    company: "WIPRO",
    type: "number_theory",
    question:
      "In how many ways can 840 be written as a product of two numbers?",
    answer: 16,
  },
  {
    id: 10,
    company: "WIPRO",
    type: "algebra",
    question:
      "Square of 2 more than a two-digit number multiplied by 2/5 gives 500. Find the number.",
    answer: 23,
  },
  {
    id: 11,
    company: "WIPRO",
    type: "number_puzzle",
    question:
      "Two-thirds of a two-digit number equals another number with tens digit 3 less and units digit 1 more. Find the quotient when 261 is divided by the units digit.",
    answer: 37,
  },
  {
    id: 12,
    company: "WIPRO",
    type: "number_puzzle",
    question:
      "A two-digit number has units digit one more than 4 times the tens digit. The difference between the number and its reverse is 36. Find the number.",
    answer: 15,
  },
  {
    id: 13,
    company: "WIPRO",
    type: "time_calculation",
    question:
      "A trip takes 6 hours. After travelling 1/4 hr, 1 3/8 hrs and 2 1/3 hrs, how much time remains?",
    answer: "2 hours 2 minutes 30 seconds",
  },
  {
    id: 14,
    company: "WIPRO",
    type: "linear_equations",
    question:
      "2 oranges, 3 bananas, 4 apples cost Rs.15. 3 oranges, 2 bananas, 1 apple cost Rs.10. Find cost of 3 of each.",
    answer: 15,
  },
  {
    id: 15,
    company: "WIPRO",
    type: "logic_puzzle",
    question:
      "At a reception, guests leave in fractions. Finally 6 remain. How many were originally present?",
    answer: 45,
  },
  {
    id: 16,
    company: "WIPRO",
    type: "algebra",
    question:
      "Black toys cost 2.5 times brown toys. Wrong billing increases total by 45%. Find number of brown toys.",
    answer: 15,
  },
  {
    id: 17,
    company: "WIPRO",
    type: "fraction_logic",
    question: "If half of 5 were 3, what would one-third of 10 be?",
    answer: 4,
  },
  {
    id: 18,
    company: "WIPRO",
    type: "modular_arithmetic",
    question: "Find the remainder when 30^80 is divided by 17.",
    answer: 1,
  },
  {
    id: 19,
    company: "WIPRO",
    type: "bridge_crossing",
    question:
      "Three people cross a bridge using one bicycle. Find the shortest time required.",
    answer: "2.92 minutes",
  },
  {
    id: 20,
    company: "WIPRO",
    type: "transport_problem",
    question:
      "Each van carries 13 tonnes. Twelve boxes of 9 tonnes each must be transported. Find minimum van loads.",
    answer: 9,
  },
  {
    id: 21,
    company: "WIPRO",
    type: "lcm",
    question:
      "Sudhir goes to market every 64 days and Sushil every 72 days. When will they meet again?",
    answer: 576,
  },
  {
    id: 22,
    company: "WIPRO",
    type: "arrangement",
    question:
      "In an arrangement of cars and scooters, find number of scooters on the right side.",
    answer: 15,
  },
  {
    id: 23,
    company: "WIPRO",
    type: "physics",
    question:
      "A rubber ball rebounds to 4/5 height repeatedly. Dropped from 120m, find total distance travelled.",
    answer: 600,
  },
  {
    id: 24,
    company: "WIPRO",
    type: "divisibility",
    question:
      "Minimum number of digits required to form numbers from 9 to 9000 divisible by 5?",
    answer: 31,
  },
  {
    id: 25,
    company: "WIPRO",
    type: "clock",
    question:
      "If current time is 11 AM, what will be the time after 1234567890 hours?",
    answer: "5 AM",
  },
];

export const accentureQuestions: Question[] = [
  {
    id: 1,
    company: "ACCENTURE",
    type: "number_series",
    question: "Find the next number in the sequence: 2, 2, 12, 12, 30, 30, ?",
    answer: 56,
  },
  {
    id: 2,
    company: "ACCENTURE",
    type: "number_series",
    question:
      "Find the missing number in the series: 8, 2, 14, 6, 11, ?, 14, 6, 18, 12",
    answer: 9,
  },
  {
    id: 3,
    company: "ACCENTURE",
    type: "number_series",
    question:
      "Find the missing number in the series: 15, 51, 216, 1100, ?, 46452",
    answer: 6630,
  },
  {
    id: 4,
    company: "ACCENTURE",
    type: "number_series",
    question: "Find the next number in the series: 2, 12, 36, 80, 150, ?",
    answer: 252,
  },
  {
    id: 5,
    company: "ACCENTURE",
    type: "series_pattern",
    question:
      "What is the 56743rd term in the series: 1,2,3,4,5,6,7,8,9,10,11,...?",
    answer: 7,
  },
  {
    id: 6,
    company: "ACCENTURE",
    type: "logic_puzzle",
    question:
      "One dog says there are two dogs in front of him. Another says there are two dogs behind him. How many dogs are there?",
    answer: 3,
  },
  {
    id: 7,
    company: "ACCENTURE",
    type: "algebra",
    question:
      "A group of cats together killed 99919 mice. Each cat killed an equal number of mice and more mice than the number of cats. How many cats were there?",
    answer: 991,
  },
  {
    id: 8,
    company: "ACCENTURE",
    type: "set_theory",
    question:
      "70 students paint a picture. 52 use green color and 38 use both colors. How many students use red color?",
    answer: 50,
  },
  {
    id: 9,
    company: "ACCENTURE",
    type: "set_theory",
    question:
      "In a class of 15 students, 7 speak English, 8 speak Hindi and 3 speak neither. How many students speak both languages?",
    answer: 3,
  },
  {
    id: 10,
    company: "ACCENTURE",
    type: "set_theory",
    question:
      "In a colony, 53 read Hindi, 46 read Times, 39 read Deccan. 22 read Hindi & Deccan, 23 read Deccan & Times, 15 read all three. How many read only Hindi and Times?",
    answer: 24,
  },
  {
    id: 11,
    company: "ACCENTURE",
    type: "set_theory",
    question:
      "At an international conference, 100 delegates spoke English, 40 spoke French and 20 spoke both. How many spoke at least one language?",
    answer: 120,
  },
  {
    id: 12,
    company: "ACCENTURE",
    type: "algebra",
    question:
      "The sum of three single digit numbers is 15 less than their product. After subtracting 2 from the first number, the product becomes 7 more than before. Find the product of the original numbers.",
    answer: 24,
  },
  {
    id: 13,
    company: "ACCENTURE",
    type: "number_theory",
    question:
      "Find N if N is the greatest number that divides 1305, 4665 and 6905 leaving the same remainder. Find the sum of digits of N.",
    answer: 4,
  },
  {
    id: 14,
    company: "ACCENTURE",
    type: "counting",
    question:
      "How many numbers between 100 and 400 are divisible by either 2, 3, 5 or 7?",
    answer: 252,
  },
  {
    id: 15,
    company: "ACCENTURE",
    type: "number_puzzle",
    question:
      "A three-digit number has digit sum 10. The middle digit equals the sum of the other two. When digits are reversed, the number increases by 99. Find the number.",
    answer: 253,
  },
  {
    id: 16,
    company: "ACCENTURE",
    type: "algebra",
    question:
      "If one-third of one-fourth of a number is 15, then what is three-tenth of that number?",
    answer: 18,
  },
  {
    id: 17,
    company: "ACCENTURE",
    type: "ratio_lcm",
    question:
      "The ratio of two numbers is 3:4 and their HCF is 4. Find their LCM.",
    answer: 48,
  },
  {
    id: 18,
    company: "ACCENTURE",
    type: "number_theory",
    question:
      "Find the smallest number which leaves remainders 22, 35, 48 and 61 when divided by 26, 39, 52 and 65 respectively.",
    answer: 776,
  },
  {
    id: 19,
    company: "ACCENTURE",
    type: "algebra",
    question:
      "The sum of squares of three numbers is 138 and the sum of their pairwise products is 131. Find the sum of the numbers.",
    answer: 20,
  },
  {
    id: 20,
    company: "ACCENTURE",
    type: "number_puzzle",
    question:
      "A two-digit number has product of digits equal to 8. If 18 is added, the digits reverse. Find the number.",
    answer: 24,
  },
  {
    id: 21,
    company: "ACCENTURE",
    type: "algebra",
    question:
      "What is the sum of two consecutive even numbers whose squares differ by 84?",
    answer: 42,
  },
  {
    id: 22,
    company: "ACCENTURE",
    type: "number_series",
    question: "215 : 474 :: 537 : ?",
    answer: 26,
  },
  {
    id: 23,
    company: "ACCENTURE",
    type: "mixture",
    question:
      "A 20-liter mixture of milk and water is in the ratio 3:5. If 4 liters are replaced by water, what is the final ratio?",
    answer: "6 : 14",
  },
  {
    id: 24,
    company: "ACCENTURE",
    type: "work_problem",
    question:
      "If work done by (x−1) men in (x+1) days to that by (x+2) men in (x−1) days is 9:10, find x.",
    answer: 8,
  },
  {
    id: 25,
    company: "ACCENTURE",
    type: "ratio_problem",
    question:
      "In a theatre, the ratio of cars to two-wheelers is 1:8. If total vehicles are 100, how many cars are there?",
    answer: 5,
  },
];
