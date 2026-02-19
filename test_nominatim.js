const axios = require('axios');

const address = '서울특별시 관악구 관악로1';
const addressWithSpace = '서울특별시 관악구 관악로 1';

async function testNominatim(query, headers = {}) {
    try {
        console.log(`Testing query: "${query}" with headers:`, headers);
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: query,
                format: 'json',
                limit: 1
            },
            headers: headers
        });
        console.log(`Result count: ${response.data.length}`);
        if (response.data.length > 0) {
            console.log('First result:', response.data[0].display_name);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

(async () => {
    console.log('--- Test 1: No User-Agent, original query ---');
    await testNominatim(address);

    console.log('\n--- Test 2: With User-Agent, original query ---');
    await testNominatim(address, { 'User-Agent': 'LookyDashboard/1.0' });

    console.log('\n--- Test 3: With User-Agent, with space ---');
    await testNominatim(addressWithSpace, { 'User-Agent': 'LookyDashboard/1.0' });
})();
