import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import UserCart from "../components/userpage/UserCart";
import UserHeader from "../components/userpage/UserHeader";
import UserNavigation from "../components/userpage/UserNavigation";
import UserProductsList from "../components/userpage/UserProductList";
import UserProfile from "../components/userpage/UserProfile";
import { fetchProducts } from "../utils/services/product.service";

const UserPage = () => {
  // Demo user data
  const [user, setUser] = useState({
    name: "Rahul Sharma",
    class: {
      name: "12th Grade",
      section: "Science A",
    },
    admissionNumber: "STU20230045",
    balance: 1250.0,
    dueAmount: 2500.0,
    paidAmount: 3750.0,
    cartItems: 3,
  });

  // Demo products data
  const [products, setProducts] = useState([]);

  // Demo cart items
  const [cart, setCart] = useState([
    { id: 1, name: "Mathematics Textbook", price: 450.0, quantity: 1 },
    { id: 3, name: "Scientific Calculator", price: 650.0, quantity: 1 },
    { id: 5, name: "School Bag", price: 950.0, quantity: 1 },
  ]);

  const [activeTab, setActiveTab] = useState("products");

  const getProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setUser({ ...user, cartItems: user.cartItems + 1 });
  };

  const removeFromCart = (productId: any) => {
    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      setCart(cart.filter((item) => item.id !== productId));
    }
    setUser({ ...user, cartItems: user.cartItems - 1 });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <UserHeader user={user} />

      {/* User Profile Bar */}
      <UserProfile user={user} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <UserNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cart={cart}
        />

        {/* Products Tab */}
        {activeTab === "products" && (
          <UserProductsList products={products} addToCart={addToCart} />
        )}

        {/* Cart Tab */}
        {activeTab === "cart" && (
          <UserCart
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            calculateTotal={calculateTotal}
          />
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <CreditCard className="mr-2 w-5 h-5 text-blue-600" />
                Payment History
              </h3>
            </div>

            <div className="divide-y divide-gray-100">
              {/* Payment Item 1 */}
              <div className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="p-2 mr-3 rounded-lg bg-green-50 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Tuition Fee - Quarter 1
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Paid on 15 Jun 2023
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-semibold text-green-600">
                      ₹1,250.00
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      PAY20230615001
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Item 2 */}
              <div className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="p-2 mr-3 rounded-lg bg-green-50 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Annual Charges
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Paid on 05 Apr 2023
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-semibold text-green-600">
                      ₹2,500.00
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      PAY20230405002
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Outstanding Dues */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center">
                  <div className="p-2 mr-3 rounded-lg bg-amber-50 text-amber-600">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Outstanding Dues
                    </h4>
                    <p className="text-sm text-gray-500">Due by 30 Sep 2023</p>
                  </div>
                </div>
                <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm flex items-center whitespace-nowrap">
                  <CreditCard className="mr-2 w-4 h-4" />
                  Pay Now (₹{user.dueAmount.toFixed(2)})
                </button>
              </div>
            </div>

            {/* Optional: View All Button */}
            <div className="px-6 py-3 bg-gray-50 text-center">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center w-full">
                View all transactions
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 mb-2 md:mb-0">
              © 2023 SchoolEase Portal - All rights reserved
            </p>
            <button className="text-sm text-red-600 hover:text-red-800 flex items-center">
              <LogOut className="mr-1" />
              Logout
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserPage;
