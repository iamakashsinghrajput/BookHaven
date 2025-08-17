import { FileText, GraduationCap, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

const ExamPrepHub = () => {
  // A list of popular exams to display visually
  const exams = [
    { name: 'JEE Main & Adv' },
    { name: 'NEET (UG)' },
    { name: 'UPSC Civil Services' },
    { name: 'CBSE Class 12th' },
    { name: 'ICSE Class 10th' },
    { name: 'GATE' },
    { name: 'SSC CGL' },
    { name: 'State Boards' },
    { name: 'And More...' },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight text-black">Your Ultimate Exam Prep Hub</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Unlock a vast repository of previous year question papers. From competitive exams to board finals, find everything you need to ace your preparation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side: Feature List */}
          <div>
            <h3 className="text-3xl font-bold mb-4 text-black">Why Use Our Archive?</h3>
            <p className="text-gray-700 mb-6">
              Understanding exam patterns is key to success. Our curated collection helps you practice, analyze, and improve your performance.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-brand-blue/10 p-2 rounded-full">
                  <GraduationCap className="text-gray-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-black">All Major Exams Covered</h4>
                  <p className="text-gray-600">From engineering and medical entrance exams to civil services and school boards.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-brand-blue/10 p-2 rounded-full">
                  <FileText className="text-gray-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-black">Years of Papers</h4>
                  <p className="text-gray-600">Access question papers from multiple years to track pattern changes and key topics.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-brand-blue/10 p-2 rounded-full">
                  <BrainCircuit className="text-gray-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-black">All Subjects & Branches</h4>
                  <p className="text-gray-600">Find papers for every subject and stream, all in one organized place.</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <div className="grid grid-cols-3 gap-4">
              {exams.map((exam) => (
                <div
                  key={exam.name}
                  className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center text-center font-semibold text-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  {exam.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
            <Link href="/question-papers" // Link to a future dedicated page
              className="px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors text-lg"
            >
                Start Practicing Now
            </Link>
        </div>
      </div>
    </section>
  );
};

export default ExamPrepHub;