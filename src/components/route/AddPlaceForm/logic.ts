export interface CategoryNode {
    id: string;
    name: string;
    children?: CategoryNode[];
}

export function getAllChildIds(category: CategoryNode): string[] {
    let ids: string[] = [category.id];
    if (category.children) {
        category.children.forEach(child => {
            ids = [...ids, ...getAllChildIds(child)];
        });
    }
    return ids;
}

export function getParentIds(categoryId: string, category: CategoryNode): string[] {
    let parents: string[] = [];
    if (category.children) {
        for (const child of category.children) {
            if (child.id === categoryId) {
                return [category.id];
            }
            const childParents = getParentIds(categoryId, child);
            if (childParents.length > 0) {
                return [category.id, ...childParents];
            }
        }
    }
    return parents;
}