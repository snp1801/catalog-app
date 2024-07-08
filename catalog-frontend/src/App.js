import { useState, useEffect, useCallback } from 'react';
import ProductList from './pages/ProductList';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Product from './pages/ProductDetails';
import NavBar from './components/NavBar';
import './scss/NavBar.scss'
import './scss/ProductList.scss'
import './scss/ProductDetails.scss'

function App() {
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]); // Initialize state with an empty array
    const [sliderValue, setSliderValue] = useState();
    const [searchText, setSearchText] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);

    const filterProducts = useCallback((range, searchText, selectedCollections, selectedCategories, selectedColors) => {
        return allProducts.filter(product => {
            let matchesPrice
            if (range < 10000) {
                matchesPrice = parseInt(product.price) <= parseInt(range);
            }
            else {
                matchesPrice = parseInt(product.price);
            }
            const matchesText = product.title.toLowerCase().includes(searchText.toLowerCase());
            const matchesCollection = selectedCollections.length === 0 || selectedCollections.includes(product.collection);
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.type);
            const matchesColor = selectedColors.length === 0 || product.color.some(color => selectedColors.includes(color));
            return matchesPrice && matchesText && matchesCollection && matchesCategory && matchesColor;
        });
    }, [allProducts])

    useEffect(() => {
        setProducts(filterProducts(sliderValue, searchText, selectedCollections, selectedCategories, selectedColors));
    }, [sliderValue, searchText, selectedCollections, selectedCategories, selectedColors, filterProducts])

    return (
        <Router>
            <div className='main-content' style={{ maxWidth: '90%',margin: 'auto'}}>
            <NavBar setProducts={setProducts} filterProducts={filterProducts} searchText={searchText} setSearchText={setSearchText} />
            <Routes>
                <Route path='/' element={<ProductList allProducts={allProducts} setAllProducts={setAllProducts} products={products} sliderValue={sliderValue} setSliderValue={setSliderValue} searchText={searchText} setSelectedCategories={setSelectedCategories} setSelectedCollections={setSelectedCollections} setSelectedColors={setSelectedColors} />} />
                <Route path='/product/:productId' element={<Product />} />
            </Routes>
        </div>
        </Router >
    );
}

export default App;