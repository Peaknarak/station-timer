import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { bindSocket } from './socket.js';
import crypto from 'node:crypto';

const PORT = Number(process.env.PORT || 4000);
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const SIGNING_SECRET = process.env.SIGNING_SECRET || 'dev-secret';

const app = express();
if (NODE_ENV === 'production') app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));

function sign(id: string) {
  return crypto.createHmac('sha256', SIGNING_SECRET).update(id).digest('hex');
}

app.get('/api/hello', (req, res) => {
  let clientId = req.cookies['st_clientId'];
  if (!clientId) {
    clientId = crypto.randomUUID();
    const clientSig = sign(clientId);
    res.cookie('st_clientId', clientId, {
      httpOnly: true,
      sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
      secure: NODE_ENV === 'production'
    });
    res.cookie('st_clientSig', clientSig, {
      httpOnly: true,
      sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
      secure: NODE_ENV === 'production'
    });
    return res.json({ clientId, clientSig });
  } else {
    const clientSig = sign(clientId);
    res.cookie('st_clientSig', clientSig, {
      httpOnly: true,
      sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
      secure: NODE_ENV === 'production'
    });
    return res.json({ clientId, clientSig });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: CORS_ORIGIN, credentials: true },
  transports: ['websocket'] // reduce CORS edge
});

// handshake auth from cookies (via query fallback for dev)
io.use((socket, next) => {
  try {
    const clientId = socket.handshake.auth?.clientId || socket.handshake.headers['x-client-id'];
    if (!clientId || typeof clientId !== 'string') return next(new Error('E_INVALID_PAYLOAD'));
    socket.handshake.auth.clientId = clientId;
    next();
  } catch (e) {
    next(e as any);
  }
});

bindSocket(io);

server.listen(PORT, () => {
  console.log(`backend listening on :${PORT}`);
});
