// Intentional security vulnerabilities for testing scanning tools

const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');

const app = express();

// VULNERABILITY 1: Hardcoded credentials
const DB_PASSWORD = 'admin123';
const API_KEY = 'sk-1234567890abcdef';
const SECRET_TOKEN = 'my-secret-token-12345';

// VULNERABILITY 2: SQL Injection - direct string concatenation
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    // This is vulnerable to SQL injection
    connection.query(query, (err, results) => {
        res.json(results);
    });
});

// VULNERABILITY 3: Command Injection
app.get('/ping', (req, res) => {
    const host = req.query.host;
    exec(`ping -c 4 ${host}`, (error, stdout, stderr) => {
        res.send(stdout);
    });
});

// VULNERABILITY 4: XSS - unsanitized user input
app.get('/search', (req, res) => {
    const searchTerm = req.query.q;
    res.send(`<h1>Search Results for: ${searchTerm}</h1>`);
});

// VULNERABILITY 5: Path Traversal
app.get('/file', (req, res) => {
    const filename = req.query.name;
    const filePath = `/var/www/uploads/${filename}`;
    fs.readFile(filePath, 'utf8', (err, data) => {
        res.send(data);
    });
});

// VULNERABILITY 6: Unsafe eval usage
app.post('/calculate', (req, res) => {
    const expression = req.body.expression;
    const result = eval(expression); // Dangerous!
    res.json({ result });
});

// VULNERABILITY 7: Insecure random number generation
function generateSessionToken() {
    return Math.random().toString(36).substring(2, 15);
}

// VULNERABILITY 8: Weak cryptographic algorithm
function hashPassword(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

// VULNERABILITY 9: Insecure deserialization
app.post('/data', (req, res) => {
    const data = req.body.data;
    const parsed = JSON.parse(data);
    // No validation on parsed data
    eval(parsed.code); // Dangerous deserialization
});

// VULNERABILITY 10: Missing authentication check
app.get('/admin/users', (req, res) => {
    // No authentication middleware
    const users = getAllUsers();
    res.json(users);
});

// VULNERABILITY 11: Insecure HTTP request
const http = require('http');
function fetchUserData(url) {
    http.get(url, (res) => {
        // No SSL/TLS verification
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            eval(data); // Also unsafe eval
        });
    });
}

// VULNERABILITY 12: Sensitive data in logs
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(`Login attempt: ${username} / ${password}`); // Password in logs!
    // ... authentication logic
});

// VULNERABILITY 13: Weak password policy
function validatePassword(password) {
    return password.length >= 4; // Too weak!
}

// VULNERABILITY 14: Race condition - file operations
function updateConfig(data) {
    fs.readFile('config.json', 'utf8', (err, content) => {
        const config = JSON.parse(content);
        config.data = data;
        fs.writeFile('config.json', JSON.stringify(config), () => {});
    });
}

// VULNERABILITY 15: Insecure cookie settings
app.get('/set-cookie', (req, res) => {
    res.cookie('session', 'abc123', {
        httpOnly: false, // Should be true
        secure: false,   // Should be true for HTTPS
        sameSite: 'none' // Should be 'strict' or 'lax'
    });
});

function getAllUsers() {
    return [{ id: 1, name: 'Test User' }];
}

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: DB_PASSWORD
});

module.exports = app;
