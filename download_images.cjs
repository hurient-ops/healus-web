
const fs = require('fs');
const https = require('https');
const path = require('path');

const images = {
  'hero_home_2.jpg': 'https://image.pollinations.ai/prompt/sophisticated%20medical%20data%20dashboard%20on%20tablet%20photorealistic?width=2000&height=1000&nologo=true',
  'doctor.jpg': 'https://image.pollinations.ai/prompt/friendly%20asian%20doctor%20explaining%20health%20data%20on%20tablet%20photorealistic?width=1000&height=800&nologo=true',
  'type2.jpg': 'https://image.pollinations.ai/prompt/active%20middle%20aged%20asian%20couple%20walking%20in%20park%20photorealistic?width=1000&height=800&nologo=true',
  'diet_hero.jpg': 'https://image.pollinations.ai/prompt/fresh%20healthy%20mediterranean%20salad%20bowl%20on%20wooden%20table%20photorealistic?width=2000&height=1000&nologo=true',
  'diet_1.jpg': 'https://image.pollinations.ai/prompt/colorful%20fresh%20vegetables%20and%20greens%20photorealistic?width=1000&height=800&nologo=true',
  'diet_2.jpg': 'https://image.pollinations.ai/prompt/healthy%20whole%20grains%20and%20complex%20carbs%20photorealistic?width=1000&height=800&nologo=true',
  'pump_hero.jpg': 'https://image.pollinations.ai/prompt/active%20person%20running%20with%20wearable%20health%20tech%20photorealistic?width=2000&height=1000&nologo=true',
  'comp_hero.jpg': 'https://image.pollinations.ai/prompt/healthy%20feet%20walking%20in%20nature%20photorealistic?width=2000&height=1000&nologo=true',
  'comp_eye.jpg': 'https://image.pollinations.ai/prompt/close%20up%20of%20clear%20healthy%20human%20eye%20photorealistic?width=1000&height=800&nologo=true',
  'comp_kidney.jpg': 'https://image.pollinations.ai/prompt/glass%20of%20pure%20water%20splashing%20photorealistic?width=1000&height=800&nologo=true',
  'comp_nerve.jpg': 'https://image.pollinations.ai/prompt/comfortable%20running%20shoes%20on%20grass%20photorealistic?width=1000&height=800&nologo=true',
  'signup_1.jpg': 'https://image.pollinations.ai/prompt/healthy%20lifestyle%20fitness%20concept%20photorealistic?width=2000&height=2000&nologo=true',
  'signup_2.jpg': 'https://image.pollinations.ai/prompt/peaceful%20yoga%20meditation%20outdoors%20photorealistic?width=1000&height=1000&nologo=true'
};

const dir = path.join(__dirname, 'public', 'images');

const download = (filename, url) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(filename, res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        console.log('Failed:', filename, res.statusCode);
        return resolve();
      }
      const file = fs.createWriteStream(path.join(dir, filename));
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Downloaded:', filename);
        resolve();
      });
    }).on('error', (err) => {
      console.log('Error:', filename, err.message);
      resolve();
    });
  });
};

const run = async () => {
  for (const [filename, url] of Object.entries(images)) {
    if (!fs.existsSync(path.join(dir, filename))) {
      await download(filename, url);
      await new Promise(r => setTimeout(r, 2000)); // wait 2 seconds between requests
    }
  }
  console.log('All downloads completed');
};

run();

