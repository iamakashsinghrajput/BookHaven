import { Library, Calendar, Smartphone } from 'lucide-react';
import Link from 'next/link';

const QuickActions = () => {
  const actions = [
    {
      icon: <Library size={40} className="text-brand-blue" />,
      title: 'Explore Our Collections',
      description: 'Search millions of books, articles, and digital resources.',
      href: '/catalog',
    },
    {
      icon: <Calendar size={40} className="text-brand-blue" />,
      title: 'Upcoming Events',
      description: 'Join our workshops, author talks, and community gatherings.',
      href: '/events',
    },
    {
      icon: <Smartphone size={40} className="text-brand-blue" />,
      title: 'Digital Library',
      description: 'Access e-books, audiobooks, and streaming services on the go.',
      href: '#', // Link to a future Digital Library page
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {actions.map((action) => (
            <Link href={action.href} key={action.title}>
              <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="flex justify-center mb-4 text-gray-700">{action.icon}</div>
                <h3 className="text-2xl font-bold text-black mb-2">{action.title}</h3>
                <p className="text-gray-600">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;