# 🚀 Guia de Deploy - CareFit Run Base no Render

## 1. Preparação das Contas

### Render Account
1. Criar conta em [render.com](https://render.com)
2. Conectar repositório GitHub

### Google Workspace
1. Ativar Google Calendar API
2. Criar service account
3. Baixar credenciais JSON
4. Compartilhar calendário com service account

### Gmail App Password
1. Ativar 2FA na conta Gmail
2. Gerar senha de aplicativo
3. Usar para autenticação SMTP

## 2. Deploy Automático via render.yaml

### Passo 1: Commit do Código
```bash
git add .
git commit -m "Configure Render deployment"
git push origin main
```

### Passo 2: Conectar no Render
1. Dashboard Render → "New" → "Blueprint"
2. Conectar repositório GitHub
3. O `render.yaml` será detectado automaticamente
4. Configurar variáveis de ambiente

## 3. Configuração de Variáveis de Ambiente

### No Render Dashboard:
```env
# Email
EMAIL_USER=contato@carefitrunbase.com.br
EMAIL_PASSWORD=sua_senha_de_aplicativo_gmail

# Google Calendar
GOOGLE_CLIENT_EMAIL=service-account@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA\n-----END PRIVATE KEY-----
GOOGLE_CALENDAR_ID=seu-calendario-id@gmail.com
```

## 4. Configuração do Banco de Dados

### Executar Schema Inicial
```bash
# Conectar ao banco PostgreSQL no Render
psql $DATABASE_URL -f api/database/schema.sql
```

## 5. Configuração do Domínio

### DNS no Google Domains
```
Tipo: A
Nome: @
Valor: [IP do Render fornecido no dashboard]

Tipo: A  
Nome: www
Valor: [IP do Render fornecido no dashboard]
```

### No Render Dashboard
1. Frontend service → Settings → Custom Domains
2. Adicionar `carefitrunbase.com.br`
3. Adicionar `www.carefitrunbase.com.br`
4. Aguardar verificação SSL (até 24h)

## 6. Teste Final

### Verificar Funcionamento:
- [ ] Site carregando em carefitrunbase.com.br
- [ ] Formulário de contato enviando emails
- [ ] API respondendo em /health
- [ ] Banco de dados conectado
- [ ] WhatsApp funcionando
- [ ] SSL/HTTPS ativo

## 7. Monitoramento

### Logs do Render:
- Frontend: Build logs e deploy status
- Backend: Server logs e erros
- Database: Connection status

### Google Calendar:
- Verificar se service account tem acesso
- Testar criação de eventos via API

## 8. Manutenção

### Updates Automáticos:
- Pushes para `main` fazem deploy automático
- Rollback disponível no dashboard
- Backups automáticos do banco

### Custos Aproximados:
- Frontend: Gratuito (static site)
- Backend: $7/mês (starter plan)
- Database: $7/mês (starter plan)
- **Total: ~$14/mês**

---

## 🆘 Troubleshooting

### Erro de Build
```bash
# Verificar logs no Render dashboard
# Corrigir e fazer novo push
```

### Erro de Email
```
# Verificar app password Gmail
# Confirmar EMAIL_USER e EMAIL_PASSWORD
```

### Erro Google Calendar
```
# Verificar service account JSON
# Confirmar GOOGLE_PRIVATE_KEY formatação
# Testar acesso manual ao calendário
```

### Erro de Banco
```
# Verificar DATABASE_URL
# Executar schema.sql novamente
# Verificar conexão PostgreSQL
```

## 📞 Suporte
Em caso de problemas, consulte:
- [Render Docs](https://render.com/docs)
- Logs no dashboard do Render
- WhatsApp: (11) 99999-9999