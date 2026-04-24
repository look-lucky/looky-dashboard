import type { MenuCategoryState, MenuItemState } from './StoreMenuEditor';

const createDraftId = (prefix: string) => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return `${prefix}-${crypto.randomUUID()}`;
    }

    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const getMenuCategoryLocalId = (categoryId: number) => `existing-${categoryId}`;

export const createDraftMenuCategory = (): MenuCategoryState => ({
    localId: createDraftId('menu-category'),
    name: '',
});

export const getMenuItemLocalId = (itemId: number) => `existing-item-${itemId}`;

export const createDraftMenuItem = (itemOrder: number): MenuItemState => ({
    localId: createDraftId('menu-item'),
    name: '',
    itemOrder,
});

export const sortMenuItemsByOrder = (items: MenuItemState[]) => [...items].sort((a, b) => {
    const aDeleted = Boolean(a.isDeleted);
    const bDeleted = Boolean(b.isDeleted);
    if (aDeleted !== bDeleted) {
        return aDeleted ? 1 : -1;
    }

    const aOrder = a.itemOrder ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.itemOrder ?? Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) {
        return aOrder - bOrder;
    }

    if (a.id && b.id && a.id !== b.id) {
        return a.id - b.id;
    }

    return a.localId.localeCompare(b.localId);
});

export const normalizeMenuItemOrder = (items: MenuItemState[]) => {
    let order = 1;

    return items.map((item) => (
        item.isDeleted
            ? item
            : { ...item, itemOrder: order++ }
    ));
};
