const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connecté à Atlas !'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));
