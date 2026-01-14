# SmartSender - University Staff Media Sharing Platform

## Project Overview

**SmartSender** is a secure, professional platform designed to replace informal communication channels (WhatsApp, Facebook, etc.) for official university staff communication and file sharing. It provides a centralized, secure, and institutional solution for sharing documents, media, and official communications across departments and staff members.

## Problem Statement

### Current Challenges in University Staff Communication:

1. **Unprofessional Communication Channels**
   - Staff rely on personal social media platforms (WhatsApp, Facebook) for official communications
   - Lack of professional archive and accountability
   - Personal information mixed with institutional communications

2. **Security & Data Privacy Concerns**
   - Sensitive institutional documents shared on unsecured platforms
   - No control over data retention and deletion
   - Risk of data breaches and unauthorized access
   - GDPR/Data protection compliance issues

3. **Lack of Centralization**
   - Information scattered across multiple platforms
   - Difficult to track official communications
   - Inconsistent record-keeping for audit trails
   - Inefficient file organization

4. **Access Control Issues**
   - No role-based access control
   - Difficulty managing permissions across departments
   - Unintended information leaks

5. **Compliance & Governance**
   - No institutional control over communication records
   - Difficulty meeting regulatory requirements
   - Limited audit trails for official documents

## Solution: SmartSender

SmartSender provides:

- ✅ **Secure Platform** - End-to-end encrypted file sharing
- ✅ **Role-Based Access** - Department and staff-level permissions
- ✅ **Centralized Management** - All institutional communications in one place
- ✅ **Audit Trails** - Complete record of file sharing and communications
- ✅ **Professional Interface** - Modern, institutional design
- ✅ **Data Privacy** - Compliance with institutional and regulatory standards
- ✅ **Easy Integration** - Simple staff onboarding and management

## Features

### Core Features
- Secure file upload and download
- Department-based file organization
- Staff member directory and management
- Real-time file activity dashboard
- User authentication and authorization
- File versioning and history

### Security Features
- End-to-end encryption
- Role-based access control (RBAC)
- Secure password authentication
- Session management
- Activity logging and audit trails

## Technology Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Font**: JetBrains Mono (professional monospace font)
- **Build Tool**: Vite
- **Animation**: Framer Motion

## Getting Started

### Prerequisites
- Node.js & npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd smartsender

# Step 3: Install dependencies
npm i

# Step 4: Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── layout/         # Layout components (Sidebar, Dashboard)
│   ├── ui/             # UI components (buttons, cards, etc.)
│   ├── feedback/       # Feedback components (spinners, empty states)
│   └── features/       # Feature-specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── api/                # API integration layer
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── mockdata/           # Mock data for development
└── routes/             # Route configuration
```

## Development

### Available Scripts

```sh
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Contributing

When contributing to SmartSender:

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Write meaningful commit messages
4. Test your changes locally before pushing
5. Ensure all components are properly documented

## Deployment

SmartSender is built with Vite and can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Your institution's servers

## License

This project is proprietary to the University. All rights reserved.

## Support

For issues, feature requests, or questions about SmartSender, please contact the development team.

---

**SmartSender** - Bringing professionalism and security to university staff communications.

- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS