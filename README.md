# CareFit Run Base

Site institucional para CareFit Run Base - sua jornada de corrida personalizada.

## 🚀 Deploy no Render

Este projeto está configurado para deploy automático no Render com:

### Frontend (React + Vite)
- Build estático servido via CDN
- Domínio personalizado: `carefitrunbase.com.br`
- Cache otimizado para assets

### Backend (Node.js + Express)
- API RESTful para contatos e agendamentos
- Integração com Google Calendar
- Banco PostgreSQL
- Rate limiting e segurança

### Banco de Dados (PostgreSQL)
- Tabelas: contacts, appointments, analytics_events
- Backups automáticos
- SSL/TLS encryption

## 🔧 Configuração Local

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd api
npm install
npm run dev
```

## 📁 Estrutura do Projeto

```
├── src/                 # Frontend React
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Páginas do site
│   ├── services/        # APIs e integrações
│   └── hooks/           # React hooks customizados
├── api/                 # Backend Node.js
│   ├── routes/          # Rotas da API
│   ├── database/        # Schema e migrações
│   └── server.js        # Servidor principal
└── render.yaml          # Configuração Render
```

## 🌟 Funcionalidades

- ✅ Site institucional responsivo
- ✅ Formulário de contato funcional
- ✅ Integração WhatsApp
- ✅ Sistema de agendamento (Google Calendar)
- ✅ Analytics e tracking
- ✅ SEO otimizado
- ✅ SSL/HTTPS automático

## 🔑 Variáveis de Ambiente

### Backend (Render)
```
DATABASE_URL=postgres://...
EMAIL_USER=contato@carefitrunbase.com.br
EMAIL_PASSWORD=app_password_gmail
GOOGLE_CLIENT_EMAIL=service@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
GOOGLE_CALENDAR_ID=calendar_id@gmail.com
```

## 📞 Suporte

Entre em contato via WhatsApp: (11) 99999-9999

---

## Original Lovable Info

**URL**: https://lovable.dev/projects/c40bc565-d527-41f3-9cde-7c3c22c09d8f

### Technologies
- Vite + TypeScript
- React + shadcn-ui  
- Tailwind CSS