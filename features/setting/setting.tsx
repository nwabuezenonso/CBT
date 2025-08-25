import React from 'react'

 export const RenderSettings = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Exam Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Default Exam Duration (minutes)
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                defaultValue="60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Questions per Page</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>1</option>
                <option>5</option>
                <option>10</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="shuffle" defaultChecked />
              <label htmlFor="shuffle" className="text-sm">
                Shuffle questions by default
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="timer" defaultChecked />
              <label htmlFor="timer" className="text-sm">
                Show timer during exam
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="proctoring" />
              <label htmlFor="proctoring" className="text-sm">
                Enable webcam proctoring
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="lockdown" />
              <label htmlFor="lockdown" className="text-sm">
                Browser lockdown mode
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="plagiarism" />
              <label htmlFor="plagiarism" className="text-sm">
                Plagiarism detection
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Login Attempts</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                defaultValue="3"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="email-results" defaultChecked />
              <label htmlFor="email-results" className="text-sm">
                Email results to examinees
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="admin-alerts" defaultChecked />
              <label htmlFor="admin-alerts" className="text-sm">
                Admin alerts for suspicious activity
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="completion-notify" />
              <label htmlFor="completion-notify" className="text-sm">
                Notify when exam is completed
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">System Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">System Language</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>English</option>
                <option>French</option>
                <option>Spanish</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Timezone</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>WAT (West Africa Time)</option>
                <option>GMT (Greenwich Mean Time)</option>
                <option>UTC (Coordinated Universal Time)</option>
              </select>
            </div>
            <button className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );

