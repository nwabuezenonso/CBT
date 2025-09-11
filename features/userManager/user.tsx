import React from "react";
import { Users } from "lucide-react";

export const User = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">User Management</h2>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">User Management</h3>
          <p className="text-gray-500">Manage examinees, proctors, and admin users</p>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add User
          </button>
        </div>
      </div>
    </div>
  );
};


export default User