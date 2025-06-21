import { html } from "hono/html";
import env from "../../env";

export const signupPage = () =>
	html`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Signup</title>
    <script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.5/dist/htmx.min.js" integrity="sha384-t4DxZSyQK+0Uv4jzy5B0QyHyWQD2GFURUmxKMBVww9+e2EJ0ei/vCvv7+79z0fkr" crossorigin="anonymous"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            animation: {
              "fade-in": "fadeIn 0.5s ease-in-out",
              "slide-up": "slideUp 0.3s ease-out",
            },
          },
        },
      };
    </script>
    <style>
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes slideUp {
        from {
          transform: translateY(10px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    </style>
  </head>
  <body class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div
      class="absolute inset-0 bg-white/30 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
    ></div>

    <div
      class="relative min-h-screen flex items-center justify-center px-4 py-12"
    >
      <div class="w-full max-w-md animate-fade-in">
        <div class="text-center mb-8">
          <div
            class="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4"
          >
            <svg
              class="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              ></path>
            </svg>
          </div>
          <p class="text-gray-600 mt-2">${env.ALLOW_SIGNUP ? "Register your account" : "Signups are closed"}</p>
        </div>

        <div
          class="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20"
        >
          <form
            hx-post="/api/auth/sign-up/email"
            hx-target="#login-response"
            hx-indicator="#loading"
            class="space-y-6"
          >

          <div class="animate-slide-up">
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </label>
              <div class="relative">
                <input
                  type="text"
                  ${env.ALLOW_SIGNUP ? "" : "disabled"}
                  id="name"
                  name="name"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div class="animate-slide-up">
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </label>
              <div class="relative">
                <input
                  type="email"
                  ${env.ALLOW_SIGNUP ? "" : "disabled"}
                  id="email"
                  name="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your email"
                />
                <div
                  class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                >
                  <svg
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="animate-slide-up" style="animation-delay: 0.1s">
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div class="relative">
                <input
                  type="password"
                  ${env.ALLOW_SIGNUP ? "" : "disabled"}
                  id="password"
                  name="password"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
                <div
                  class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                >
                  <svg
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="animate-slide-up" style="animation-delay: 0.3s">
              <button
                ${env.ALLOW_SIGNUP ? "" : "disabled"}
                type="submit"
                class="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform disabled:cursor-not-allowed"
              >
                <span id="button-text">Sign Up</span>
                <svg
                  id="loading"
                  class="hidden animate-spin ml-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </button>
            </div>
          </form>

          <div id="login-response" class="mt-4"></div>


          </div>
        </div>
      </div>
    </div>

    <script>
      document.addEventListener("htmx:beforeRequest", function (evt) {
        document.getElementById("loading").classList.remove("hidden");
        document.getElementById("button-text").textContent = "Signing up...";
      });

      document.addEventListener("htmx:afterRequest", function (evt) {
        document.getElementById("loading").classList.add("hidden");
        document.getElementById("button-text").textContent = "Sign Up";
      });
    </script>
  </body>
</html>
`;
