const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.tailwindcss.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
}));

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-domain.com', 'https://www.your-domain.com'] 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});

const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 contact form submissions per hour
    message: {
        error: 'Too many contact form submissions, please try again later.'
    }
});

app.use(limiter);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite Database
const db = new sqlite3.Database('./portfolio.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        
        // Create contacts table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            ip_address TEXT,
            user_agent TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'new'
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Contacts table ready.');
            }
        });
    }
});

// Validation functions
const validateContactData = (name, email, message) => {
    const errors = [];
    
    if (!name || name.trim().length < 2 || name.trim().length > 100) {
        errors.push('Name must be between 2 and 100 characters');
    }
    
    if (!email || !validator.isEmail(email)) {
        errors.push('Please provide a valid email address');
    }
    
    if (!message || message.trim().length < 10 || message.trim().length > 1000) {
        errors.push('Message must be between 10 and 1000 characters');
    }
    
    // Basic XSS protection
    const dangerousPatterns = [/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, /javascript:/gi, /on\w+\s*=/gi];
    const allText = `${name} ${email} ${message}`;
    
    for (const pattern of dangerousPatterns) {
        if (pattern.test(allText)) {
            errors.push('Invalid characters detected in submission');
            break;
        }
    }
    
    return errors;
};

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Contact form submission
app.post('/api/contact', contactLimiter, (req, res) => {
    const { name, email, message } = req.body;
    
    // Validate input
    const validationErrors = validateContactData(name, email, message);
    if (validationErrors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: validationErrors
        });
    }
    
    // Get client info
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || 'Unknown';
    
    // Insert into database
    const stmt = db.prepare(`
        INSERT INTO contacts (name, email, message, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run([
        name.trim(),
        email.trim().toLowerCase(),
        message.trim(),
        ipAddress,
        userAgent
    ], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({
                success: false,
                error: 'Failed to save contact information. Please try again.'
            });
        }
        
        console.log(`New contact submission: ${name} (${email}) - ID: ${this.lastID}`);
        
        res.json({
            success: true,
            message: 'Thank you for your message! I\'ll get back to you soon.',
            id: this.lastID
        });
    });
    
    stmt.finalize();
});

// Get all contacts (protected route - you might want to add authentication)
app.get('/api/contacts', (req, res) => {
    // Basic protection - you should implement proper authentication
    const adminKey = req.headers.authorization;
    if (adminKey !== `Bearer ${process.env.ADMIN_KEY || 'your-secret-key'}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    db.all(`
        SELECT id, name, email, message, created_at, status 
        FROM contacts 
        ORDER BY created_at DESC
    `, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Failed to fetch contacts' });
        }
        
        res.json({
            success: true,
            contacts: rows,
            total: rows.length
        });
    });
});

// Update contact status
app.patch('/api/contacts/:id', (req, res) => {
    const adminKey = req.headers.authorization;
    if (adminKey !== `Bearer ${process.env.ADMIN_KEY || 'your-secret-key'}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    
    db.run(`UPDATE contacts SET status = ? WHERE id = ?`, [status, id], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Failed to update contact' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        
        res.json({
            success: true,
            message: 'Contact status updated'
        });
    });
});

// Serve the main HTML file for all routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong! Please try again later.'
    });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Portfolio server running on port ${PORT}`);
    console.log(`🌌 Visit: http://localhost:${PORT}`);
    console.log('🛸 3D Space Portfolio Ready!');
});

module.exports = app;
