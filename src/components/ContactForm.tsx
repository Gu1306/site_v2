import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { useContactForm } from "@/hooks/useContactForm";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    objective: '',
    message: ''
  });

  const { handleSubmit, isLoading } = useContactForm();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await handleSubmit(formData);
    
    if (result.success) {
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        objective: '',
        message: ''
      });
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">
          Envie sua mensagem
        </CardTitle>
        <p className="text-muted-foreground">
          Preencha o formulário abaixo ou use nossos canais diretos de contato.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-primary">Nome</label>
              <Input 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Seu nome completo" 
                className="mt-1" 
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-primary">Telefone</label>
              <Input 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(11) 99999-9999" 
                className="mt-1" 
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-primary">E-mail</label>
            <Input 
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu@email.com" 
              className="mt-1" 
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-primary">Objetivo</label>
            <select 
              name="objective"
              value={formData.objective}
              onChange={handleInputChange}
              className="w-full p-3 border border-input rounded-md bg-background"
              required
              disabled={isLoading}
            >
              <option value="">Selecione seu objetivo</option>
              <option value="Avaliação inicial">Avaliação inicial</option>
              <option value="Jornada de 12 semanas">Jornada de 12 semanas</option>
              <option value="Recovery">Recovery</option>
              <option value="Fortalecimento">Fortalecimento</option>
              <option value="Nutrição">Nutrição</option>
              <option value="Treinamento Mental">Treinamento Mental</option>
              <option value="Informações gerais">Informações gerais</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-primary">Mensagem</label>
            <Textarea 
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Conte-nos sobre sua experiência com corrida e seus objetivos..."
              className="mt-1 min-h-[120px]"
              required
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            variant="hero" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar mensagem'}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Ou fale conosco diretamente pelo WhatsApp
            </p>
            <Button 
              type="button"
              variant="whatsapp" 
              className="w-full"
              onClick={() => window.open('https://api.whatsapp.com/send?phone=5516996008849', '_blank')}
              disabled={isLoading}
            >
              <MessageCircle className="w-5 h-5" />
              Iniciar conversa no WhatsApp
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;