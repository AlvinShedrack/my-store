const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();

app.use(express.static('public'));
app.use(express.json());

// Cloudinary config
cloudinary.config({
  cloud_name: 'dpsao38cv',
  api_key: '567278857625978',
  api_secret: 'RA0t08BgAxCHk9sUtyEUVW5ZZlA'
});

// login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  res.json({ success: username === 'admin' && password === '1234' });
});

// storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'documents',
      resource_type: 'raw',
      public_id: file.originalname,
      access_mode: 'public'
    };
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ success: true, url: req.file.path });
});

app.get('/files', async (req, res) => {
  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: 'documents',
    resource_type: 'raw'
  });

  const files = result.resources.map(file => file.secure_url);
  res.json(files);
});

app.listen(3000, () => console.log('Server running http://localhost:3000'));