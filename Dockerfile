FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# O Railway entrega as variáveis do serviço como build args. Sem declarar o ARG
# aqui, elas não chegam ao `npm run build` e o Vite compila como se não
# existissem — a página nasce funcionando "errado" em silêncio, sem erro nenhum.
ARG VITE_AGENDAMENTO_FORTALECIMENTO_API=""
ENV VITE_AGENDAMENTO_FORTALECIMENTO_API=$VITE_AGENDAMENTO_FORTALECIMENTO_API
# Google Ads (landing pages /lp/*). Vazio = a tag não é carregada.
ARG VITE_GOOGLE_TAG_ID=""
ENV VITE_GOOGLE_TAG_ID=$VITE_GOOGLE_TAG_ID
ARG VITE_GOOGLE_ADS_SEND_TO_WHATSAPP=""
ENV VITE_GOOGLE_ADS_SEND_TO_WHATSAPP=$VITE_GOOGLE_ADS_SEND_TO_WHATSAPP
ARG VITE_GOOGLE_ADS_SEND_TO_AGENDAR=""
ENV VITE_GOOGLE_ADS_SEND_TO_AGENDAR=$VITE_GOOGLE_ADS_SEND_TO_AGENDAR

RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
EXPOSE 3000
CMD ["node", "server/index.mjs"]
