import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useCartStore = create(persist((set) => ({
    items: [], addToCart: (product) =>
        set((state) => {
            const productId = String(product.id ?? product._id ?? "");
            if (!productId) return state;

            const existingItem = state.items.find(
                (item) => String(item.id) === productId
            );         if (existingItem) {
                return {
                    items: state.items.map((item) =>
                        String(item.id) === productId
                            ? {
                                ...item,
                                quantity: item.quantity + 1,
                            }
                            : item
                    ),
                };
            }         return {
                items: [
                    ...state.items,
                    {
                        ...product,
                        id: productId,
                        quantity: 1,
                    },
                ],
            };
        }), removeFromCart: (id) =>
        set((state) => ({
            items: state.items.filter(
                (item) => item.id !== id
            ),
        })), increaseQuantity: (id) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                    }
                    : item
            ),
        })), decreaseQuantity: (id) =>
        set((state) => ({
            items: state.items
                .map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            quantity: item.quantity - 1,
                        }
                        : item
                )
                .filter((item) => item.quantity > 0),
        })), clearCart: () => set({ items: [] }),
}), {
    name: "zarr_cart",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ items: state.items }),
}));

export default useCartStore;