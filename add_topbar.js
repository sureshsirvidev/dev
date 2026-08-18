const fs = require('fs');

const files = [
    { file: 'email-sender-extension.html', title: 'Email Dispatcher', container: '.container' },
    { file: 'find-freelancers-clinets-and-work-on-linkdin.html', title: 'LinkedIn Finder', container: '.container' },
    { file: 'form-deck-extension.html', title: 'Form Deck', container: '.container' },
    { file: 'outreach-copy-hub-extension.html', title: 'Outreach Copy Hub', container: '.container' }
];

const topbarCss = `
        /* ── TOPBAR ── */
        .topbar {
            position: sticky; top: 0; z-index: 100;
            background: var(--nav-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--surface-border);
            padding: 14px 32px;
            display: flex; align-items: center; justify-content: space-between;
            gap: 16px;
            width: 100%;
        }
        .topbar-left { display: flex; align-items: center; gap: 12px; }
        .topbar-back {
            display: flex; align-items: center; gap: 6px;
            color: var(--text-secondary); font-size: 0.95rem; font-weight: 600;
            text-decoration: none; transition: color 0.2s;
        }
        .topbar-back:hover { color: var(--accent); }
        .topbar-sep { color: var(--text-secondary); opacity: 0.5; }
        .topbar-title { font-weight: 800; font-size: 1rem; color: var(--text-primary); }
        
        .topbar-contact { display: flex; align-items: center; justify-content: center; gap: 24px; font-size: 0.9rem; font-weight: 500; }
        .contact-link { color: var(--text-secondary); text-decoration: none; display: flex; align-items: center; gap: 6px; transition: color 0.2s; }
        .contact-link:hover { color: var(--accent); }

        @media (max-width: 768px) {
            .topbar { padding: 12px 20px; flex-wrap: wrap; }
            .topbar-contact { display: none; /* Hide on mobile */ }
            .container { margin: 30px auto !important; width: 92% !important; }
            body { padding: 0 0 50px 0 !important; }
        }
`;

files.forEach(({file, title, container}) => {
    if (!fs.existsSync(file)) return;
    let text = fs.readFileSync(file, 'utf8');

    // Fix body layout
    text = text.replace(/display:\s*flex;\s*justify-content:\s*center;\s*align-items:\s*center;/g, 'display: flex; flex-direction: column;');
    text = text.replace(/padding:\s*25px 20px;/g, 'padding: 0 0 50px 0;');
    
    // Fix container layout
    const containerRegex = new RegExp(container + '\\s*\\{[\\s\\S]*?max-width:\\s*\\d+px;');
    text = text.replace(containerRegex, match => {
        if (!match.includes('margin:')) {
            return match + '\n            margin: 50px auto;\n            width: 95%;';
        }
        return match;
    });

    // Inject CSS
    if (!text.includes('.topbar-contact')) {
        text = text.replace('</style>', topbarCss + '\n    </style>');
    }

    // Topbar HTML
    const topbarHtml = `
    <div class="topbar">
        <div class="topbar-left">
            <a href="index.html" class="topbar-back">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                Back to Portfolio
            </a>
            <span class="topbar-sep">/</span>
            <span class="topbar-title">${title}</span>
        </div>
        <div class="topbar-contact">
            <a href="tel:+919902965742" class="contact-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                +91 9902965742
            </a>
            <a href="mailto:sureshsirvi.dev@gmail.com" class="contact-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                sureshsirvi.dev@gmail.com
            </a>
        </div>
`;

    if (!text.includes('<div class="topbar-contact">')) {
        text = text.replace(/<div class="custom-cursor"><\/div>\n?/, '<div class="custom-cursor"></div>\n' + topbarHtml);
        
        text = text.replace(/<div class="topbar-actions">[\s\S]*?<\/div>\n\s*<div class="noise-overlay">/g, match => {
            return match.replace(/<div class="noise-overlay">/, '</div>\n    <div class="noise-overlay">'); 
        });
    }

    fs.writeFileSync(file, text);
});
