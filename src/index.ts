import dotenv from 'dotenv';
dotenv.config();

import { consumeMessage } from './services/consumer';


consumeMessage()