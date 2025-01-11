document.addEventListener('DOMContentLoaded' , () => {
    const productForm = document.querySelector('#productForm');
    productForm.addEventListener('submit' , (event) => {
        event.preventDefault();
        const productName = document.querySelector('#productName').value.trim();
        const price = document.querySelector('#price').value.trim();
        const offerOnPrice = document.querySelector('#description').value.trim();
    
    });

    productForm.addEventListener('reset' , (event) => {
        productForm.reset();
    } )
})