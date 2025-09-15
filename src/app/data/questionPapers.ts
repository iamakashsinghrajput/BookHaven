export interface QuestionPaper {
  id: number | string;
  title: string;
  category: 'engineering' | 'medical' | 'school' | 'other';
  subCategory: string; // e.g., 'cse', 'neet', 'class12'
  year: number | string;
  subject: string;
  url: string; // Link to the PDF file
  isUserUploaded?: boolean;
  uploaderName?: string;
  uploaderEmail?: string;
  uploadDate?: string;
}

export const allPapers: QuestionPaper[] = [
  // Engineering - JEE (Official papers from NTA and IIT sources)
  { id: 1, title: 'JEE Main 2024 - Session 1 (Soon Available)', category: 'engineering', subCategory: 'jee', year: 2024, subject: 'Physics, Chemistry, Maths', url: '#' },
  { id: 2, title: 'JEE Main 2024 - Session 2 (Soon Available)', category: 'engineering', subCategory: 'jee', year: 2024, subject: 'Physics, Chemistry, Maths', url: '#' },
  { id: 3, title: 'JEE Advanced 2024 - Paper 1 (Official)', category: 'engineering', subCategory: 'jee', year: 2024, subject: 'Physics, Chemistry, Maths', url: 'https://jeeadv.ac.in/past_qps/2024_1_English.pdf' },
  { id: 4, title: 'JEE Advanced 2024 - Paper 2 (Official)', category: 'engineering', subCategory: 'jee', year: 2024, subject: 'Physics, Chemistry, Maths', url: 'https://jeeadv.ac.in/past_qps/2024_2_English.pdf' },
  { id: 5, title: 'JEE Main 2023 - Sample', category: 'engineering', subCategory: 'jee', year: 2023, subject: 'Physics, Chemistry, Maths', url: '/sample-papers/sample-jee-main-2024.pdf' },
  { id: 6, title: 'JEE Advanced 2023 - Sample', category: 'engineering', subCategory: 'jee', year: 2023, subject: 'Physics, Chemistry, Maths', url: '/sample-papers/sample-jee-main-2024.pdf' },
  
  // Engineering - Computer Science
  { id: 7, title: 'GATE 2024 - Computer Science CS1 Answer Key (Official)', category: 'engineering', subCategory: 'cse', year: 2024, subject: 'Computer Science', url: 'https://gate2024.iisc.ac.in/wp-content/uploads/2024/CS1FinalAnswerKey.pdf' },
  { id: 8, title: 'GATE 2024 - Computer Science CS2 Answer Key (Official)', category: 'engineering', subCategory: 'cse', year: 2024, subject: 'Computer Science', url: 'https://gate2024.iisc.ac.in/wp-content/uploads/2024/CS2FinalAnswerKey.pdf' },
  { id: 9, title: 'GATE 2024 - Computer Science Question Papers (Soon Available)', category: 'engineering', subCategory: 'cse', year: 2024, subject: 'Computer Science', url: '#' },
  { id: 10, title: 'NIELIT Scientist B - Computer Science 2024 (Soon Available)', category: 'engineering', subCategory: 'cse', year: 2024, subject: 'Computer Science', url: '#' },
  { id: 11, title: 'ISRO Computer Science 2023 (Soon Available)', category: 'engineering', subCategory: 'cse', year: 2023, subject: 'Computer Science', url: '#' },
  
  // Engineering - Mechanical
  { id: 12, title: 'GATE 2024 - Mechanical Engineering (Soon Available)', category: 'engineering', subCategory: 'mech', year: 2024, subject: 'Mechanical Engineering', url: '#' },
  { id: 13, title: 'GATE 2023 - Mechanical Engineering (Soon Available)', category: 'engineering', subCategory: 'mech', year: 2023, subject: 'Mechanical Engineering', url: '#' },
  { id: 14, title: 'ISRO Mechanical 2024 (Soon Available)', category: 'engineering', subCategory: 'mech', year: 2024, subject: 'Mechanical Engineering', url: '#' },
  { id: 15, title: 'BHEL Mechanical Engineer 2023 (Soon Available)', category: 'engineering', subCategory: 'mech', year: 2023, subject: 'Mechanical Engineering', url: '#' },
  
  // Engineering - General B.Tech
  { id: 16, title: 'BITSAT 2024 (Soon Available)', category: 'engineering', subCategory: 'btech', year: 2024, subject: 'Physics, Chemistry, Maths, English', url: '#' },
  { id: 17, title: 'VITEEE 2024 - Slot 1 (Soon Available)', category: 'engineering', subCategory: 'btech', year: 2024, subject: 'PCM & English', url: '#' },
  { id: 18, title: 'VITEEE 2024 - Slot 2 (Soon Available)', category: 'engineering', subCategory: 'btech', year: 2024, subject: 'PCM & English', url: '#' },
  { id: 19, title: 'COMEDK UGET 2024 (Soon Available)', category: 'engineering', subCategory: 'btech', year: 2024, subject: 'Physics, Chemistry, Maths', url: '#' },
  { id: 20, title: 'SRMJEEE 2024 (Soon Available)', category: 'engineering', subCategory: 'btech', year: 2024, subject: 'Physics, Chemistry, Maths', url: '#' },
  
  // Medical - NEET (Real papers from official NTA sources)
  { id: 21, title: 'NEET (UG) 2024 - Answer Key (Official)', category: 'medical', subCategory: 'neet', year: 2024, subject: 'Physics, Chemistry, Biology', url: 'https://exams.nta.ac.in/NEET/images/NEET_UG_2024_KEY_03.06.2024.pdf' },
  { id: 22, title: 'NEET (UG) 2024 - Revised Answer Key (Official)', category: 'medical', subCategory: 'neet', year: 2024, subject: 'Physics, Chemistry, Biology', url: 'https://exams.nta.ac.in/NEET/images/NEET_KEY_26.07.2024.pdf' },
  { id: 23, title: 'NEET (UG) 2024 - Information Bulletin (Official)', category: 'medical', subCategory: 'neet', year: 2024, subject: 'Physics, Chemistry, Biology', url: 'https://exams.nta.ac.in/NEET/images/NEET%20UG%202024%20IB-version%202%20final.pdf' },
  { id: 24, title: 'NEET (UG) 2024 - FAQs (Official)', category: 'medical', subCategory: 'neet', year: 2024, subject: 'Physics, Chemistry, Biology', url: 'https://exams.nta.ac.in/NEET/images/faqs-for-the-neet-ug-2024.pdf' },
  { id: 25, title: 'NEET (UG) 2024 - Sample', category: 'medical', subCategory: 'neet', year: 2024, subject: 'Physics, Chemistry, Biology', url: '/sample-papers/sample-neet-2024.pdf' },
  
  // Medical - AIIMS
  { id: 26, title: 'AIIMS MBBS 2024 (Soon Available)', category: 'medical', subCategory: 'aiims', year: 2024, subject: 'PCB & GK', url: '#' },
  { id: 27, title: 'AIIMS MBBS 2023 (Soon Available)', category: 'medical', subCategory: 'aiims', year: 2023, subject: 'PCB & GK', url: '#' },
  { id: 28, title: 'AIIMS MBBS 2022 (Soon Available)', category: 'medical', subCategory: 'aiims', year: 2022, subject: 'PCB & GK', url: '#' },
  { id: 29, title: 'AIIMS MBBS 2021 (Soon Available)', category: 'medical', subCategory: 'aiims', year: 2021, subject: 'PCB & GK', url: '#' },
  
  // School - Class 12
  { id: 30, title: 'CBSE Class 12 Board Exam 2024 - Physics (Available)', category: 'school', subCategory: 'class12', year: 2024, subject: 'Physics', url: 'https://www.vedantu.com/previous-year-question-paper/cbse-class-12-physics-question-paper-2024' },
  { id: 31, title: 'CBSE Class 12 Board Exam 2024 - Physics Set-1 (55/1/1)', category: 'school', subCategory: 'class12', year: 2024, subject: 'Physics', url: 'https://www.vedantu.com/previous-year-question-paper/cbse-class-12-physics-question-paper-set-1-55-1-1-2024' },
  { id: 32, title: 'CBSE Class 12 Board Exam 2024 - Physics Set-1 (55/4/1)', category: 'school', subCategory: 'class12', year: 2024, subject: 'Physics', url: 'https://www.vedantu.com/previous-year-question-paper/cbse-class-12-physics-question-paper-set-1-55-4-1-2024' },
  { id: 33, title: 'CBSE Class 12 Board Exam 2024 - Chemistry (Soon Available)', category: 'school', subCategory: 'class12', year: 2024, subject: 'Chemistry', url: '#' },
  { id: 34, title: 'CBSE Class 12 Board Exam 2024 - Mathematics (Soon Available)', category: 'school', subCategory: 'class12', year: 2024, subject: 'Mathematics', url: '#' },
  { id: 35, title: 'CBSE Class 12 Board Exam 2024 - Biology (Soon Available)', category: 'school', subCategory: 'class12', year: 2024, subject: 'Biology', url: '#' },
  { id: 36, title: 'CBSE Class 12 Board Exam 2024 - English Core (Soon Available)', category: 'school', subCategory: 'class12', year: 2024, subject: 'English', url: '#' },
  { id: 37, title: 'ISC Class 12 2024 - All Subjects (Available)', category: 'school', subCategory: 'class12', year: 2024, subject: 'Physics, Chemistry, Maths', url: 'https://www.oswaal360.com/pages/isc-class-12-previous-year-question-papers-2024-with-solution--free-pdf-download' },
  { id: 38, title: 'ISC Class 12 2024 - Physics (Available)', category: 'school', subCategory: 'class12', year: 2024, subject: 'Physics', url: 'https://www.shaalaa.com/search-question-papers/cisce-isc-class-12-isc-science_1432?subjects=physics-theory_3089' },
  { id: 39, title: 'Karnataka 2nd PUC 2024 - Chemistry (Soon Available)', category: 'school', subCategory: 'class12', year: 2024, subject: 'Chemistry', url: '#' },
  
  // School - Class 10
  { id: 40, title: 'CBSE Class 10 Board Exam 2024 - Mathematics (Available)', category: 'school', subCategory: 'class10', year: 2024, subject: 'Mathematics', url: 'https://www.vedantu.com/previous-year-question-paper/cbse-class-10-maths-question-paper-2024' },
  { id: 41, title: 'CBSE Class 10 Board Exam 2024 - All Subjects (Available)', category: 'school', subCategory: 'class10', year: 2024, subject: 'All Subjects', url: 'https://www.pw.live/school-prep/exams/cbse-class-10-previous-year-question-papers' },
  { id: 42, title: 'CBSE Class 10 Board Exam 2024 - Science (Soon Available)', category: 'school', subCategory: 'class10', year: 2024, subject: 'Science', url: '#' },
  { id: 43, title: 'CBSE Class 10 Board Exam 2024 - English (Soon Available)', category: 'school', subCategory: 'class10', year: 2024, subject: 'English', url: '#' },
  { id: 44, title: 'CBSE Class 10 Board Exam 2024 - Social Science (Soon Available)', category: 'school', subCategory: 'class10', year: 2024, subject: 'Social Science', url: '#' },
  { id: 45, title: 'ICSE Class 10 2024 - All Subjects (Available)', category: 'school', subCategory: 'class10', year: 2024, subject: 'All Subjects', url: 'https://www.oswaal360.com/pages/icse-class-10-previous-year-question-papers-2024-with-solution--free-pdf-download' },
  { id: 46, title: 'ICSE Class 10 2024 - Physics (Available)', category: 'school', subCategory: 'class10', year: 2024, subject: 'Physics', url: 'https://www.shaalaa.com/question-paper-solution/cisce-icse-physics-icse-class-10-2023-2024-official_18779' },
  { id: 47, title: 'ICSE Class 10 2024 - Mathematics, Science (Available)', category: 'school', subCategory: 'class10', year: 2024, subject: 'Mathematics, Science', url: 'https://www.icseonline.com/' },
  
  // UPSC & Government Exams (Real papers from official sources)
  { id: 48, title: 'UPSC CSE Prelims 2023 - Official Question Paper', category: 'other', subCategory: 'upsc', year: 2023, subject: 'General Studies', url: 'https://upsc.gov.in/sites/default/files/QP_CS_Pre_Exam_2023_280523.pdf' },
  { id: 49, title: 'UPSC CSE Prelims 2024 - GS Paper 1 (Soon Available)', category: 'other', subCategory: 'upsc', year: 2024, subject: 'General Studies', url: '#' },
  { id: 50, title: 'UPSC CSE Prelims 2024 - GS Paper 2 (CSAT) (Soon Available)', category: 'other', subCategory: 'upsc', year: 2024, subject: 'CSAT', url: '#' },
  { id: 51, title: 'UPSC CSE Prelims 2022 (Soon Available)', category: 'other', subCategory: 'upsc', year: 2022, subject: 'General Studies', url: '#' },
  { id: 52, title: 'UPSC CSE Prelims 2021 (Soon Available)', category: 'other', subCategory: 'upsc', year: 2021, subject: 'General Studies', url: '#' },
];

// Function to add a new user-uploaded paper
export const addUserUploadedPaper = (paper: Omit<QuestionPaper, 'id'>) => {
  const newId = Math.max(...allPapers.map(p => p.id as number)) + 1;
  const newPaper: QuestionPaper = {
    ...paper,
    id: newId,
    isUserUploaded: true,
    uploadDate: new Date().toISOString().split('T')[0]
  };
  allPapers.push(newPaper);
  return newPaper;
};

// Function to get all papers including user-uploaded ones
export const getAllPapers = () => {
  return allPapers;
};

// Function to delete a user-uploaded paper
export const deleteUserUploadedPaper = (paperId: number, userEmail: string) => {
  const paperIndex = allPapers.findIndex(p => p.id === paperId);
  
  if (paperIndex === -1) {
    throw new Error('Paper not found');
  }
  
  const paper = allPapers[paperIndex];
  
  // Only allow deletion if it's a user-uploaded paper and the email matches
  if (!paper.isUserUploaded) {
    throw new Error('Cannot delete official papers');
  }
  
  if (paper.uploaderEmail !== userEmail) {
    throw new Error('You can only delete papers you uploaded');
  }
  
  // Clean up the blob URL if it exists
  if (paper.url.startsWith('blob:')) {
    URL.revokeObjectURL(paper.url);
  }
  
  // Remove the paper from the array
  allPapers.splice(paperIndex, 1);
  
  return true;
};

// Function to update a user-uploaded paper
export const updateUserUploadedPaper = (paperId: number, updates: Partial<QuestionPaper>, userEmail: string) => {
  const paperIndex = allPapers.findIndex(p => p.id === paperId);
  
  if (paperIndex === -1) {
    throw new Error('Paper not found');
  }
  
  const paper = allPapers[paperIndex];
  
  // Only allow updates if it's a user-uploaded paper and the email matches
  if (!paper.isUserUploaded) {
    throw new Error('Cannot update official papers');
  }
  
  if (paper.uploaderEmail !== userEmail) {
    throw new Error('You can only update papers you uploaded');
  }
  
  // Apply updates
  allPapers[paperIndex] = { ...paper, ...updates };
  
  return allPapers[paperIndex];
};