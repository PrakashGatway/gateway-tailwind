export default function Loader() {

  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="loader-inner">
          <img
            src="/img/favicon.png"
            alt="Gateway Abroad"
            className="loader-logo"
            loading="eager" // Preload image
          />
        </div>

        <div className="loader-spinner"></div>
      </div>

      <style jsx>{`
        .loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #ffffff5d);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          animation: fadeIn 0.6s ease-out;
        }

        .loader-container {
          position: relative;
          width: 70px;
          height: 70px;
          animation: float 3s ease-in-out infinite;
        }

        .loader-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 4px 20px rgba(0, 86, 179, 0.15);
          border: 2px solid #D41833;
          z-index: 2;
          animation: pulse 2s ease-in-out infinite;
        }

        .loader-logo {
          width: 36px;
          height: auto;
          border-radius: 50%;
          transition: transform 0.3s ease;
        }

        .loader-logo:hover {
          transform: scale(1.1);
        }

        .loader-spinner {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 4px solid transparent;
          border-top: 4px solid #D41833;
          border-radius: 50%;
          animation: spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          box-shadow: 0 0 15px rgba(0, 86, 179, 0.1);
          z-index: 1;
        }

        /* Secondary ring for depth */
        .loader-spinner::before {
          content: '';
          position: absolute;
          top: -6px;
          left: -6px;
          right: -6px;
          bottom: -6px;
          border: 2px solid transparent;
          border-bottom: 2px solid #4a90e2;
          border-radius: 50%;
          animation: spin 2s linear reverse infinite;
          opacity: 0.6;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 4px 20px rgba(0, 86, 179, 0.15);
          }
          50% {
            box-shadow: 0 6px 25px rgba(0, 86, 179, 0.25);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Responsive: Smaller on mobile */
        @media (max-width: 768px) {
          .loader-container {
            width: 60px;
            height: 60px;
          }
          .loader-inner {
            width: 44px;
            height: 44px;
          }
          .loader-logo {
            width: 32px;
          }
        }
      `}</style>
    </div>
  );
}