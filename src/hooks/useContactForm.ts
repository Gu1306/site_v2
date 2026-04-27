import { useState } from 'react';
import { submitContactForm } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  objective: string;
  message: string;
}

export const useContactForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    
    try {
      await submitContactForm(data);
      
      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve. Obrigado!",
      });

      // Track analytics event
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'contact_form_submit', {
          event_category: 'engagement',
          event_label: data.objective
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao enviar formulário:', error);
      
      const errorMessage = error.response?.data?.error || 
        'Erro ao enviar mensagem. Tente novamente ou entre em contato via WhatsApp.';
      
      toast({
        title: "Erro ao enviar mensagem",
        description: errorMessage,
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    isLoading
  };
};