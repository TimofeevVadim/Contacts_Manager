module.exports = {
    devServer: {

        // https: true,
        port: 8080,
        open: true, // opens browser window automatically
        // set up one or more proxy rules
        proxy: {
            // Proxy requests prefixed by /api URL
            "/?/api": {
                target: "http://localhost:8080/home",
                changeOrigin: true,  // Avoids the need for CORS rule on your API server
                // Optionally map /api to the same or a different path on the API server
                pathRewrite: {
                    "^/api": "api"
                }
            }
        }
}
}
