# Linkup - Real-Time Chat App

Linkup is a real-time chat application designed to help you connect with like-minded people, join communities, and engage in private conversations. Built using WebSocket for seamless communication, Linkup prioritizes security and user-friendly design.

## Features

- **Connect with Like-Minded People**: Discover and connect with individuals who share similar interests.
- **Join Communities**: Participate in various public or private communities based on your interests.
- **Private Chat**: Send private messages to friends or colleagues with end-to-end encryption.
- **Security**: Your conversations are secure with industry-standard encryption, ensuring your privacy.

## Technologies Used

### Frontend
- **Next.js**: A React framework for building fast and scalable web applications.
- **Tailwind CSS**: A utility-first CSS framework for creating modern designs.
- **ShadCN**: A UI component library for React to enhance design consistency.

### Backend
- **Node.js**: JavaScript runtime environment for building scalable network applications.
- **Express**: Fast, unopinionated web framework for Node.js.
- **WebSocket**: A protocol for real-time communication between client and server.

## Getting Started

### Prerequisites

- Node.js installed on your local machine.
- A code editor (VSCode is recommended).

### Setup

#### 1. Clone the repository:

```bash
git clone https://github.com/peekeah/linkup.git
```

#### 2. Set up the Backend

1. Navigate to the backend directory:

   ```bash
   cd linkup/backend
   ```

2. Copy the `.env.example` file to `.env` and replace the environment variables with your own:

   ```bash
   cp .env.example .env
   ```

   (Make sure to update the variables inside `.env` according to your setup.)

3. Install dependencies for the backend:

   ```bash
   npm install
   ```

4. Start the backend server:

   ```bash
   npm run dev
   ```

   The backend API will be running at `http://localhost:5000` by default, or at the port specified in your environment configuration.

#### 3. Set up the Frontend

1. Open a new terminal window and navigate to the frontend directory:

   ```bash
   cd linkup/frontend
   ```

2. Copy the `.env.example` file to `.env` and replace the environment variables with your own:

   ```bash
   cp .env.example .env
   ```

   (Make sure to update the variables inside `.env` according to your setup.)

3. Install dependencies for the frontend:

   ```bash
   npm install
   ```

4. Start the frontend application:

   ```bash
   npm run dev
   ```

   The frontend application should now be running on `http://localhost:3000`.

### Running the App

1. Open your browser and navigate to `http://localhost:3000` to access the frontend.
2. The backend API will be running at `http://localhost:5000` by default, or at the port specified in your environment configuration.

## Known Issues & Limitations

### Recently Resolved Issues ✅
The following issues have been identified and fixed:

- **Private Chat Query Bug**: Fixed `getPrivateChats()` to return both sent and received messages for complete conversation history
- **Message Storage Separation**: Implemented proper separation between community and private messages using distinct storage maps
- **Real-time DM Delivery**: Implemented real-time private message broadcasting to online recipients
- **Search Data Exposure**: Added select clause to `searchUser()` to prevent sensitive data exposure
- **UI State Management**: Fixed infinite loop risks in useEffect dependencies and sidebar tab active states
- **Fake Chat Objects**: Removed client-side synthetic chat creation to prevent conflicts with server-side records

### Current Status
All major functionality is working correctly:
- ✅ Real-time community chat with upvotes
- ✅ Private messaging with real-time delivery
- ✅ User search and community discovery
- ✅ Secure authentication and authorization
- ✅ Proper data separation and state management

## Contributing

If you'd like to contribute to Linkup, feel free to fork the repository and submit pull requests. We welcome contributions that improve the app's functionality, security, and user experience.

## Special Thanks

A huge thank you to the following people who contributed to the UI design and helped make this project better:


- <a href="https://www.linkedin.com/in/shrenaath-sg-91245019a" target="_blank">Shrenaath SG</a> for their awesome UI design contributions.<br />
- <a href="https://www.linkedin.com/in/niraj-chafle" target="_blank">Niraj chafle</a> for providing great design feedback and ideas.
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

