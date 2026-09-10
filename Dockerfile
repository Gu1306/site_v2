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

RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
EXPOSE 3000
CMD ["node", "server/index.mjs"]
