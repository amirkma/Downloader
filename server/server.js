const express = require('express');
const ytdlp = require('yt-dlp-exec');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('client')); // سرو کردن فایل‌های فرونت‌اند

app.post('/download', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'لینک وارد نشده است' });
  }

  try {
    // تنظیمات عمومی برای yt-dlp
    const options = {
      format: 'bestaudio/best[acodec!=none]/best', // بهترین کیفیت صوت یا ویدیو
      extractAudio: url.includes('spotify.com') || url.includes('soundcloud.com'), // فقط برای صوت
      audioFormat: 'mp3', // خروجی به فرمت MP3
      output: '%(title)s.%(ext)s', // نام فایل
      noCheckCertificate: true, // دور زدن مشکلات SSL
      addHeader: ['Referer:https://www.pornhub.com', 'User-Agent:Mozilla/5.0'], // هدرها برای پورن‌هاب
      cookies: './cookies.txt' // برای اینستاگرام (اختیاری، برای اکانت‌های خصوصی)
    };

    // اجرای yt-dlp برای استخراج اطلاعات
    const info = await ytdlp(url, options);

    if (!info.url) {
      throw new Error('لینک دانلود پیدا نشد');
    }

    res.json({
      downloadUrl: info.url,
      title: info.title || 'دانلود',
      extractor: info.extractor || 'unknown'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `خطا: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`سرور در پورت ${port} اجرا می‌شود`);
});