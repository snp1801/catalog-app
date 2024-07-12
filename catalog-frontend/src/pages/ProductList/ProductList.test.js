import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductList from './ProductList';
import { BrowserRouter } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';

// Mock fetch
fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});

const mockSetSelectedCollections = jest.fn();
const mockSetSelectedCategories = jest.fn();
const mockSetSelectedColors = jest.fn();
const mockSetAllProducts = jest.fn();
const mockSetProducts = jest.fn();


describe('ProductList Component', () => {
    const mockProducts = [
        { id: 1, title: 'Product 1', price: '500', collection: 'Summer', type: 'Shirt', color: ['Red'], productImg: ['/path/to/image1.jpg'] },
        { id: 2, title: 'Product 2', price: '1500', collection: 'Winter', type: 'Jacket', color: ['Blue'], productImg: ['/path/to/image2.jpg'] },
        { id: 3, title: 'Product 3', price: '10500', collection: 'Winter', type: 'Pant', color: ['Blue'], productImg: ['/path/to/image3.jpg'] }
    ];
    beforeEach(() => {
        fetch.mockClear();
    });

    it('fetches products and displays them', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            items: [
                { id: 1, title: 'Product 1', price: '500', collection: 'Summer', type: 'Shirt', color: ['Red'], productImg: ['/path/to/image1.jpg'] },
                { id: 2, title: 'Product 2', price: '1500', collection: 'Winter', type: 'Jacket', color: ['Blue'], productImg: ['/path/to/image2.jpg'] },
                { id: 3, title: 'Product 3', price: '10500', collection: 'Winter', type: 'Pant', color: ['Blue'], productImg: ['/path/to/image3.jpg'] }
            ]
        }));

        render(
            <BrowserRouter>
                <ProductList
                    allProducts={[]}
                    setAllProducts={mockSetAllProducts}
                    products={mockProducts}
                    sliderValue={1000}
                    setSliderValue={() => { }}
                    searchText=""
                    setSelectedCollections={() => { }}
                    setSelectedCategories={() => { }}
                    setSelectedColors={() => { }}
                    selectedColors={[]}
                    selectedCollections={[]}
                    selectedCategories={[]}
                    setProducts={mockSetProducts}
                />
            </BrowserRouter>
        );

        // Check if fetch was called
        expect(fetch).toHaveBeenCalledTimes(1);
        // expect(screen.getByText('No Items Found')).toBeInTheDocument();

        // Wait for the products to be displayed
        await waitFor(() => {
            expect(mockSetAllProducts).toHaveBeenCalled();
        });
        expect(screen.getByText('Shirt')).toBeInTheDocument();
        expect(screen.getByText('Jacket')).toBeInTheDocument();
        expect(screen.getByAltText(/Product 1/i)).toHaveAttribute('src', '/path/to/image1.jpg')
    });

    it('displays "No Items Found" when no products are available and not loading', () => {
        render(
            <BrowserRouter>
                <ProductList
                    allProducts={[]}
                    setAllProducts={mockSetAllProducts}
                    products={[]}
                    sliderValue={1000}
                    setSliderValue={() => { }}
                    searchText=""
                    setSelectedCollections={() => { }}
                    setSelectedCategories={() => { }}
                    setSelectedColors={() => { }}
                    selectedColors={[]}
                    selectedCollections={[]}
                    selectedCategories={[]}
                    setProducts={mockSetProducts}
                />
            </BrowserRouter>
        );
        const slider = screen.getByTestId('price-range');
        fireEvent.change(slider, { target: { value: '500' } });

        expect(screen.getByText('No Items Found')).toBeInTheDocument();
    });

    it('filters products based on slider value', async () => {

        render(
            <BrowserRouter>
                <ProductList
                    allProducts={mockProducts}
                    setAllProducts={() => { }}
                    products={[]}
                    sliderValue={1000}
                    setSliderValue={() => { }}
                    searchText=""
                    setSelectedCollections={() => { }}
                    setSelectedCategories={() => { }}
                    setSelectedColors={() => { }}
                    selectedColors={[]}
                    selectedCollections={[]}
                    selectedCategories={[]}
                    setProducts={mockSetProducts}
                />
            </BrowserRouter>
        );

        const slider = screen.getByTestId('price-range');
        fireEvent.change(slider, { target: { value: '500' } });

        // Assuming the filterProducts function is called and updates products
        expect(mockSetProducts).toHaveBeenCalledWith([
            { id: 1, title: 'Product 1', price: '500', collection: 'Summer', type: 'Shirt', color: ['Red'], productImg: ['/path/to/image1.jpg'] }
        ]);
        // fireEvent.change(slider, { target: { value: '12000' } });
        // await waitFor(() => {
        //     expect(setProducts).toHaveBeenCalledWith(mockProducts);
        // });
    });

    const setup = () => {
        render(
            <ProductList
                allProducts={mockProducts}
                setAllProducts={() => { }}
                products={[]}
                sliderValue={10000}
                setSliderValue={() => { }}
                searchText=""
                setSelectedCollections={mockSetSelectedCollections}
                setSelectedCategories={mockSetSelectedCategories}
                setSelectedColors={mockSetSelectedColors}
                selectedColors={[/red/i]}
                selectedCollections={[/Summer/i]}
                selectedCategories={[/shirt/i]}
                setProducts={() => { }}
            />
        );
    };

    it('calls setSelectedCollections when a collection checkbox is changed', () => {
        setup();
        const checkbox = screen.getByLabelText(/Summer/i);
        userEvent.click(checkbox);

        expect(mockSetSelectedCollections).toHaveBeenCalled();
        expect(mockSetSelectedCollections).toHaveBeenCalledWith(expect.any(Function));
        userEvent.click(screen.getByLabelText(/winter/i));
        expect(mockSetSelectedCollections).toHaveBeenCalledWith(expect.any(Function));
    });

    test('calls setSelectedCategories when a category checkbox is changed', () => {
        setup();
        const checkbox = screen.getByLabelText(/Shirt/i);
        userEvent.click(checkbox);

        expect(mockSetSelectedCategories).toHaveBeenCalled();
        expect(mockSetSelectedCategories).toHaveBeenCalledWith(expect.any(Function));
        userEvent.click(screen.getByLabelText(/jacket/i));
        expect(mockSetSelectedCategories).toHaveBeenCalled();
        expect(mockSetSelectedCategories).toHaveBeenCalledWith(expect.any(Function));
    });

    it('calls setSelectedColors when a color checkbox is changed', () => {
        setup();
        const checkbox = screen.getByLabelText(/red/i);
        userEvent.click(checkbox);

        expect(mockSetSelectedColors).toHaveBeenCalled();
        expect(mockSetSelectedColors).toHaveBeenCalledWith(expect.any(Function));
        userEvent.click(screen.getByLabelText(/blue/i));
        expect(mockSetSelectedColors).toHaveBeenCalled();
        expect(mockSetSelectedColors).toHaveBeenCalledWith(expect.any(Function));
    });


    // test('navigate to product details on click', () => {
    //     setup();
    //     const product = screen.getAllByTestId('product');

    // })
});