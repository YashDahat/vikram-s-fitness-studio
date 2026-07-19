import { useState } from 'react';
import { useContact } from '@/hooks/useContact';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@radix-ui/react-label';
import { Textarea } from '@/components/ui/Textarea';

export const ContactForm = () => {
  const { submitContactForm, isLoading, error } = useContact();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    try {
      await submitContactForm({ name, email, subject, message });
      setSuccessMessage('Your message has been sent successfully!');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      // Error is already set by the hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] mb-6">Send Us a Message</h2>
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}
      <div>
        <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div>
        <Label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </Label>
        <Input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div>
        <Label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="w-full"
        />
      </div>
      <Button
        type="submit"
        className="bg-[#F26419] hover:bg-[#E05A16] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
};