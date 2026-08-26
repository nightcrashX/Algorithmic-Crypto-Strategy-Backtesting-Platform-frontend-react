// // import { defineConfig } from 'vite'
// // import react, { reactCompilerPreset } from '@vitejs/plugin-react'
// // import babel from '@rolldown/plugin-babel'
// // import tailwindcss from "@tailwindcss/vite"



// // // https://vite.dev/config/
// // export default defineConfig({
// //   plugins: [
// //     react(),
// //     babel({ presets: [reactCompilerPreset()] }),
// //     tailwindcss(),
// //   ],
// // })

// //vite.config.js
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//   ],
//   server: {
//     proxy: {
//       '/user': {
//         target: 'http://localhost:8000',
//         changeOrigin: true,
//         secure: false,
//       }
//     }
//   }
// });
// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react' // or vue, etc.


// // export default defineConfig({
// //   plugins: [react()],
// //   server: {
// //     proxy: {
// //       '/user': {
// //         target: 'http://localhost:8000',
// //         changeOrigin: true,
// //         secure: false,
// //       }
// //     }
// //   }
// // })


// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/user': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      // Correct WebSocket proxy configuration
      '/live': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        ws: true,
        // Don't rewrite the path
        rewrite: (path) => path,
        // Configure WebSocket upgrade
        configure: (proxy, options) => {
          proxy.on('upgrade', (req, socket, head) => {
            console.log('WebSocket upgrade request:', req.url);
          });
        }
      }
    }
  }
});
