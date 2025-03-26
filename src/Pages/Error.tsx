const ErrorPage = () => {
  return (
      <div className="min-h-screen bg-zinc-50 mx-auto dark:bg-zinc-900 flex items-center justify-center p-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full opacity-20 animate-float"></div>
          <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full opacity-20 animate-float-delayed"></div>
        </div>

        <div className="relative z-10 text-center max-w-2xl">
          {/* Glowing 404 number */}
          <div className="relative inline-block">
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 dark:from-purple-500 dark:to-blue-600 animate-float">
              404
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 dark:from-purple-500 dark:to-blue-600 rounded-full blur-2xl opacity-30 -z-10"></div>
          </div>

          {/* Error message */}
          <h2 className="mt-8 text-3xl font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
            Oops! Lost in the Void
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            The page you're looking for has been sucked into a black hole. <br />
            Don't worry, we'll beam you back safely.
          </p>

          {/* Home button with hover effect */}
          <button
              onClick={() => window.history.back()}
              className="relative inline-flex items-center px-8 py-4 bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg font-semibold
                    hover:scale-105 transform transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <span className="mr-2">🚀</span>
            Back to Safety
            <div className="absolute inset-0 rounded-lg border-2 border-purple-400 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* Floating astronaut */}
          <div className="absolute -right-20 -bottom-20 opacity-10 dark:opacity-5 animate-float-delayed">
            <svg
                className="w-64 h-64"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              {/* Astronaut SVG path */}
            </svg>
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-glow"></div>
        </div>
      </div>
  );
};

export default ErrorPage;