# GabungGambar

GabungGambar is a lightweight image-to-PDF tool built for Indonesian search intent.

Live site: [www.gabunggambar.org](https://www.gabunggambar.org/)

## What it does

GabungGambar helps users:

- merge multiple images into one PDF
- reorder pages before export
- convert JPG, PNG, and WEBP in the browser
- use a mobile-friendly flow without signup
- merge 2 images into 1 PNG when they do not need PDF

## Main pages

- [Gabung file gambar ke PDF](https://www.gabunggambar.org/)
- [Gambar ke PDF](https://www.gabunggambar.org/gambar-ke-pdf/)
- [Gabung foto jadi PDF](https://www.gabunggambar.org/gabung-foto-jadi-pdf/)
- [Gabung 2 gambar jadi 1](https://www.gabunggambar.org/gabung-2-gambar/)
- [JPG ke PDF](https://www.gabunggambar.org/jpg-ke-pdf/)
- [PNG ke PDF](https://www.gabunggambar.org/png-ke-pdf/)
- [Foto ke PDF dari HP](https://www.gabunggambar.org/foto-ke-pdf-dari-hp/)
- [Ubah gambar jadi PDF tanpa aplikasi](https://www.gabunggambar.org/ubah-gambar-jadi-pdf-tanpa-aplikasi/)

## Why this project exists

Most users searching phrases like `gabung file gambar` do not want a large PDF suite.
They want a fast way to turn several photos into one clean PDF, especially on mobile.

This project focuses on that narrow workflow first, then expands with closely related long-tail pages.

## Stack

- static HTML, CSS, and JavaScript
- client-side PDF generation with `jsPDF`
- Vercel deployment
- Cloudflare DNS and apex-to-www redirect

## Deployment notes

1. Push the repo to GitHub.
2. Import it into Vercel as a static site.
3. Set `www.gabunggambar.org` as the primary production domain in Vercel.
4. Add a Cloudflare redirect rule from `https://gabunggambar.org/*` to `https://www.gabunggambar.org/$1` with `308`.
5. Submit `https://www.gabunggambar.org/sitemap.xml` to Google Search Console.

## Contact

- Contact page: [www.gabunggambar.org/kontak/](https://www.gabunggambar.org/kontak/)
- GitHub repo: [daanaagua/gabung-gambar](https://github.com/daanaagua/gabung-gambar)
