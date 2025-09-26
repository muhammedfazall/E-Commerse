import { useState, useEffect } from "react";
import axios from "axios";
import { categoriesApi, productsApi } from "../api";

const sizesList = ["7", "7.5", "8", "8.5", "9", "10", "11"];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    rating: "",
    reviews: "",
    image: "",
    image2: "",
    bestseller: false,
    sizes: sizesList.map(size => ({ name: size, inStock: false })),
    description: "",
    details: "",
  });

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        setLoading(true);
        // Fetch products
        const { data: productsData } = await axios.get(`${productsApi}`);
        setProducts(productsData);

        // Fetch categories
        const { data: categoriesData } = await axios.get(`${categoriesApi}`);
        setCategories(categoriesData.map((cat) => cat.name));
      } catch (err) {
        console.log("Error fetching products or categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${productsApi}/${productId}`);
        setProducts(products.filter((product) => product.id !== productId));
      } catch (err) {
        console.log("Error deleting product", err);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${productsApi}/${editingProduct.id}`,
        editingProduct
      );
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id ? data : product
        )
      );
      setEditingProduct(null);
    } catch (err) {
      console.log("Error updating product", err);
      alert("Failed to update product. Please try again.");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {

      if (!product.name || !product.category || !product.price) {
      alert("Please fill in all required fields");
      return;
    }

      const newProductData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        rating: parseInt(newProduct.rating) || 0,
        reviews: parseInt(newProduct.reviews) || 0,
      };
      const { data } = await axios.post(productsApi, newProductData);
      setProducts([...products, data]);
      setShowAddForm(false);
      setNewProduct({
        name: "",
        category: "",
        price: "",
        rating: "",
        reviews: "",
        image: "",
        image2: "",
        bestseller: false,
        sizes: sizesList.map((size) => ({ name: size, inStock: false })),
        description: "",
        details: "",
      });
    } catch (err) {
      console.log("Error adding product", err);
      alert("Failed to add product. Please try again.");
    }
  };

  const toggleSizeStock = (sizeName, isEditing = false) => {
    if (isEditing) {
      setEditingProduct({
        ...editingProduct,
        sizes: editingProduct.sizes.map((size) =>
          size.name === sizeName ? { ...size, inStock: !size.inStock } : size
        ),
      });
    } else {
      setNewProduct({
        ...newProduct,
        sizes: newProduct.sizes.map((size) =>
          size.name === sizeName ? { ...size, inStock: !size.inStock } : size
        ),
      });
    }
  };

  const getStockStatus = (sizes) => {
    const inStockSizes = sizes.filter((size) => size.inStock);
    return inStockSizes.length > 0 ? "In Stock" : "Out of Stock";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Products Management
          </h1>
          <p className="text-gray-600">
            {products.length} products found
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bestseller
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover mr-3"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[150px] sm:max-w-xs">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.reviews} reviews
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">
                    ${product.price}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-1">
                        {product.rating}
                      </span>
                      <svg
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm font-medium ${
                          getStockStatus(product.sizes) === "In Stock"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {getStockStatus(product.sizes)}
                      </span>
                      <div className="relative group inline-block">
                        <button className="text-blue-600 hover:text-blue-900 text-xs bg-blue-50 px-2 py-1 rounded">
                          Sizes
                        </button>
                        <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <div className="p-3">
                            <div className="text-xs font-medium text-gray-500 mb-2">
                              Size Availability
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {product.sizes.map((size) => (
                                <div key={size.name} className="text-center">
                                  <div
                                    className={`text-xs font-medium ${
                                      size.inStock
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {size.name}
                                  </div>
                                  <div
                                    className={`w-3 h-3 rounded-full mx-auto ${
                                      size.inStock ? "bg-green-400" : "bg-red-400"
                                    }`}
                                  ></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.bestseller
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                      }`}
                    >
                      {product.bestseller ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                        title="Edit Product"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                        title="Delete Product"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or add a new product.</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <ProductForm
          product={newProduct}
          setProduct={setNewProduct}
          onSubmit={handleAddProduct}
          onClose={() => setShowAddForm(false)}
          title="Add New Product"
          toggleSizeStock={toggleSizeStock}
          categories={categories}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          setProduct={setEditingProduct}
          onSubmit={handleSaveEdit}
          onClose={() => setEditingProduct(null)}
          title="Edit Product"
          toggleSizeStock={(sizeName) => toggleSizeStock(sizeName, true)}
          isEditing={true}
          categories={categories}
        />
      )}
    </div>
  );
}


// Reusable Product Form Component
function ProductForm({
  product,
  setProduct,
  onSubmit,
  onClose,
  title,
  toggleSizeStock,
  isEditing = false,
  categories = []
}) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Basic Information</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={product.name}
                    onChange={(e) =>
                      setProduct({ ...product, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={product.category}
                    onChange={(e) =>
                      setProduct({ ...product, category: e.target.value })
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={product.price}
                      onChange={(e) =>
                        setProduct({ ...product, price: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={product.rating}
                      onChange={(e) =>
                        setProduct({ ...product, rating: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reviews Count
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={product.reviews}
                    onChange={(e) =>
                      setProduct({ ...product, reviews: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="bestseller"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={product.bestseller}
                    onChange={(e) =>
                      setProduct({ ...product, bestseller: e.target.checked })
                    }
                  />
                  <label
                    htmlFor="bestseller"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Bestseller
                  </label>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Product Images</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Main Image URL
                  </label>
                  <input
                    type="url"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={product.image}
                    onChange={(e) =>
                      setProduct({ ...product, image: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Image URL
                  </label>
                  <input
                    type="url"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={product.image2}
                    onChange={(e) =>
                      setProduct({ ...product, image2: e.target.value })
                    }
                  />
                </div>

                {/* Image Previews */}
                <div className="grid grid-cols-2 gap-3">
                  {product.image && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Main Image Preview
                      </label>
                      <img
                        src={product.image}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  {product.image2 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secondary Image Preview
                      </label>
                      <img
                        src={product.image2}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Size Availability */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Size Availability
              </h4>
              <div className="grid grid-cols-7 gap-2">
                {product.sizes.map((size) => (
                  <div key={size.name} className="text-center">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size {size.name}
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleSizeStock(size.name, isEditing)}
                      className={`w-full py-2 rounded-lg text-xs font-medium transition-colors ${
                        size.inStock
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {size.inStock ? "In Stock" : "Out of Stock"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Description & Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={product.description}
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={product.details}
                  onChange={(e) =>
                    setProduct({ ...product, details: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isEditing ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
