# IKTHEES PARTNERS - Product Requirements Document

## Overview
IKTHEES PARTNERS is a venture capital firm website with a comprehensive admin backend for content management.

## User Personas
1. **Website Visitors** - Potential founders, investors, and industry professionals browsing the site
2. **Founders** - Startup founders submitting pitches
3. **Investors** - LPs and potential partners exploring opportunities
4. **Admin** - Content managers maintaining the website

## Core Requirements

### Public Website
- Homepage with hero, stats, portfolio preview, insights, CTAs
- About page (mission, philosophy, story, values)
- Investment Focus (stages, industries, check sizes)
- Portfolio showcase with sector filtering
- For Founders (criteria + pitch submission form)
- For Investors (partnership info, opportunities)
- Insights/News (articles with categories)
- Team page (members + advisors)
- Contact page (form submission)

### Admin Dashboard
- **Authentication**: JWT-based login with email/password
- **Dashboard**: Overview stats, recent contacts/pitches
- **Portfolio Management**: CRUD for companies, image upload, featured flag
- **Team Management**: CRUD for members/advisors, image upload
- **Insights Management**: CRUD for articles, publish/unpublish, categories
- **Contact Submissions**: View, read status, delete, reply via email
- **Pitch Submissions**: View, status updates (pending/reviewed/contacted/rejected), notes
- **Newsletter**: Subscriber list, export, delete
- **Settings**: Site statistics, company info, change password

## Implementation Status

### Completed (Dec 2025)
- [x] Full public website with all 9 pages
- [x] Dark theme Apple-inspired design
- [x] Responsive design with mobile navigation
- [x] Framer Motion animations
- [x] Admin login with JWT authentication
- [x] Admin dashboard with stats overview
- [x] Portfolio CRUD with image upload
- [x] Team CRUD with advisor support
- [x] Insights CRUD with publish control
- [x] Contact submissions management
- [x] Pitch submissions with status workflow
- [x] Newsletter subscriber management
- [x] Site settings management
- [x] Password change functionality
- [x] Company rebrand: ISCHUS LLC → IKTHEES PARTNERS

## Technical Stack
- Frontend: React 19 + Tailwind CSS + Shadcn/UI + Framer Motion
- Backend: FastAPI + MongoDB + Motor
- Auth: JWT with bcrypt password hashing
- Storage: Local file uploads for images

## Admin Credentials
- Email: admin@ikthees.com
- Password: Admin123!
- URL: /admin/login

## Prioritized Backlog

### P0 (Critical)
- None - Core functionality complete

### P1 (High Priority)
- [ ] Email notifications for new pitches/contacts
- [ ] Rich text editor for insights content
- [ ] Image optimization/compression

### P2 (Nice to Have)
- [ ] Multiple admin users with roles
- [ ] Analytics dashboard
- [ ] SEO meta tags management
- [ ] Social sharing images
- [ ] Bulk operations for submissions

## Next Tasks
1. Add email integration (SendGrid/Resend) for notifications
2. Implement rich text editor for insights
3. Add favicon and social meta tags
4. Add analytics tracking
