import PageWrapper from '../components/PageWrapper';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactPage = () => {
  return (
    <>
      <PageWrapper>
      <PageHeader
        title="Get In Touch"
        subtitle="We're here to help. Reach out with any questions, or stop by for a visit during our open hours."
      />
      <main className="container mx-auto py-12">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-black">Contact Information</h2>
            <div className="flex items-start gap-4">
              <MapPin className="text-black mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-black">Address</h3>
                <p className="text-gray-600">F-No: 187623, VVIP Homes, Greater Noida</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="text-black mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-black">Phone</h3>
                <p className="text-gray-600">9351 736629</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="text-black mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-black">Email</h3>
                <p className="text-gray-600">akash21052000singh@gmail.com</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-black pt-6">Opening Hours</h2>
            <ul className="text-gray-600 space-y-1">
                <li><span className="font-semibold">Monday - Friday:</span> 9:00 AM - 8:00 PM</li>
                <li><span className="font-semibold">Saturday:</span> 10:00 AM - 6:00 PM</li>
                <li><span className="font-semibold">Sunday:</span> Closed</li>
            </ul>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-black">Send Us a Message</h2>
            <form className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block font-medium mb-1 text-black">Your Name</label>
                <input type="text" id="name" className="w-full p-3 border border-gray-300 text-gray-700 rounded-md focus:ring-black focus:border-black" />
              </div>
              <div>
                <label htmlFor="email" className="block font-medium mb-1 text-black">Your Email</label>
                <input type="email" id="email" className="w-full p-3 border border-gray-300 text-gray-700 rounded-md focus:ring-black focus:border-black" />
              </div>
              <div>
                <label htmlFor="message" className="block font-medium mb-1 text-black">Message</label>
                <textarea id="message" rows={5} className="w-full p-3 border border-gray-300 text-gray-700 rounded-md focus:ring-black focus:border-black"></textarea>
              </div>
              <button type="submit" className="w-full px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors">
                Submit
              </button>
            </form>
          </div>
        </div>
      </main>
      </PageWrapper>
      
      <Footer />
    </>
  );
};

export default ContactPage;