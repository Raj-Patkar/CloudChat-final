const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { Storage } = require('@google-cloud/storage');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static('public'));

app.use(express.json());

// Multer config for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
});

// GCP Storage setup
const storage = new Storage({
  keyFilename: path.join(__dirname, 'key.json'),
  projectId: 'deep-wares-462607-b4',
});

const bucket = storage.bucket('clouddrive');

// ✅ Upload route
app.post('/api/files/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded');

    const blob = bucket.file(Date.now() + '_' + req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      console.error(err);
      res.status(500).send('Upload error');
    });

    blobStream.on('finish', async () => {
      // Make the file public OR use signed URL
      //await blob.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      res.status(200).json({ url: publicUrl });
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ✅ List files route
app.get('/api/files/list', async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    const fileList = files.map((file) => ({
      name: file.name,
      url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
    }));
    res.json(fileList);
  } catch (err) {
    console.error(err);
    res.status(500).send('Could not list files');
  }
});

// ✅ Serve frontend if needed
// app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
