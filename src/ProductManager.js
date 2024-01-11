const fs = require('fs')

class ProductManager {

    constructor(pathFile) {
        this.path = pathFile
        this.id = 0
        this.initialize()
    }

    async initialize() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.products = JSON.parse(data) || []
            this.id = this.calculateNextId()
        } catch (error) {
            console.error('Error initializing ProductManager', error)
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
    const productManager = new ProductManager('./products.json')
    await productManager.initialize()

    //Add products
    // productManager.addProduct({ title: 'Product1', description: 'description1', price: 34, thumbnail: 'thumbnail1.jpg', code: 'P001', stock: 23 })
    // productManager.addProduct({ title: 'Product2', description: 'description2', price: 45, thumbnail: 'thumbnail2.jpg', code: 'P002', stock: 34 })
    // productManager.addProduct({ title: 'Product3', description: 'description3', price: 45, thumbnail: 'thumbnail3.jpg', code: 'P003', stock: 55 })
    // productManager.addProduct({ title: 'Product3', description: 'description3', price: 45, thumbnail: 'thumbnail3.jpg', code: 'P003', stock: 55 })
    // productManager.addProduct({ title: 'Product4', description: 'description4', price: 48, thumbnail: 'thumbnail4.jpg', code: 'P004', stock: 87 })

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
    /* productManager.deleteProduct(4) */

})()




