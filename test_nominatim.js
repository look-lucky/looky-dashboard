
// Using native fetch in Node 18+
const address = '전북특별자치도 전주시 덕진구 백제대로 567 (금암동, 전북대학교)';

async function fetchNominatim(query) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    console.log(`Querying: ${url}`);

    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'TestScript/1.0' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        console.log('Result:', JSON.stringify(json, null, 2));
    } catch (e) {
        console.error('Error:', e);
    }
}

fetchNominatim(address);
