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
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["sh", "-c", "serve -s dist -l tcp://0.0.0.0:${PORT:-3000}"]
