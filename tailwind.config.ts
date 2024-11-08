import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors:{
      'white':'#ffffff',
      'black':'#000000',
      'vague':'#f7f7f7',

      'lightblue':'#e4e6eb',
      'pastelblue':'#8bb4c9',
      'blue':'#2c5edb',
      'bluegrey':'#b6c1d4',
      'steelgrey':'#5e6673',
      'darksteelgrey':'#202b3d',

      'red':'#e34653',
      'pink':'#ffc7d1',

      'mauve':'#54567d',
      'cerulean':'#22266b',
      'depths':'#090b24',

      'lightgrey':'#c9c9c9',
      'darkgrey':'#4f4f4f',
    },
    fontFamily:{
      'header':['Roboto', 'sans-serif'],
      'body':['Nonserif', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
