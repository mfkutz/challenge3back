const fs = require('fs')
class ProductManager {

    constructor(pathFile) {
        this.path = pathFile
        this.id = 0
        this.initialize()
    }

    async initialize() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data) || [];
            this.id = this.calculateNextId();
        } catch (error) {
            console.error(`Error initializing ProductManager: ${error.message}`);
            throw error;
        }
    }

    calculateNextId() {
        const calcMaxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0)
        return calcMaxId + 1
    }

    async addProduct(product) {
        if (product.title && product.description && product.price && product.thumbnail && product.code && product.stock) {
            let found = this.products.find(prod => prod.code === product.code)
            if (!found) {
                //Calc next id before add product
                const newId = this.calculateNextId()
                product.id = newId
                this.products.push(product)
                //Update this.id with new value
                this.id = newId
                //Add without overwriting
                const newList = JSON.stringify(this.products, null, 2)
                try {
                    await fs.promises.writeFile(this.path, newList, 'utf-8')
                    console.log('Product added successfully')
                } catch (error) {
                    console.error('Error writing to file', error)
                }
            } else {
                let found = this.products.find(prod => prod.code === product.code)
                console.error(`The code "${found.code}" is already in use `)
            }
        }
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse(data)
        } catch (error) {
            return []
        }
    }

    async getProductBytId(id) {
        const products = await this.getProducts()
        const foundProduct = products.find(product => product.id === id)
        return foundProduct || 'Not found'
    }

    async updateProduct(id, updatedFields) {
        const products = await this.getProducts()
        const index = products.findIndex(product => product.id === id)
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedFields, id }
            try {
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8')
                console.log('successful modification')
            } catch (error) {
                console.error('Error writing to file:', error)
            }
        } else if (index === -1) {
            console.log('Product does not exist')
            return null
        }
    }

    async deleteProduct(id) {
        const products = await this.getProducts()
        if (products.find(product => product.id === id)) {
            const filteredProducts = products.filter(product => product.id !== id)
            await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 2), 'utf-8')
            console.log('Product deleted.')
        } else {
            console.log('Product not found')
        }
    }
}

// Test
(async () => {
    const productManager = new ProductManager('./src/products.json') // OK
    await productManager.initialize()

    //Add products
    // productManager.addProduct({ title: 'Product1', description: 'description1', price: 34, thumbnail: 'thumbnail1.jpg', code: 'P001', stock: 23 })
    // productManager.addProduct({ title: 'Product2', description: 'description2', price: 45, thumbnail: 'thumbnail2.jpg', code: 'P002', stock: 34 })
    // productManager.addProduct({ title: 'Product3', description: 'description3', price: 45, thumbnail: 'thumbnail3.jpg', code: 'P003', stock: 55 })
    // productManager.addProduct({ title: 'Product4', description: 'description4', price: 32, thumbnail: 'thumbnail4.jpg', code: 'P004', stock: 32 })
    // productManager.addProduct({ title: 'Product5', description: 'description5', price: 44, thumbnail: 'thumbnail5.jpg', code: 'P005', stock: 12 })
    // productManager.addProduct({ title: 'Product6', description: 'description6', price: 32, thumbnail: 'thumbnail6.jpg', code: 'P006', stock: 67 })
    // productManager.addProduct({ title: 'Product7', description: 'description7', price: 12, thumbnail: 'thumbnail7.jpg', code: 'P007', stock: 89 })
    // productManager.addProduct({ title: 'Product8', description: 'description8', price: 78, thumbnail: 'thumbnail8.jpg', code: 'P008', stock: 78 })
    // productManager.addProduct({ title: 'Product9', description: 'description9', price: 98, thumbnail: 'thumbnail9.jpg', code: 'P009', stock: 67 })
    // productManager.addProduct({ title: 'Product10', description: 'description10', price: 87, thumbnail: 'thumbnail10.jpg', code: 'P010', stock: 56 })
    // productManager.addProduct({ title: 'Product11', description: 'description11', price: 78, thumbnail: 'thumbnail11.jpg', code: 'P011', stock: 55 })
    // productManager.addProduct({ title: 'Product12', description: 'description12', price: 77, thumbnail: 'thumbnail12.jpg', code: 'P012', stock: 79 })
    // productManager.addProduct({ title: 'Product13', description: 'description13', price: 65, thumbnail: 'thumbnail13.jpg', code: 'P013', stock: 90 })
    // productManager.addProduct({ title: 'Product14', description: 'description14', price: 74, thumbnail: 'thumbnail14.jpg', code: 'P014', stock: 99 })
    // productManager.addProduct({ title: 'Product15', description: 'description15', price: 88, thumbnail: 'thumbnail15.jpg', code: 'P015', stock: 03 })

    //All products
    /* productManager.getProducts()
        .then(res => console.log(res))
        .catch(error => console.error(error)) */

    //Obtein product by ID
    /* const productIdToFind = 2
    productManager.getProductBytId(productIdToFind)
        .then(res => console.log(res))
        .catch(error => console.error(error)) */

    //Update Product
    /* productManager.updateProduct(1, { title: 'ProductModified2', price: 532 }) */

    //Delete product
    // productManager.deleteProduct(4)

})()

module.exports = ProductManager


