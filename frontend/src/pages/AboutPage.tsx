import Layout from '@/components/Layout';

const AboutPage = () => {
  const trainers = [
    {
      name: 'Vikram Singh',
      specialization: 'Founder & Head Trainer, Strength & Conditioning',
      bio: 'With over 15 years of experience, Vikram is passionate about helping individuals achieve sustainable fitness and overcome lifestyle diseases through personalized training and holistic wellness.',
      image: 'https://images.unsplash.com/photo-1594381837591-115317f64240?w=800&q=80',
    },
    {
      name: 'Priya Sharma',
      specialization: 'Yoga & Flexibility Expert',
      bio: 'Priya brings a calming yet challenging approach to her yoga sessions, focusing on mindfulness, flexibility, and core strength. She believes in the power of movement for mental and physical well-being.',
      image: 'https://images.unsplash.com/photo-1544367524-894728566b0c?w=800&q=80',
    },
    {
      name: 'Rahul Verma',
      specialization: 'Cardio & Endurance Coach',
      bio: 'Rahul specializes in high-intensity interval training (HIIT) and endurance coaching. His energetic classes are designed to boost stamina, burn calories, and improve overall cardiovascular health.',
      image: 'https://images.unsplash.com/photo-1571019625454-f421f6d33a76?w=800&q=80',
    },
  ];

  return (
    <Layout>
      <section className="relative h-[400px] md:h-[500px] bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1571019625454-f421f6d33a76?w=1920&q=80)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About Us</h1>
          <p className="text-lg md:text-xl">Our journey to a healthier you starts here.</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">Our Philosophy</h2>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[#333333] leading-relaxed mb-4">
                At Vikram's Fitness Studio, we believe that true fitness is about more than just physical appearance. It's about fostering a holistic sense of well-being, empowering you to live a vibrant, energetic life free from the constraints of lifestyle diseases. Our approach is rooted in sustainability, focusing on long-term health rather than quick fixes.
              </p>
              <p className="text-[#333333] leading-relaxed">
                We combine expert guidance, personalized training, and a supportive community to help you build strength, improve endurance, enhance flexibility, and cultivate mindful habits that last a lifetime. Your health is our priority, and we are committed to guiding you every step of the way.
              </p>
            </div>
            <div className="flex justify-center">
              <img src="https://images.unsplash.com/photo-1546483875-ad9014f0ba0c?w=800&q=80" alt="Our Philosophy" className="rounded-lg shadow-lg max-h-80 object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center order-2 md:order-1">
              <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80" alt="Our Story" className="rounded-lg shadow-lg max-h-80 object-cover" />
            </div>
            <div className="order-1 md:order-2">
              <p className="text-[#333333] leading-relaxed mb-4">
                Vikram's Fitness Studio was founded by Vikram Singh with a vision to create a fitness sanctuary where individuals could transform their lives. After years of witnessing the struggles people faced with conventional fitness approaches, Vikram envisioned a studio that prioritized health, education, and genuine support.
              </p>
              <p className="text-[#333333] leading-relaxed">
                Starting from humble beginnings, our studio has grown into a thriving community dedicated to empowering members to achieve their fitness goals sustainably. We've built our reputation on a foundation of trust, expertise, and a deep commitment to the well-being of every individual who walks through our doors.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">Meet Our Trainers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((trainer, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center">
                <img src={trainer.image} alt={trainer.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="text-xl font-semibold mb-2">{trainer.name}</h3>
                <p className="text-[#F26419] font-medium mb-3">{trainer.specialization}</p>
                <p className="text-[#333333] leading-relaxed text-sm">{trainer.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;