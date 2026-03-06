const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testSecurity() {
    console.log('--- STARTING SECURITY VERIFICATION ---');

    // 1. Test NoSQL Injection on Login
    console.log('\n[1] Testing NoSQL Injection Sanitization...');
    try {
        const noSqlPayload = {
            email: { "$gt": "" },
            password: "password"
        };
        const res = await axios.post(`${API_URL}/auth/login`, noSqlPayload, {
            validateStatus: () => true // Don't throw on 4xx/5xx
        });

        console.log(`Status: ${res.status}`);
        // If it got sanitized, email becomes undefined/empty and it should say Invalid email or password (401)
        console.log(`Response: ${JSON.stringify(res.data)}`);
    } catch (error) {
        console.error('Error during NoSQL check:', error.message);
    }

    // 2. Test XSS Protection
    console.log('\n[2] Testing XSS Sanitization...');
    try {
        const xssPayload = {
            username: '<script>alert("xss")</script>hacker',
            email: 'hacker@test.com',
            password: 'password123'
        };
        const res = await axios.post(`${API_URL}/auth/register`, xssPayload, {
            validateStatus: () => true
        });

        console.log(`Status: ${res.status}`);
        // If sanitized, the username shouldn't contain the script tags
        console.log(`Response: ${JSON.stringify(res.data)}`);
    } catch (error) {
        console.error('Error during XSS check:', error.message);
    }

    // 3. Test Auth Rate Limiting
    console.log('\n[3] Testing Auth Rate Limiting (Should block after 7 attempts)...');
    let hitRateLimit = false;
    for (let i = 1; i <= 9; i++) {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, {
                email: 'test@invalid.com',
                password: 'wrong'
            }, {
                validateStatus: () => true
            });
            console.log(`Attempt ${i} Status: ${res.status}`);
            if (res.status === 429) {
                hitRateLimit = true;
                console.log(`Successfully hit rate limit on attempt ${i}! Response: ${res.data}`);
                break;
            }
        } catch (error) {
            console.error(`Error on attempt ${i}:`, error.message);
        }
    }
    if (!hitRateLimit) {
        console.log('FAILED: Did not hit rate limit after 9 attempts.');
    }

    console.log('\n--- VERIFICATION COMPLETE ---');
}

testSecurity();
