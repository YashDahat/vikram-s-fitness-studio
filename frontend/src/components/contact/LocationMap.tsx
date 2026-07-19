import React from 'react';

const LocationMap: React.FC = () => {
  const studioLocation = { lat: 18.513863, lng: 73.829895 };
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  }&q=${studioLocation.lat},${studioLocation.lng}`;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">Our Location</h2>
        <div className="relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
          <iframe
            title="Studio Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapSrc}
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;