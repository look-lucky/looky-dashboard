import { useState } from 'react';
import { useUniversity } from '../../shared/contexts/UniversityContext';
import { Search as SearchIcon, Download, Loader2, MapPin, Store } from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { AddressSearchModal } from '../../shared/components/AddressSearchModal';
import { useNaverGeocoding } from '../../shared/hooks/useNaverGeocoding';

interface StoreItem {
    bizesId: string; // 상가업소번호
    bizesNm: string; // 상호명
    brchNm: string; // 지점명
    indsLclsCd: string; // 상권업종대분류코드
    indsLclsNm: string; // 상권업종대분류명
    indsMclsCd: string; // 상권업종중분류코드
    indsMclsNm: string; // 상권업종중분류명
    indsSclsCd: string; // 상권업종소분류코드
    indsSclsNm: string; // 상권업종소분류명
    ksicCd: string; // 표준산업분류코드
    ksicNm: string; // 표준산업분류명
    ctprvnCd: string; // 시도코드
    ctprvnNm: string; // 시도명
    signguCd: string; // 시군구코드
    signguNm: string; // 시군구명
    adongCd: string; // 행정동코드
    adongNm: string; // 행정동명
    ldongCd: string; // 법정동코드
    ldongNm: string; // 법정동명
    lnoCd: string; // 지번코드
    plotSctCd: string; // 대지구분코드
    plotSctNm: string; // 대지구분명
    lnoMno: string; // 지번본번지
    lnoSno: string; // 지번부번지
    lnoAdr: string; // 지번주소
    rdnmCd: string; // 도로명코드
    rdnm: string; // 도로명
    bldMno: string; // 건물본번지
    bldSno: string; // 건물부번지
    bldMngNo: string; // 건물관리번호
    bldNm: string; // 건물명
    rdnmAdr: string; // 도로명주소
    oldZipcd: string; // 구우편번호
    newZipcd: string; // 신우편번호
    dongNo: string; // 동정보
    flrNo: string; // 층정보
    hoNo: string; // 호정보
    lon: number; // 경도
    lat: number; // 위도
}

export function StoreImportPage() {
    const { universities, selectedUniversityId } = useUniversity();
    const { geocodeAddress } = useNaverGeocoding();

    // Search State
    const [address, setAddress] = useState('');
    const [searchCoords, setSearchCoords] = useState<{ lat: number, lng: number } | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const [radius, setRadius] = useState<number>(1);
    const [stores, setStores] = useState<StoreItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    // Create a separate axios instance
    const externalApi = axios.create();

    const handleAddressComplete = async (data: any) => {
        const roadAddr = data.roadAddress;
        setAddress(roadAddr);

        // Auto-geocode
        const coords = await geocodeAddress(roadAddr);
        if (coords) {
            setSearchCoords({ lat: coords.latitude, lng: coords.longitude });
        } else {
            alert('위치 좌표를 찾을 수 없습니다. 다시 시도해주세요.');
        }
    };

    const handleSearch = async () => {
        if (!address || !searchCoords) {
            alert('주소를 검색하여 위치를 설정해주세요.');
            setIsAddressModalOpen(true);
            return;
        }

        setIsLoading(true);
        setLoadingMessage('상권 데이터를 불러오는 중입니다...');
        setStores([]);
        setSelectedItems(new Set());

        try {
            const centerLat = searchCoords.lat;
            const centerLon = searchCoords.lng;

            // 1. Calculate Bounding Box (Approximate)
            // 1 degree of latitude = ~111km
            // 1 degree of longitude = ~111km * cos(latitude)
            const latDelta = radius / 111;
            const lonDelta = radius / (111 * Math.cos(centerLat * (Math.PI / 180)));

            const minLat = Number((centerLat - latDelta).toFixed(7));
            const maxLat = Number((centerLat + latDelta).toFixed(7));
            const minLon = Number((centerLon - lonDelta).toFixed(7));
            const maxLon = Number((centerLon + lonDelta).toFixed(7));

            // 2. Call Data.go.kr API via Proxy
            const serviceKey = import.meta.env.VITE_DATA_GO_KR_API_KEY;
            const decodedKey = serviceKey ? decodeURIComponent(serviceKey) : '';

            // Check if API key is present
            if (!serviceKey) {
                alert('API 키가 설정되지 않았습니다. Vercel 환경변수에 VITE_DATA_GO_KR_API_KEY를 추가하고 재배포해주세요.');
                setIsLoading(false);
                return;
            }

            let pageNo = 1;
            const numOfRows = 1000;
            let allStores: StoreItem[] = [];
            let totalCount = 0;
            const maxPages = 50; // Safety break

            while (pageNo <= maxPages) {
                setLoadingMessage(`상권 데이터를 불러오는 중입니다... (${pageNo} 페이지)`);

                const response = await externalApi.get('/external-api/data-go-kr/B553077/api/open/sdsc2/storeListInRectangle', {
                    params: {
                        serviceKey: decodedKey,
                        pageNo: pageNo,
                        numOfRows: numOfRows,
                        minx: minLon,
                        miny: minLat,
                        maxx: maxLon,
                        maxy: maxLat,
                        type: 'json'
                    }
                });

                let items: StoreItem[] = [];
                let errorMsg = null;

                if (typeof response.data === 'string') {
                    // Handle XML response (likely error)
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(response.data, "text/xml");
                    const resultMsg = xmlDoc.querySelector('resultMsg')?.textContent;
                    const returnAuthMsg = xmlDoc.querySelector('returnAuthMsg')?.textContent;

                    if (resultMsg || returnAuthMsg) {
                        errorMsg = resultMsg || returnAuthMsg;
                    } else {
                        // Show raw snippet to debug
                        const rawSnippet = response.data.substring(0, 200).replace(/\n/g, ' ');
                        errorMsg = `API 응답이 XML 형식이지만 에러 메시지를 찾을 수 없습니다.\n내용: ${rawSnippet}...`;
                    }
                } else if (typeof response.data === 'object') {
                    // Handle JSON response
                    // Case 1: Standard response.data.body.items
                    if (response.data?.body?.items) {
                        items = response.data.body.items;
                        totalCount = response.data.body.totalCount;
                    }
                    // Case 2: Wrapped response (response.data.response.body.items)
                    else if (response.data?.response?.body?.items) {
                        items = response.data.response.body.items;
                        totalCount = response.data.response.body.totalCount;
                    }
                    // Case 3: Error in JSON header
                    else if (response.data?.header?.resultMsg) {
                        errorMsg = `${response.data.header.resultMsg} (Code: ${response.data.header.resultCode})`;
                    }
                    else if (response.data?.response?.header?.resultMsg) {
                        errorMsg = `${response.data.response.header.resultMsg} (Code: ${response.data.response.header.resultCode})`;
                    }
                }

                if (errorMsg) {
                    // If error on first page, show alert. If error on subsequent pages, stop and show partial results.
                    if (pageNo === 1) {
                        alert(`API Error: ${errorMsg}`);
                        return;
                    } else {
                        console.warn(`Error fetching page ${pageNo}: ${errorMsg}`);
                        break;
                    }
                }

                if (items && Array.isArray(items) && items.length > 0) {
                    allStores = [...allStores, ...items];

                    // Check if we fetched all items
                    if (allStores.length >= totalCount || items.length < numOfRows) {
                        break;
                    }
                    pageNo++;
                } else {
                    // No items returned or invalid format
                    if (pageNo === 1 && (!items || items.length === 0)) {
                        alert('조회된 데이터가 없거나 API 응답 형식이 올바르지 않습니다. (결과 없음)\n\n개발자 도구(F12) > Console 탭에서 "API Raw Response"를 확인해주세요.');
                        return;
                    }
                    break;
                }
            }

            setStores(allStores);
            // Select all by default
            const allIds = new Set(allStores.map((item: StoreItem) => item.bizesId));
            setSelectedItems(allIds);

        } catch (error) {
            console.error('Error fetching data:', error);
            alert('데이터를 불러오는 중 오류가 발생했습니다. 콘솔을 확인해주세요.');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    const handleExport = () => {
        if (selectedItems.size === 0) {
            alert('내보낼 항목을 선택해주세요.');
            return;
        }

        const selectedStores = stores.filter(store => selectedItems.has(store.bizesId));

        // Map to format matching StoreCreateRequest / Backend Model
        const exportData = selectedStores.map(store => ({
            universityId: selectedUniversityId,
            name: store.bizesNm,
            branch: store.brchNm,
            roadAddress: store.rdnmAdr,
            jibunAddress: store.lnoAdr,
            latitude: Number(store.lat),
            longitude: Number(store.lon)
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Stores");

        const universityName = universities!.find(u => u.id === selectedUniversityId)?.name || 'University';
        const dateStr = new Date().toISOString().slice(0, 10);
        const fileName = `${universityName}_상권데이터_${dateStr}.xlsx`;

        XLSX.writeFile(wb, fileName);
    };

    const toggleSelectAll = () => {
        if (selectedItems.size === stores.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(stores.map(s => s.bizesId)));
        }
    };

    const toggleSelectItem = (id: string) => {
        const newSet = new Set(selectedItems);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedItems(newSet);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">상가 데이터 불러오기</h1>
                <div className="text-sm text-gray-500">
                    공공데이터포털(data.go.kr) 소상공인시장진흥공단 상가(상권)정보 API 연동
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">중심 주소</label>
                        <div className="flex space-x-2">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    readOnly
                                    value={address}
                                    onClick={() => setIsAddressModalOpen(true)}
                                    placeholder={
                                        selectedUniversityId
                                            ? `${universities?.find(u => u.id === selectedUniversityId)?.name || '대학교'} 주소를 입력해주세요`
                                            : "주소를 검색하세요"
                                    }
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border cursor-pointer bg-gray-50"
                                />
                                <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddressModalOpen(true)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                주소 검색
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">반경 (km)</label>
                        <select
                            value={radius}
                            onChange={(e) => setRadius(Number(e.target.value))}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        >
                            <option value={0.1}>0.1 km</option>
                            <option value={0.3}>0.3 km</option>
                            <option value={0.5}>0.5 km</option>
                            <option value={0.8}>0.8 km</option>
                            <option value={1}>1 km</option>
                            <option value={1.5}>1.5 km</option>
                            <option value={2}>2 km</option>
                            <option value={3}>3 km</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    검색 중...
                                </>
                            ) : (
                                <>
                                    <SearchIcon className="-ml-1 mr-2 h-4 w-4" />
                                    데이터 불러오기
                                </>
                            )}
                        </button>
                    </div>
                </div>
                {loadingMessage && <p className="text-sm text-blue-600 text-center">{loadingMessage}</p>}
            </div>

            {stores.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="text-lg font-medium text-gray-900">
                            검색 결과: <span className="text-blue-600 font-bold">{stores.length}</span>개
                        </h3>
                        <button
                            onClick={handleExport}
                            disabled={selectedItems.size === 0}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="-ml-1 mr-2 h-4 w-4" />
                            Excel로 내보내기 ({selectedItems.size})
                        </button>
                    </div>

                    <div className="overflow-x-auto max-h-[600px]">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.size === stores.length}
                                            onChange={toggleSelectAll}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        상호명 (지점명)
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        업종
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        주소
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        좌표
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {stores.map((store) => (
                                    <tr key={store.bizesId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.has(store.bizesId)}
                                                onChange={() => toggleSelectItem(store.bizesId)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Store className="h-5 w-5 text-gray-400 mr-2" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{store.bizesNm}</div>
                                                    {store.brchNm && <div className="text-sm text-gray-500">{store.brchNm}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{store.indsMclsNm}</div>
                                            <div className="text-xs text-gray-500">{store.indsSclsNm}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{store.rdnmAdr}</div>
                                            <div className="text-xs text-gray-500">{store.lnoAdr}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>Lat: {store.lat}</div>
                                            <div>Lon: {store.lon}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <AddressSearchModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onComplete={handleAddressComplete}
            />
        </div>
    );
}
