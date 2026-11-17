import "./globals.css";
import Nav from "../components/Nav";

export const metadata = {
  title: "CIS 1600 Midterm 2",
  description: "Practice problems, a timed mock, flashcards, and labs for CIS 1600 Midterm 2.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap"
        />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <footer className="foot">
          <div className="wrap">
            Problems and solutions are original practice in the style of the course. Check them against your lecture notes.
            Progress stays in this browser.
          </div>
        </footer>
      </body>
    </html>
  );
}
