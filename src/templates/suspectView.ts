import { html } from "hono/html";
import { asc } from "drizzle-orm";
import { formatDistanceToNowStrict } from "date-fns";
import { db } from "../db";
import { suspect } from "../db/schema";

const getCountryFlag = (countryCode: string) => {
	if (!countryCode || countryCode.length !== 2) return "";
	return countryCode
		.toUpperCase()
		.split("")
		.map((char) => String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65))
		.join("");
};

export const suspectView = async () => {
	try {
		const userData = await db.query.suspect.findMany({
			columns: {
				id: true,
				nick: true,
				url: true,
				level: true,
				banned: true,
				suspended: true,
				lookupCount: true,
				countryCode: true, // 2 letter iso code for country
				accountCreated: true, // Date
			},
			limit: 100,
			orderBy: [asc(suspect.id)],
		});

		return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Data</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-50 min-h-screen">
        <div class="container mx-auto px-4 py-8">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Submitted User Profiles</h1>
            <p class="text-gray-600">Displaying ${userData.length} users</p>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nick</th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Age</th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lookups</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  ${userData.map(
										(user) => html`
                    <tr class="hover:bg-gray-50 transition-colors duration-150">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #${user.id}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${
													user.url
														? html`
                            <a
                              href="https://www.geoguessr.com${user.url}"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-150"
                            >
                              <div class="font-medium flex items-center gap-2">
                          <span>${user.nick}</span>
                          ${
														user.countryCode
															? html`<span class="text-lg" title="${user.countryCode}">${getCountryFlag(user.countryCode)}</span>`
															: ""
													}
                        </div>
                            </a>
                          `
														: html`<span class="text-gray-400">—</span>`
												}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Level ${user.level}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${
													user.banned
														? html`
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                              </svg>
                              Banned
                            </span>
                          `
														: user.suspended
															? html`
                              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                </svg>
                                Suspended
                              </span>
                            `
															: html`
                              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                </svg>
                                Active
                              </span>
                            `
												}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div class="flex flex-col">
                          <span class="font-medium">${formatDistanceToNowStrict(user.accountCreated)}</span>
                          ${
														user.accountCreated
															? html`<span class="text-xs text-gray-500">(${formatDistanceToNowStrict(user.accountCreated, { unit: "day" })})</span>`
															: ""
													}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span class="font-medium">${user.lookupCount}</span>
                      </td>
                    </tr>
                  `,
									)}
                </tbody>
              </table>
            </div>
          </div>

          ${
						userData.length === 0
							? html`
              <div class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4m-4 0H9m11 0a2 2 0 01-2 2H6a2 2 0 01-2-2 11 13V9a2 2 0 012-2h.01M20 13a2 2 0 012 2v.01" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                <p class="mt-1 text-sm text-gray-500">No user data available to display.</p>
              </div>
            `
							: ""
					}
        </div>
      </body>
    </html>
  `;
	} catch (e) {
		console.error(e);
		return html`<h1>error</h1>`;
	}
};
