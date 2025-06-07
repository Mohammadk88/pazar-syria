# Copilot Instructions for PazarSY (بازار سوريا)

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
PazarSY (بازار سوريا) is a comprehensive classified ads platform targeting the Syrian market. It's built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Key Features
- Multi-language support (Arabic, English, Turkish, French, Kurdish)
- User authentication and profiles (personal/company)
- Ad management (real estate, cars, and future categories)
- Reviews and ratings system
- Admin dashboard
- Responsive design with modern UI/UX

## Development Guidelines

### Language Support
- Use Arabic (ar) as the primary language with RTL support
- Support 5 languages: ar, en, tr, fr, ku
- Constants/UI text should be translatable, content remains in original language
- Use Cairo font for Arabic and equivalent fonts for other languages

### Styling Guidelines
- Primary colors: sky-600 (#0284c7), secondary: gray-200
- Use Tailwind CSS with consistent spacing and typography
- Implement RTL support for Arabic and Kurdish
- Mobile-first responsive design

### Database Schema
- Users with profiles (personal/company/admin)
- Categories with multi-language names
- Ads with properties, media, and location data
- Reviews and ratings system
- Favorites functionality

### Code Standards
- Use TypeScript for type safety
- Follow Next.js App Router conventions
- Implement proper error handling
- Use Zustand for state management
- Prisma for database operations

### UI/UX Requirements
- Modern, attractive, and innovative design
- Excellent user experience
- Fast loading times
- Intuitive navigation
- Accessible design principles

### Security
- Proper authentication and authorization
- Input validation and sanitization
- File upload security
- Rate limiting for API endpoints

When generating code, prioritize:
1. Clean, maintainable TypeScript code
2. Responsive design with Tailwind CSS
3. Accessibility and internationalization
4. Performance optimization
5. Security best practices
