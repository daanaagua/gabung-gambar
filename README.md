# GabungGambar

Static SEO tool site for `www.gabunggambar.org`.

## Pages

- `/` - main landing page for `gabung file gambar`
- `/gambar-ke-pdf/`
- `/gabung-foto-jadi-pdf/`
- `/gabung-2-gambar/`
- `/jpg-ke-pdf/`
- `/png-ke-pdf/`
- `/foto-ke-pdf-dari-hp/`
- `/ubah-gambar-jadi-pdf-tanpa-aplikasi/`

## Deploy

1. Push this directory to GitHub.
2. Import the repo into Vercel as a static site.
3. Set `www.gabunggambar.org` as the primary production domain in Vercel.
4. Add a Cloudflare redirect rule to send `https://gabunggambar.org/*` to `https://www.gabunggambar.org/$1` with `308`.
5. Submit `https://www.gabunggambar.org/sitemap.xml` to Google Search Console.
