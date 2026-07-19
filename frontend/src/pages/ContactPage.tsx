import { Layout } from '@/components/Layout';
import { ContactForm } from '@/components/contact/ContactForm';
import LocationMap from '@/components/contact/LocationMap';

const ContactPage = () => {
  return (
    <Layout>
      <section className="relative h-[400px] md:h-[500px] bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl">We'd love to hear from you!</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#333333]">Get in Touch</h2>
            <p className="text-lg leading-relaxed text-[#333333]">
              Have questions about our classes, memberships, or anything else? Reach out to us using the form below, or find our contact details.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-[#333333]">Address</h3>
                <p className="text-[#333333]">123 Fitness Ave, Gym City, GC 12345</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#333333]">Phone</h3>
                <p className="text-[#333333]">+1 (555) 123-4567</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#333333]">Email</h3>
                <p className="text-[#333333]">info@vikramsfitness.com</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#333333]">Opening Hours</h3>
                <p className="text-[#333333]">Mon - Fri: 6:00 AM - 10:00 PM</p>
                <p className="text-[#333333]">Sat - Sun: 8:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <LocationMap />
    </Layout>
  );
};

export default ContactPage;