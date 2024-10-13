/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        rancho: ['"Rancho"', 'cursive'],
        raleway: ['"Raleway"', 'sans-serif'],
        poppins: ['"poppins"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
      },
      colors: {
        'primary-h1': '#331A15',
        'secondary-h1': '#374151',
        'primary-p': '#1B1A1A',
        'secondary-p': '#1B1A1AB3',
        'btn-primary-bg':'#D2B48C',
        'btn-secondary-bg':'#F5F4F1',
      },
      boxShadow: {
        'glow': '0 0 10px rgba(27, 26, 26, 0.7)', // Custom shadow for glowing effect
      }
    },
  },
  plugins: [
    require('daisyui'),
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(27, 26, 26, 0.7)',
        },
        '.text-shadow-md': {
          textShadow: '3px 3px 6px rgba(27, 26, 26, 0.7)',
        },
        '.text-shadow-lg': {
          textShadow: '4px 4px 8px rgba(27, 26, 26, 0.7)',
        },
        '.text-shadow-xl': {
          textShadow: '5px 5px 10px rgba(27, 26, 26, 0.7)',
        },
      });
    }
  ],
}

/**
 * 
 * #1B1A1A
374151
1B1A1AB3
 */


/**
 * import React from 'react';
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // ... do things with the props
  }
}

MyComponent.propTypes = {
  // You can declare that a prop is a specific JS primitive. By default, these
  // are all optional.
  optionalArray: PropTypes.array,
  optionalBigInt: PropTypes.bigint,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  // see https://reactjs.org/docs/rendering-elements.html for more info
  optionalNode: PropTypes.node,
 * 
 */