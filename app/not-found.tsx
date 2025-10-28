"use client"
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ padding: '100px 20px', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <style jsx>{`
        .not-found-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          background-color: #fff; /* Adjust background color as needed */
        }
        .error-code {
          font-size: 4rem;
          font-weight: bold;
          color: #e74c3c; /* Adjust color as needed */
          margin-bottom: 1rem;
        }
        .error-message {
          font-size: 1.5rem;
          margin-bottom: 2rem;
          color: #333; /* Adjust color as needed */
        }
        .home-link {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff; /* Adjust color as needed */
          color: white;
          text-decoration: none;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }
        .home-link:hover {
          background-color: #0056b3; /* Adjust hover color as needed */
        }
      `}</style>

      <div className="not-found-">
        <div className="error-code">404</div>
        <h1 className="error-message">Oops! Page Not Found</h1>
        <p>
          Sorry, the page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link href="/" className="home-link">
          Go back home
        </Link>
      </div>
    </div>
  );
}