1) (برای افلاین واقعی) فایل‌های PDF.js را داخل پوشه vendor بگذار:
     npm pack pdfjs-dist@3.11.174
     tar -xzf pdfjs-dist-3.11.174.tgz
     cp package/build/pdf.min.js package/build/pdf.worker.min.js vendor/
   اگر این کار را نکنی، برنامه از CDN لود می‌کند (فقط با اینترنت).

2) کل پوشه را روی یک هاست استاتیک با HTTPS بگذار (GitHub Pages / Netlify / Cloudflare Pages).
   برای تست محلی:  python -m http.server 8000  و باز کردن http://localhost:8000

3) روی هر دیوایس آدرس را باز کن و Install / Add to Home Screen بزن.
