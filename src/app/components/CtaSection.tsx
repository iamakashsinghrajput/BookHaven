import Link from 'next/link';

const CtaSection = () => {
  return (
    <section className="bg-brand-blue text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-extrabold">Ready to Join?</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">Get your free library card today and unlock a world of knowledge, entertainment, and community resources.</p>
            <Link href="/contact" className="mt-8 inline-block px-10 py-4 bg-white text-black border border-brand-blue text-brand-blue font-bold rounded-full hover:bg-gray-200 transition-colors">
                Become a Member
            </Link>
        </div>
    </section>
  );
};

export default CtaSection;