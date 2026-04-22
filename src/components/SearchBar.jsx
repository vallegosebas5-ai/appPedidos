import { useState } from 'react';
import './SearchBar.css';

/**
 * SearchBar - Barra de búsqueda de productos.
 * 
 * Props:
 * - onSearch: función que recibe el término de búsqueda
 * - placeholder: texto de placeholder
 */
function SearchBar({ onSearch, placeholder = 'Buscar productos...' }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Búsqueda en tiempo real
    onSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <span className="search-bar__icon">🔍</span>
      <input
        type="text"
        className="search-bar__input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
      />
      {searchTerm && (
        <button className="search-bar__clear" onClick={handleClear}>
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
