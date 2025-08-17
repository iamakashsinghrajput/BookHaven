import PageWrapper from '../components/PageWrapper';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';
import { Calendar, MapPin } from 'lucide-react';

const EventsPage = () => {
  const events = [
    {
      date: 'July 2, 2024 @ 1:00 PM',
      title: 'Author Spotlight: Jane Doe',
      description: 'Join us for a live Q&A session with the bestselling author of "The Last Horizon".',
      location: 'Main Reading Room',
    },
    {
      date: 'July 15, 2024 @ 6:00 PM',
      title: 'Summer Reading Challenge Kick-off',
      description: 'Sign up for our annual summer reading challenge and enjoy games, snacks, and prizes.',
      location: 'Children\'s Section',
    },
    {
      date: 'August 5, 2024 @ 10:00 AM',
      title: 'Digital Literacy Workshop',
      description: 'Learn the basics of online safety, e-books, and using our digital resources.',
      location: 'Computer Lab (Room 201)',
    },
  ];

  return (
    <>
      <PageWrapper>
      <PageHeader
        title="Upcoming Events"
        subtitle="Discover workshops, author talks, book clubs, and community gatherings at BookHaven."
      />
      <main className="container mx-auto py-12">
        <div className="space-y-8 max-w-4xl mx-auto">
          {events.map((event) => (
            <div key={event.title} className="border-l-4 border-brand-blue bg-gray-50 p-6 rounded-r-lg shadow-sm">
              <div className="flex items-center gap-x-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-2"><Calendar size={16} /> {event.date}</div>
                <div className="flex items-center gap-2"><MapPin size={16} /> {event.location}</div>
              </div>
              <h3 className="text-2xl font-bold text-black">{event.title}</h3>
              <p className="text-gray-700 mt-2">{event.description}</p>
              <button className="mt-4 px-5 py-2 border border-black text-black rounded-full hover:bg-black hover:text-white transition-colors">
                Register Now
              </button>
            </div>
          ))}
        </div>
      </main>
      </PageWrapper>
      
      <Footer />
    </>
  );
};

export default EventsPage;