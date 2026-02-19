import DaumPostcode from 'react-daum-postcode';
import { X } from 'lucide-react';

interface AddressSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (data: any) => void;
}

export function AddressSearchModal({ isOpen, onClose, onComplete }: AddressSearchModalProps) {
    if (!isOpen) return null;

    const handleComplete = (data: any) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        onComplete({
            ...data,
            fullAddress // Convenient field for display
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">주소 검색</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <DaumPostcode onComplete={handleComplete} className="w-full h-full min-h-[400px]" />
                </div>
            </div>
        </div>
    );
}
