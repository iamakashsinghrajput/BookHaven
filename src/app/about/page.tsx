import PageWrapper from '../components/PageWrapper';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <>
      <PageWrapper>
      <PageHeader
        title="About BookHaven"
        subtitle="Your community hub for learning, discovery, and imagination since 1924."
      />
      <main className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto text-lg text-gray-700 leading-relaxed space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-black mb-4">Our Mission</h2>
            <p>
              BookHaven is dedicated to providing free and equal access to information, knowledge, and entertainment. 
              We strive to foster a love of reading, support lifelong learning, and build a stronger, more connected community 
              through our collections, programs, and services.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-black mb-4">Our History</h2>
            <p>
              Founded a century ago, BookHaven started as a single room with a few hundred donated books. 
              Today, it stands as a cornerstone of our community, with a vast digital and physical collection, 
              state-of-the-art facilities, and a commitment to serving the evolving needs of our patrons.
            </p>
          </div>
        </div>
      </main>
      </PageWrapper>
      
      <Footer />
    </>
  );
};

export default AboutPage;