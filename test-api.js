// Simple test script to verify the API endpoints
console.log('Testing DevPy Blog API...\n');

const testEndpoints = [
    {
        name: 'Health Check',
        url: 'http://localhost:3000/api/posts',
        method: 'GET'
    },
    {
        name: 'Admin Login',
        url: 'http://localhost:3000/api/admin/login',
        method: 'POST',
        body: {
            username: 'DEVPY TEAM',
            password: 'puh17109'
        }
    }
];

async function testAPI() {
    for (const test of testEndpoints) {
        try {
            console.log(`Testing: ${test.name}`);
            
            const options = {
                method: test.method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            if (test.body) {
                options.body = JSON.stringify(test.body);
            }
            
            const response = await fetch(test.url, options);
            const data = await response.json();
            
            console.log(`✅ ${test.name}: ${response.status} - ${data.success ? 'Success' : 'Failed'}`);
            
        } catch (error) {
            console.log(`❌ ${test.name}: Error - ${error.message}`);
        }
    }
}

// Run only if this script is executed directly
if (require.main === module) {
    console.log('Please start the server first with: node server.js');
    console.log('Then run: node test-api.js');
}

module.exports = { testAPI };
