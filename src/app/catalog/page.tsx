'use client';

import PageWrapper from '../components/PageWrapper';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';
import Image from 'next/image';
import { Search, BookOpen } from 'lucide-react';

const CatalogPage = () => {
  // Featured books from the original NewArrivals section
  const featuredBooks = [
    { title: 'The Vanishing Half', author: 'Brit Bennett', img: '/vanishing.png' },
    { title: 'Atomic Habits', author: 'James Clear', img: '/atomic.png' },
    { title: 'Circe', author: 'Madeline Miller', img: '/circe.png' },
    { title: 'Where the Crawdads Sing', author: 'Delia Owens', img: '/crawdads.png' },
  ];

  // Additional books for extended catalog
  const additionalBooks = [
    { title: 'The Midnight Library', author: 'Matt Haig' },
    { title: 'Dune', author: 'Frank Herbert' },
    { title: 'Project Hail Mary', author: 'Andy Weir' },
    { title: 'Klara and the Sun', author: 'Kazuo Ishiguro' },
    { title: 'Educated', author: 'Tara Westover' },
    { title: 'The Silent Patient', author: 'Alex Michaelides' },
    { title: 'Becoming', author: 'Michelle Obama' },
    { title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid' },
  ];

  return (
    <>
      <PageWrapper>
      <PageHeader
        title="Search Our Catalog"
        subtitle="Find your next great read from millions of titles, from timeless classics to the latest bestsellers."
      />
      <main className="container mx-auto py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="search"
              placeholder="Search by title, author, or ISBN..."
              className="w-full p-4 pl-12 text-black text-lg border-2 border-gray-300 rounded-full focus:ring-brand-blue focus:border-brand-blue transition"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
          </div>
        </div>

        {/* Featured Books Section */}
        <h2 className="text-3xl font-bold mb-6 text-center text-black">Featured Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {featuredBooks.map((book) => (
            <div key={book.title} className="group text-center">
              <div className="overflow-hidden rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                <div className="w-full h-120 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center relative">
                  {/* Fallback content - will show if image fails to load */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <BookOpen className="text-blue-400 mb-2" size={32} />
                    <span className="text-blue-600 text-sm font-medium">{book.title}</span>
                  </div>
                  
                  <Image
                    src={book.img}
                    alt={`Cover of ${book.title}`}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300 relative z-10"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-black mt-4">{book.title}</h3>
              <p className="text-gray-500">by {book.author}</p>
              <button className="mt-4 px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* More Books Section */}
        <h2 className="text-3xl font-bold mb-6 text-center text-black">More Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {additionalBooks.map((book) => (
            <div key={book.title} className="border rounded-lg p-6 text-center shadow-md hover:shadow-xl transition-shadow">
              <BookOpen className="mx-auto text-black mb-4" size={48} />
              <h3 className="text-xl font-bold text-black">{book.title}</h3>
              <p className="text-gray-600 mt-1">by {book.author}</p>
              <button className="mt-4 px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Categories Section */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold mb-6 text-center text-black">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'Fiction',
              'Non-Fiction', 
              'Science',
              'Biography',
              'Self-Help',
              'History',
              'Technology',
              'Literature'
            ].map((category) => (
              <div key={category} className="bg-white border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
                <h3 className="font-semibold text-black">{category}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>
      </PageWrapper>
      
      <Footer />
    </>
  );
};

export default CatalogPage;