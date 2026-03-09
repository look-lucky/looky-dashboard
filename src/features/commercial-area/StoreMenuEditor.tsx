import React, { useState } from 'react';
import { Plus, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { ImageCropper } from '../../shared/components/ImageCropper';

type BadgeType = 'BEST' | 'NEW' | 'HOT' | 'VEGAN';

const createDraftId = (prefix: string) => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return `${prefix}-${crypto.randomUUID()}`;
    }

    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export interface MenuCategoryState {
    id?: number;
    localId: string;
    name: string;
    isDeleted?: boolean;
}

export const getMenuCategoryLocalId = (categoryId: number) => `existing-${categoryId}`;

export const createDraftMenuCategory = (): MenuCategoryState => ({
    localId: createDraftId('menu-category'),
    name: '',
});

export interface MenuItemState {
    id?: number; // Only exists if fetched from server
    name: string;
    price?: number;
    description?: string;
    badge?: BadgeType;
    categoryLocalId?: string;
    itemOrder?: number;
    imageUrl?: string; // Existing image from backend
    imageFile?: File;  // Newly uploaded file
    isDeleted?: boolean; // Flag to mark for deletion upon save
}

interface StoreMenuEditorProps {
    items: MenuItemState[];
    onChange: (items: MenuItemState[]) => void;
    categories: MenuCategoryState[];
    onCategoriesChange: (categories: MenuCategoryState[]) => void;
}

export const StoreMenuEditor: React.FC<StoreMenuEditorProps> = ({ items, onChange, categories, onCategoriesChange }) => {
    const [cropState, setCropState] = useState<{ index: number; src: string } | null>(null);

    // Add an empty menu item
    const handleAdd = () => {
        onChange([
            ...items,
            { name: '', itemOrder: items.length + 1 }
        ]);
    };

    // Update specific field of a specific item
    const handleChange = <K extends keyof MenuItemState>(index: number, field: K, value: MenuItemState[K]) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        onChange(newItems);
    };

    // Marks for deletion if it exists on server, strictly removes if it's new
    const handleRemove = (index: number) => {
        const item = items[index];
        const newItems = [...items];

        if (item.id) {
            newItems[index] = { ...item, isDeleted: true };
        } else {
            newItems.splice(index, 1);
        }

        // Re-calculate ordering
        let order = 1;
        const OrderedItems = newItems.map(it => {
            if (!it.isDeleted) {
                return { ...it, itemOrder: order++ };
            }
            return it;
        });

        onChange(OrderedItems);
    };

    const handleAddCategory = () => {
        onCategoriesChange([...categories, createDraftMenuCategory()]);
    };

    const handleCategoryChange = (localId: string, name: string) => {
        onCategoriesChange(
            categories.map((category) => (
                category.localId === localId
                    ? { ...category, name }
                    : category
            )),
        );
    };

    const handleRemoveCategory = (localId: string) => {
        const nextCategories = categories.flatMap((category) => {
            if (category.localId !== localId) {
                return [category];
            }

            if (category.id) {
                return [{ ...category, isDeleted: true }];
            }

            return [];
        });

        const nextItems = items.map((item) => (
            item.categoryLocalId === localId
                ? { ...item, categoryLocalId: undefined }
                : item
        ));

        onCategoriesChange(nextCategories);
        onChange(nextItems);
    };

    // Handle image selection
    const handleImageDrop = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const objectUrl = URL.createObjectURL(file);
            setCropState({ index, src: objectUrl });
        }
        if (e.target) e.target.value = '';
    };

    const handleClearImage = (index: number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], imageFile: undefined, imageUrl: undefined };
        onChange(newItems);
    };

    const handlePaste = (e: React.ClipboardEvent, index: number) => {
        if (!e.clipboardData?.files.length) return;
        const pastedFiles = Array.from(e.clipboardData.files).filter(f => f.type.startsWith('image/'));
        if (pastedFiles.length > 0) {
            e.preventDefault();
            e.stopPropagation(); // Stop paste bubble to main modal
            const file = pastedFiles[0]; // Take only the first image
            const objectUrl = URL.createObjectURL(file);
            setCropState({ index, src: objectUrl });
        }
    };

    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const pastedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
            if (pastedFiles.length > 0) {
                const file = pastedFiles[0]; // Take only the first image
                const objectUrl = URL.createObjectURL(file);
                setCropState({ index, src: objectUrl });
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleCropComplete = (croppedImageUrl: string, blob: Blob) => {
        if (!cropState) return;
        const croppedFile = new File([blob], 'menu-cropped.jpg', { type: blob.type });
        const newItems = [...items];
        newItems[cropState.index] = {
            ...newItems[cropState.index],
            imageFile: croppedFile,
            imageUrl: croppedImageUrl
        };
        onChange(newItems);
        setCropState(null);
    };

    const handleCropCancel = () => {
        setCropState(null);
    };

    const visibleItems = items.filter(i => !i.isDeleted);
    const visibleCategories = categories.filter((category) => !category.isDeleted);

    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div>
                        <h5 className="text-sm font-semibold text-gray-900">메뉴 카테고리</h5>
                        <p className="mt-1 text-xs text-gray-500">카테고리는 메뉴와 별도로 저장됩니다.</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleAddCategory}
                        className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
                    >
                        <Plus className="h-4 w-4" />
                        카테고리 추가
                    </button>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                    {visibleCategories.length === 0 ? (
                        <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-center text-sm text-gray-500">
                            등록된 메뉴 카테고리가 없습니다.
                        </div>
                    ) : (
                        visibleCategories.map((category) => (
                            <div key={category.localId} className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                                <input
                                    type="text"
                                    value={category.name}
                                    onChange={(e) => handleCategoryChange(category.localId, e.target.value)}
                                    placeholder="카테고리명 입력"
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveCategory(category.localId)}
                                    className="rounded-md border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:border-red-200 hover:text-red-500"
                                    title="카테고리 삭제"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {visibleItems.map((item) => {
                // We need to find its absolute index in the state array, 
                // in case some items before it were merely mocked deleted.
                const stateIdx = items.findIndex(it => it === item);

                return (
                    <div
                        key={stateIdx}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative flex flex-col md:flex-row gap-4 focus-within:ring-2 focus-within:ring-indigo-100"
                        onPaste={(e) => handlePaste(e, stateIdx)}
                    >

                        {/* Image Uploader */}
                        <div
                            className="w-full md:w-32 h-32 shrink-0 relative bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden group"
                            onDrop={(e) => handleDrop(e, stateIdx)}
                            onDragOver={handleDragOver}
                        >
                            {item.imageUrl ? (
                                <>
                                    <img src={item.imageUrl} alt="menu" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => handleClearImage(stateIdx)}
                                            className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-50">
                                    <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                                    <span className="text-[10px] text-gray-500">이미지 첨부</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageDrop(e, stateIdx)}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Fields */}
                        <div className="flex-1 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div className="flex-1 mr-4">
                                    <input
                                        type="text"
                                        placeholder="메뉴명 (필수)"
                                        value={item.name}
                                        onChange={(e) => handleChange(stateIdx, 'name', e.target.value)}
                                        className="w-full font-bold text-gray-900 border-b border-gray-300 py-1 bg-transparent focus:outline-none focus:border-indigo-500 placeholder-gray-400"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemove(stateIdx)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-md shadow-sm border border-gray-200"
                                    title="메뉴 삭제"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                <div>
                                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">가격</label>
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={item.price || ''}
                                            onChange={(e) => handleChange(stateIdx, 'price', e.target.value ? Number(e.target.value) : undefined)}
                                            className="mt-1 w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">원</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">뱃지</label>
                                    <select
                                        value={item.badge || ''}
                                        onChange={(e) => {
                                        const badge = e.target.value as BadgeType | '';
                                        handleChange(stateIdx, 'badge', badge === '' ? undefined : badge);
                                    }}
                                        className="mt-1 w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                                    >
                                        <option value="">없음</option>
                                        <option value="BEST">BEST</option>
                                        <option value="NEW">NEW</option>
                                        <option value="HOT">HOT</option>
                                        <option value="VEGAN">VEGAN</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">카테고리</label>
                                    <select
                                        value={item.categoryLocalId || ''}
                                        onChange={(e) => handleChange(stateIdx, 'categoryLocalId', e.target.value || undefined)}
                                        className="mt-1 w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                                    >
                                        <option value="">선택 안 함</option>
                                        {visibleCategories.map((category) => (
                                            <option key={category.localId} value={category.localId}>
                                                {category.name.trim() || '이름 없는 카테고리'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">소개</label>
                                <textarea
                                    placeholder="메뉴에 대한 설명을 적어주세요."
                                    value={item.description || ''}
                                    onChange={(e) => handleChange(stateIdx, 'description', e.target.value)}
                                    rows={2}
                                    className="mt-1 w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                                />
                            </div>
                        </div>
                    </div>
                );
            })}

            {visibleItems.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-gray-500 text-sm mb-2">등록된 메뉴가 없습니다.</p>
                </div>
            )}

            <button
                type="button"
                onClick={handleAdd}
                className="mt-2 w-full py-2.5 border border-indigo-200 bg-indigo-50 text-indigo-700 font-medium text-sm rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
            >
                <Plus className="w-4 h-4" />
                메뉴 추가하기
            </button>

            {cropState && (
                <ImageCropper
                    imageSrc={cropState.src}
                    aspectRatio={1} // 1:1 ratio
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </div>
    );
};
