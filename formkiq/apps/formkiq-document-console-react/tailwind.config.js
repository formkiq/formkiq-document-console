const {createGlobPatternsForDependencies} = require('@nrwl/react/tailwind');
const {join} = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          default: "#DF6C20",
          50: '#FEF9F6',
          100: '#F3CAAF',
          200: '#EEB38B',
          300: '#E99B67',
          400: '#E48444',
          500: '#DF6C20',
          600: '#AE5419',
          700: '#7D3C12',
          800: '#4C250B',
          900: '#1B0D04'
        },
        secondary: {
          400: "#f87171",
          500: "#ef4444",
        },
        neutral: {
          default: '#737373',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a'
        },
        yellowGray: {
          400: "#f8f4dc",
          500: "#f4eec7",
        },
        orangeGray: {
          300: "#db9e7c",
          500: "#db8150",
        },
        brown: {
          default: "#562701",
          100: "#CF5E02",
          200: "#B15102",
          300: "#924301",
          400: "#743501",
          500: "#562701",
          600: "#472001",
          700: "#381901",
          800: "#281200",
          900: "#190C00",
        },
        coreOrange: {
          default: "#DF6C20",
          50: '#FEF9F6',
          100: '#F3CAAF',
          200: '#EEB38B',
          300: '#E99B67',
          400: '#E48444',
          500: '#DF6C20',
          600: '#AE5419',
          700: '#7D3C12',
          800: '#4C250B',
          900: '#1B0D04'
        },
        proTeal: {
          default: "#007F80",
          100: "#C7FFFF",
          200: "#1AFFFF",
          300: "#00E5E6",
          400: "#00B2B3",
          500: "#007F80",
          600: "#006869",
          700: "#00191A",
          800: "#000000",
          900: "#000000",
        },
        enterpriseBlue: {
          default: "#210047",
          100: "#983DFF",
          200: "#7700FF",
          300: "#5A00C2",
          400: "#2a005b",
          500: "#210047",
          600: "#1A0038",
          700: "#130029",
          800: "#0C001A",
          900: "#05000A",
        },
        'flamingo': {
          DEFAULT: '#EF4444',
          '50': '#FDEDED',
          '100': '#FCDADA',
          '200': '#F9B5B5',
          '300': '#F58F8F',
          '400': '#F26A6A',
          '500': '#EF4444',
          '600': '#E71414',
          '700': '#B30F0F',
          '800': '#800B0B',
          '900': '#4C0707'
        },
        'turbo': {
          DEFAULT: '#FFEA00',
          '50': '#FFF9B8',
          '100': '#FFF7A3',
          '200': '#FFF47A',
          '300': '#FFF152',
          '400': '#FFED29',
          '500': '#FFEA00',
          '600': '#C7B600',
          '700': '#8F8300',
          '800': '#574F00',
          '900': '#1F1C00'
        },
        'citrus': {
          DEFAULT: '#93C70E',
          '50': '#DCF895',
          '100': '#D5F682',
          '200': '#C9F45C',
          '300': '#BCF136',
          '400': '#AFED11',
          '500': '#93C70E',
          '600': '#6C930A',
          '700': '#455E07',
          '800': '#1F2A03',
          '900': '#000000'
        },
        'buttercup': {
          DEFAULT: '#F59E0B',
          '50': '#FCE4BB',
          '100': '#FBDCA8',
          '200': '#FACD81',
          '300': '#F8BD59',
          '400': '#F7AE32',
          '500': '#F59E0B',
          '600': '#C07C08',
          '700': '#8A5906',
          '800': '#543603',
          '900': '#1E1401'
        },
        'mountain-meadow': {
          DEFAULT: '#10B981',
          '50': '#8CF5D2',
          '100': '#79F3CB',
          '200': '#53F0BC',
          '300': '#2EEDAE',
          '400': '#13DF9B',
          '500': '#10B981',
          '600': '#0C855D',
          '700': '#075239',
          '800': '#031E15',
          '900': '#000000'
        },
        'dodger-blue': {
          DEFAULT: '#3B82F6',
          '50': '#EBF2FE',
          '100': '#D7E6FD',
          '200': '#B0CDFB',
          '300': '#89B4FA',
          '400': '#629BF8',
          '500': '#3B82F6',
          '600': '#0B61EE',
          '700': '#084BB8',
          '800': '#063583',
          '900': '#041F4D'
        },
        'cornflower-blue': {
          DEFAULT: '#6392F1',
          '50': '#FFFFFF',
          '100': '#F9FBFE',
          '200': '#D3E1FB',
          '300': '#AEC6F8',
          '400': '#88ACF4',
          '500': '#6392F1',
          '600': '#306EEC',
          '700': '#1352D1',
          '800': '#0E3E9E',
          '900': '#0A2A6A'
        },
        'orchid': {
          DEFAULT: '#D878D0',
          '50': '#FFFFFF',
          '100': '#FDF7FC',
          '200': '#F3D7F1',
          '300': '#EAB7E6',
          '400': '#E198DB',
          '500': '#D878D0',
          '600': '#CB4DC1',
          '700': '#AD32A3',
          '800': '#82267A',
          '900': '#561951'
        },
        'french-rose': {
          DEFAULT: '#EC4899',
          '50': '#FDEEF6',
          '100': '#FBDCEB',
          '200': '#F8B7D7',
          '300': '#F492C2',
          '400': '#F06DAE',
          '500': '#EC4899',
          '600': '#E4187D',
          '700': '#B11261',
          '800': '#7F0D45',
          '900': '#4C0829'
        },
        'ochre': {
          DEFAULT: '#BE7F51',
          '50': '#F0E1D7',
          '100': '#EAD6C8',
          '200': '#DFC1AA',
          '300': '#D4AB8C',
          '400': '#C9956F',
          '500': '#BE7F51',
          '600': '#9C643A',
          '700': '#744A2B',
          '800': '#4B301C',
          '900': '#22160D'
        },
      },
      fontFamily: {
        sans:['Urbanist', "ui-sans-serif", "system-ui", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
      },
      fontSize: {
        "smaller": "0.8125rem",
        "xxs": "0.625rem",
        "medsmall": "0.75rem",
      },
      letterSpacing: {
        "tightest": '-.075em'
      },
      padding: {
        4.1: "1.08rem",
        18: "4.5rem",
      },
      inset: {
        0: 0,
        auto: "auto",
        "1/3": "33%",
        "1/4": "25%",
        "1/8": "12.5%"
      },
      spacing: {
        px: "1px",
        0: "0",
        0.3: "0.075rem",
        0.5: "0.125rem",
        1: "0.25rem",
        2: "0.5rem",
        2.1: "0.55rem",
        2.5: "0.625rem",
        3: "0.75rem",
        3.5: "0.875rem",
        4: "1rem",
        4.45: "1.075rem",
        4.5: "1.125rem",
        5: "1.25rem",
        5.5: "1.375rem",
        6: "1.5rem",
        8: "2rem",
        9.45: "2.15rem",
        10: "2.5rem",
        10.5: "2.62rem",
        11.5: "2.88rem",
        12: "3rem",
        13.5: "3.43rem",
        14: "3.5rem",
        14.5: "3.68rem",
        16: "4rem",
        18: "4.5rem",
        20: "5rem",
        22: "5.5rem",
        24: "6rem",
        26: "6.5rem",
        28: "7rem",
        30: "7.5rem",
        32: "8rem",
        34: "8.5rem",
        36: "9rem",
        38: "9.5rem",
        40: "10rem",
        44: "11rem",
        48: "12rem",
        52: "13rem",
        56: "14rem",
        62: "15.5rem",
        64: "16rem",
        68: "17rem",
        72: "18rem",
        76: "19rem",
        80: "20rem",
        100: "24rem",
        116: "28rem",
        124: "30rem",
        132: "32rem",
        "1/2w": "50vw",
        "7/10h": "68vh",
        "92/100h": "92vh",
        "1/8": "12.5%",
        "7/8": "87.5%",
        "43px": "43px",
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
