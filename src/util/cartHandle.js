async function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.target.closest('form');
    const submitButton = form.querySelector('[type="submit"], button[name="add"]');
    const originalButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = 'Adding...';

    try {
        const formData = new FormData(form);
        const mainVariantId = parseInt(formData.get('id'), 10);
        const quantity = parseInt(formData.get('quantity') || 1, 10);

        const items = [{
            id: mainVariantId,
            quantity: quantity
        }];

        const bundleCheckboxes = document.querySelectorAll('.react-bundle-checkbox:checked');
        
        bundleCheckboxes.forEach(checkbox => {
            const variantId = checkbox.getAttribute('data-variant-id');
            if (variantId) {
                items.push({
                    id: parseInt(variantId, 10),
                    quantity: 1
                });
            }
        });

        const rootUrl = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) 
            ? window.Shopify.routes.root 
            : '/';

        const response = await fetch(`${rootUrl}cart/add.js`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ items })
        });

        if (!response.ok) {
            throw new Error('Falha ao adicionar ao carrinho');
        }

        submitButton.textContent = '✓ Added!';

        const cartResponse = await fetch(`${rootUrl}cart.js`);
        const cartData = await cartResponse.json();

        document.querySelectorAll('[data-cart-count]').forEach(el => {
            el.textContent = cartData.item_count;
        });

        setTimeout(() => {
            window.location.href = `${rootUrl}cart`;
        }, 1000);

    } catch (error) {
        submitButton.textContent = 'Error - Try Again';
        
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const addForms = document.querySelectorAll('form[action$="/cart/add"]');
    
    addForms.forEach(form => {
        form.addEventListener('submit', handleAddToCart);
    });
});

async function updateCartQuantity(itemKey, newQuantity) {
    const rootUrl = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) 
        ? window.Shopify.routes.root 
        : '/';

    try {
        const response = await fetch(`${rootUrl}cart/change.js`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                id: itemKey,
                quantity: newQuantity
            })
        });

        if (!response.ok) {
            throw new Error('Falha ao atualizar a quantidade no carrinho');
        }

        const cartData = await response.json();

        document.querySelectorAll('[data-cart-count]').forEach(el => {
            el.textContent = cartData.item_count;
        });

        return cartData;

    } catch (error) {
        throw error;
    }
}

async function removeItemFromCart(itemKey) {
    return await updateCartQuantity(itemKey, 0);
}