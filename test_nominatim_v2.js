const axios = require('axios');

const address = '서울특별시 관악구 관악로1';
const addressWithSpace = '서울특별시 관악구 관악로 1';

async function testNominatim(query, headers = {}) {
    try {
        console.log(`\nTesting query: "${query}"`);
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
            console.log('First result display_name:', response.data[0].display_name);
            console.log('Lat:', response.data[0].lat, 'Lon:', response.data[0].lon);
        } else {
            console.log('No results found.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

(async () => {
    // Basic test
    await testNominatim(address);
    // Space test
    await testNominatim(addressWithSpace);
})();
