#  Mrutyunjaya Muduli - Space Portfolio

A stunning 3D space-themed portfolio website featuring advanced Three.js graphics, interactive animations, and a complete backend system for contact form management.

##  Features

- **3D Space Background**: Advanced Three.js scene with procedural nebulae, particle systems, and animated objects
- **Responsive Design**: Mobile-first design with glass morphism effects
- **Database Integration**: SQLite database for contact form storage
- **Professional Content**: Real astronomical research experience and projects
- **Interactive Animations**: GSAP-powered scroll animations and effects
- **Contact Management**: Backend API for handling contact submissions
- **Security**: Rate limiting, input validation, and XSS protection

##  Tech Stack

### Frontend
- HTML5 & CSS3
- TailwindCSS for styling
- Three.js r128 for 3D graphics
- GSAP with ScrollTrigger for animations
- Font Awesome for icons
- Vanilla JavaScript ES6+

### Backend
- Node.js & Express.js
- SQLite3 database
- Security middleware (Helmet, CORS, Rate Limiting)
- Input validation and sanitization

##  Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd space-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and set your ADMIN_KEY
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:3000`

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set environment variables in Vercel dashboard

### Option 2: Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Option 3: Netlify
1. Build command: `npm run build`
2. Publish directory: `./`
3. Set environment variables

### Option 4: Traditional VPS
1. Upload files to server
2. Install dependencies: `npm install --production`
3. Start with PM2: `pm2 start server.js --name "space-portfolio"`

## 🔧 Configuration

### Environment Variables
```bash
NODE_ENV=production
PORT=3000
ADMIN_KEY=your-secure-admin-key
```

### Database
The SQLite database is automatically created on first run. For production, consider migrating to PostgreSQL or MongoDB.

##  API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Require Authorization)
- `GET /api/contacts` - Get all contacts
- `PATCH /api/contacts/:id` - Update contact status

### Admin Access
Add `Authorization: Bearer YOUR_ADMIN_KEY` header to access admin endpoints.

##  3D Graphics Features

- **Multi-layered Star Systems**: 3 layers with 7,800+ stars
- **Procedural Nebulae**: 26 colorful nebulae with realistic gradients
- **Animated Asteroids**: 25 rotating space debris objects
- **Energy Orbs**: 12 glowing, floating energy spheres
- **Camera Parallax**: Mouse-responsive camera movement
- **Performance Optimized**: Efficient particle systems and materials

## 📱 Responsive Design

- Mobile navigation with hamburger menu
- Optimized layouts for all screen sizes
- Touch-friendly interactions
- Progressive enhancement

##  Security Features

- Input validation and sanitization
- XSS protection
- Rate limiting (100 requests/15min, 5 contact forms/hour)
- CORS configuration
- Security headers with Helmet
- SQL injection prevention

##  Performance

- Optimized Three.js rendering
- Efficient particle systems
- CDN-served external libraries
- Compressed assets
- Lazy loading where applicable

##  Contact Form Features

- Real-time validation
- Loading states and animations
- Success/error notifications
- Database storage with timestamps
- IP and user agent logging
- Admin dashboard for management

##  Professional Content

- Real astronomical research experience
- Working project links (Streamlit applications)
- Comprehensive skills showcase
- Workshop and award listings
- Professional memberships
- Contact information

## 📞 Contact

- **Email**: mudulimrutyunjaya42@gmail.com
- **GitHub**: [MrutyunjayaMuduli](https://github.com/studentofstars)
- **LinkedIn**: [mrutyunjaya-muduli](https://www.linkedin.com/in/mrutyunjaya-muduli-8a124a257?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)

## 📄 License

MIT License - feel free to use this project for your own portfolio!

---

*Built with 💫 by Mrutyunjaya Muduli - Exploring the cosmos through code*
