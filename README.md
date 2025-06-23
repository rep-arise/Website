# Rep Arise - Premium Replica Sneakers E-commerce

A modern, responsive e-commerce website for high-quality 1:1 replica sneakers at affordable prices.

## Description

Rep Arise is a static e-commerce website designed to showcase and sell premium replica sneakers. The site features a clean, modern design with smooth animations and a responsive layout that works across all devices. It offers an intuitive shopping experience with advanced filtering, search capabilities, and brand-specific collections.

## Features

- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices
- **Brand Collections**: Dedicated pages for Nike, Adidas, Jordan, New Balance, Asics, Converse, Puma, and Reebok
- **Advanced Product Filtering**: Filter by brand, category, size, and price range
- **Search Functionality**: Real-time product search with visual feedback
- **Product Categories**: Men's, Women's, and Unisex collections
- **Interactive UI**: Smooth animations and transitions for an engaging user experience
- **Quick View**: Product quick view functionality without page reload
- **Social Media Integration**: Links to Instagram and Telegram channels
- **Mobile-Optimized Navigation**: Hamburger menu and filter sidebar for mobile devices

## Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Custom styling with flexbox and grid layouts
- **JavaScript (ES6+)**: Dynamic content and interactive features
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Typography with Poppins font family
- **JSON**: Product data storage in structured format
- **Node.js**: Utility scripts for site maintenance

## Setup & Installation

### Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/rep-arise.git
   cd rep-arise
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start a local development server:
   ```
   npx http-server
   ```

4. Access the website:
   ```
   http://localhost:8080
   ```

## Project Structure

```
website/
  ├── brands/              # Brand-specific pages
  │   ├── adidas.html
  │   ├── asics.html
  │   └── ...
  ├── css/
  │   └── styles.css       # Main stylesheet
  ├── images/              # Image assets
  │   ├── highlights/
  │   ├── man/
  │   ├── women/
  │   └── unisex/
  ├── js/
  │   ├── animations.js    # UI animations and interactions
  │   ├── app.js           # Main application logic
  │   ├── products.js      # Product rendering and filtering
  │   ├── search.js        # Search functionality
  │   └── ...
  ├── man/                 # Men's products data
  │   └── products.json
  ├── women/               # Women's products data
  │   └── products.json
  ├── unisex/              # Unisex products data
  │   └── products.json
  ├── index.html           # Homepage
  ├── products.html        # Main products page
  ├── update_brand_pages.js # Utility script for brand pages
  └── update_brand_search.js # Utility script for search functionality
```

## Usage

### Browsing Products

1. Navigate to the "Shop" page from the main navigation
2. Use the filter sidebar to narrow down products by:
   - Brand
   - Category (Men/Women)
   - Size
   - Price range
3. Use the sort dropdown to order products by:
   - Newest first
   - Price: Low to High
   - Price: High to Low

### Searching Products

1. Click the search icon in the navigation bar
2. Enter your search query in the search box
3. Results will update in real-time as you type

### Brand Collections

1. Navigate to a specific brand page from the "Shop By Brand" section on the homepage
2. Each brand page shows products filtered for that specific brand
3. Use the filter options to further refine the brand-specific collection

## Maintenance Scripts

The project includes utility Node.js scripts for site maintenance:

- **update_brand_pages.js**: Updates the structure of all brand pages
  ```
  node update_brand_pages.js
  ```

- **update_brand_search.js**: Adds search functionality to all brand pages
  ```
  node update_brand_search.js
  ```

## Known Issues

- Product images are currently placeholders (SVG files)
- Some filter combinations may result in no products being displayed
- Price slider may not sync perfectly with input fields in some browsers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Rep Arise - [Instagram](https://www.instagram.com/rep.arise/) | [Telegram](https://t.me/rep_arise) 