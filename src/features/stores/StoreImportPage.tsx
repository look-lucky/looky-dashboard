import { useState } from 'react';
import { useUniversity } from '../../shared/contexts/UniversityContext';
import { Search as SearchIcon, Download, Loader2, Store, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { AddressSearchFields } from '../../shared/components/AddressSearchFields';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { AddressSearchModal } from '../../shared/components/AddressSearchModal';
import { AdminService } from '../../shared/api/services/AdminService';
import type { AddressSearchResultData, GeocodeResult } from '../../shared/types/address';
import { getVisiblePageNumbers } from '../../shared/utils/pagination';

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

const ALLOWED_CATEGORY_NAMES = new Set([
    '슈퍼마켓', '편의점', '그 외 기타 종합 소매업', '정육점', '수산물 소매업',
    '채소/과일 소매업', '아이스크림 할인점', '반찬/식료품 소매업', '주류 소매업', '생수/음료 소매업',
    '담배/전자담배 소매업', '컴퓨터/소프트웨어 소매업', '핸드폰 소매업', '가전제품 소매업', '남성 의류 소매업',
    '여성 의류 소매업', '유아용 의류 소매업', '한복 소매업', '기타 의류 소매업', '침구류/커튼 소매업',
    '액세서리/잡화 소매업', '신발 소매업', '가방 소매업', '가구 소매업', '전기용품/조명장치 소매업',
    '주방/가정용품 소매업', '악기 소매업', '서점', '문구/회화용품 소매업', '음반/비디오물 소매업',
    '운동용품 소매업', '자전거 소매업', '장난감 소매업', '약국', '의료기기 소매업',
    '화장품 소매업', '안경렌즈 소매업', '사진기/기타 광학기기 소매업', '시계/귀금속 소매업', '기념품점',
    '꽃집', '애완동물/애완용품 소매업', '그 외 기타 상품 전문 소매업', '중고 상품 소매업', '호텔/리조트',
    '여관/모텔', '펜션', '캠핑/글램핑', '기숙사/고시원', '그 외 기타 숙박업',
    '백반/한정식', '국/탕/찌개류', '족발/보쌈', '전/부침개', '국수/칼국수',
    '냉면/밀면', '돼지고기 구이/찜', '소고기 구이/찜', '곱창 전골/구이', '닭/오리고기 구이/찜',
    '횟집', '해산물 구이/찜', '복 요리 전문', '기타 한식 음식점', '중국집',
    '마라탕/훠궈', '일식 회/초밥', '일식 카레/돈가스/덮밥', '일식 면 요리', '기타 일식 음식점',
    '경양식', '파스타/스테이크', '패밀리레스토랑', '기타 서양식 음식점', '베트남식 전문',
    '기타 동남아식 전문', '분류 안된 외국식 음식점', '구내식당', '뷔페', '빵/도넛',
    '떡/한과', '피자', '버거', '토스트/샌드위치/샐러드', '치킨',
    '김밥/만두/분식', '아이스크림/빙수', '그 외 기타 간이 음식점', '일반 유흥 주점', '무도 유흥 주점',
    '생맥주 전문', '요리 주점', '카페', '부동산 중개/대리업', '변호사',
    '변리사', '법무사', '행정사', '공인노무사', '기타 법무관련 서비스업',
    '공인회계사', '세무사', '기타 회계 관련 서비스업', '동물병원', '사진촬영업',
    '명함/간판/광고물 제작', '번역/통역 서비스업', '사업/무형 재산권 중개업', '소독, 구충 및 방제 서비스업', '여행사',
    '기타 여행 보조/예약 서비스업', '복사업', '기타 사무 지원 서비스업', '전시/컨벤션/행사 대행 서비스업', '자동차 대여업',
    '스포츠/레크리에이션 용품 대여업', '음반/비디오물 대여업', '만화방', '의류 대여업', '기타 개인/가정용품 대여업',
    '태권도/무술학원', '요가/필라테스 학원', '음악학원', '미술학원', '기타 예술/스포츠 교육기관',
    '외국어학원', '전문자격/고시학원', '직원 훈련기관', '운전학원', '기타 기술/직업 훈련학원',
    '컴퓨터 학원', '그 외 기타 교육기관', '교육컨설팅업', '기타 교육지원 서비스업', '종합병원',
    '일반병원', '치과병원', '한방병원', '요양병원', '내과/소아과 의원',
    '외과 의원', '신경/정신과 의원', '피부/비뇨기과 의원', '안과 의원', '이비인후과 의원',
    '산부인과 의원', '성형외과 의원', '기타 의원', '치과의원', '한의원',
    '방사선 진단/병리 검사 의원', '유사 의료업', '독서실/스터디 카페', '종합 스포츠시설', '헬스장',
    '수영장', '볼링장', '당구장', '골프 연습장', '테니스장', '탁구장', '기타 스포츠시설 운영업',
    '스쿼시/라켓볼장', '비디오방', '전자 게임장', '기타 오락장', 'PC방', '노래방',
    '수상/해양 레저업', '기타 오락관련 서비스업', '컴퓨터/노트북/프린터 수리업', '핸드폰/통신장비 수리업', '자동차 정비소',
    '자동차 세차장', '모터사이클 수리업', '가전제품 수리업', '의류/이불 수선업', '가죽/가방/신발 수선업',
    '시계/귀금속/악기 수리업', '그 외 기타 개인/가정용품 수리업', '미용실', '피부 관리실', '네일숍',
    '목욕탕/사우나', '마사지/안마', '체형/비만 관리', '세탁소', '셀프 빨래방'
]);

export function StoreImportPage() {
    const { universities, selectedUniversityId } = useUniversity();

    // Search State
    const [address, setAddress] = useState('');
    const [searchCoords, setSearchCoords] = useState<{ lat: number, lng: number } | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const [radius, setRadius] = useState<number>(1);
    const [stores, setStores] = useState<StoreItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(0);
    const pageSize = 50;

    // Create a separate axios instance
    const externalApi = axios.create();

    const handleAddressComplete = async (data: AddressSearchResultData) => {
        const roadAddr = data.roadAddress;
        setAddress(roadAddr);

        try {
            // Auto-geocode via API
            const response = await AdminService.getGeocode(roadAddr);
            const coords = (response.data ?? (response as unknown as GeocodeResult)) as GeocodeResult; // Handle both direct object and CommonResponse
            if (coords && coords.latitude && coords.longitude) {
                setSearchCoords({ lat: coords.latitude, lng: coords.longitude });
            } else {
                alert('위치 좌표를 찾을 수 없습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('Geocoding failed:', error);
            alert('위치 좌표를 찾을 수 없습니다. (API 에러)');
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
        setPage(0);

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
            let fetchedCount = 0;
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
                    fetchedCount += items.length;

                    const filteredItems = items.filter(item => ALLOWED_CATEGORY_NAMES.has(item.indsSclsNm?.trim()));
                    allStores = [...allStores, ...filteredItems];

                    // Check if we fetched all items
                    if (fetchedCount >= totalCount || items.length < numOfRows) {
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

    const totalElements = stores.length;
    const totalPages = Math.ceil(totalElements / pageSize);
    const currentStores = stores.slice(page * pageSize, (page + 1) * pageSize);

    const isAllCurrentSelected = currentStores.length > 0 && currentStores.every(s => selectedItems.has(s.bizesId));

    const toggleSelectAllCurrent = () => {
        const newSet = new Set(selectedItems);
        if (isAllCurrentSelected) {
            currentStores.forEach(s => newSet.delete(s.bizesId));
        } else {
            currentStores.forEach(s => newSet.add(s.bizesId));
        }
        setSelectedItems(newSet);
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
                        <AddressSearchFields
                            mode="single"
                            label="중심 주소"
                            value={address}
                            placeholder={
                                selectedUniversityId
                                    ? `${universities?.find(u => u.id === selectedUniversityId)?.name || '대학교'} 상권 중심 주소를 클릭해서 검색하세요`
                                    : '상권 중심 주소를 클릭해서 검색하세요'
                            }
                            onOpen={() => setIsAddressModalOpen(true)}
                        />
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
                                            checked={isAllCurrentSelected}
                                            onChange={toggleSelectAllCurrent}
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
                                {currentStores.map((store) => (
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

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setPage(Math.max(0, page - 1))}
                                    disabled={page === 0}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    이전
                                </button>
                                <button
                                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                    disabled={page === totalPages - 1}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    다음
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">{page * pageSize + 1}</span> - <span className="font-medium">{Math.min((page + 1) * pageSize, totalElements)}</span> / <span className="font-medium">{totalElements}</span>
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => setPage(0)}
                                            disabled={page === 0}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <span className="sr-only">First</span>
                                            <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                        <button
                                            onClick={() => setPage(Math.max(0, page - 1))}
                                            disabled={page === 0}
                                            className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                        {getVisiblePageNumbers(page, totalPages).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === p
                                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {p + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                            disabled={page === totalPages - 1}
                                            className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Next</span>
                                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                        <button
                                            onClick={() => setPage(totalPages - 1)}
                                            disabled={page === totalPages - 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Last</span>
                                            <ChevronsRight className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
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







