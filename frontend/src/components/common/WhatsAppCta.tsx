import React from 'react';

const WhatsAppCta: React.FC = () => {
  const phoneNumber = '9527730493';
  const message = 'Hello Vikram\'s Fitness Studio, I have a question.';
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#1DA851] transition-all duration-200 z-50 flex items-center justify-center"
      aria-label="Chat with us on WhatsApp"
    >
      <svg
        className="w-8 h-8"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.04 2C7.34 2 3.58 5.76 3.58 10.46c0 1.5.4 2.92 1.18 4.17L3 21l6.44-1.74c1.18.6 2.5.93 3.6.93 4.7 0 8.46-3.76 8.46-8.46S16.74 2 12.04 2zm3.56 14.5c-.18.3-.6.39-.82.22-.22-.18-1.3-.8-1.5-1-.2-.18-.45-.27-.64.2-.18.39-.72.93-.9 1.13-.18.18-.36.2-.66.08-.3-.12-1.25-.46-2.37-1.46-1.1-1-1.85-2.2-2.07-2.5-.22-.3-.02-.46.16-.64.16-.18.36-.46.54-.69.18-.22.24-.39.36-.6-.12-.3-.06-.5-.06-.69-.02-.18-.18-.46-.36-.64-.18-.18-.3-.22-.45-.2-.16 0-.36.02-.54.02-.18 0-.46.08-.69.3-.22.22-.8.78-.8 1.9s.82 2.2 1.02 2.4c.2.2 1.6 2.46 3.88 3.42 2.28.96 2.74.8 3.24.76.5-.04 1.3-.54 1.48-.9.18-.36.18-.66.12-.76-.06-.1-.18-.16-.36-.22z" />
      </svg>
    </a>
  );
};

export default WhatsAppCta;