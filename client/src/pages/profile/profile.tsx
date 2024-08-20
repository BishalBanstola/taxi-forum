import React from 'react';

const mockUser = {
  id: 1,
  username: 'john_doe',
  email: 'john@example.com',
};

const mockSubscription = {
  expires: '2024-12-31',
  autoRenew: true,
};

export const Profile = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="md:max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <div className="mb-4">
            <p><strong>Username:</strong> {mockUser.username}</p>
            <p><strong>Email:</strong> {mockUser.email}</p>
          </div>
        </div>
      </div>
      
      <div className="md:max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-4">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Manage Subscription</h2>
          <p><strong>Subscription Expires:</strong> {mockSubscription.expires}</p>
          <p>{mockSubscription.autoRenew ? 'Your subscription auto renews. You can cancel it anytime.' : 'Your subscription does not auto renew.'}</p>
          <div className="mt-4">
            <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mr-4">Cancel Subscription</button>
            <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">Renew Subscription</button>
          </div>
        </div>
      </div>
    </div>
  );
};
