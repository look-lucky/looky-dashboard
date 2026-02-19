import { useState, useEffect } from 'react';

export function useNaverGeocoding() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const scriptId = 'naver-map-script';
        const existingScript = document.getElementById(scriptId);

        if (existingScript) {
            setIsLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}&submodules=geocoder`;
        script.async = true;

        script.onload = () => {
            setIsLoaded(true);
        };

        document.head.appendChild(script);
    }, []);

    const geocodeAddress = (address: string): Promise<{ latitude: number; longitude: number; jibunAddress: string } | null> => {
        return new Promise((resolve) => {
            if (!isLoaded || !window.naver || !window.naver.maps || !window.naver.maps.Service) {
                console.warn('Naver Maps API not loaded properly or geocode service unavailable');
                resolve(null);
                return;
            }

            window.naver.maps.Service.geocode({
                query: address
            }, (status: any, response: any) => {
                if (status === 200 && response.v2.addresses.length > 0) {
                    const item = response.v2.addresses[0];
                    resolve({
                        latitude: parseFloat(item.y),
                        longitude: parseFloat(item.x),
                        jibunAddress: item.jibunAddress || ''
                    });
                } else {
                    resolve(null);
                }
            });
        });
    };

    return { geocodeAddress, isLoaded };
}
