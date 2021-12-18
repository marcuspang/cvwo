package server

import "cvwo/backend/internal/store"

func Start() {
	router := setRouter()

	store.SetDBConnection()

	// CORS
	// config := cors.DefaultConfig()
	// config.AllowOrigins = []string{"*"}
	// config.AllowMethods = []string{"GET", "HEAD", "OPTIONS", "PUT", "POST"}
	// config.AllowHeaders = []string{"Access-Control-Allow-Headers", "Origin", "Accept", "X-Requested-With", "Content-Type", "Access-Control-Request-Method", "Access-Control-Request-Headers", "Access-Control-Allow-Origin"}
	// config.AllowCredentials = true
	// router.Use(cors.New(config))

	// Start listening and serving requests
	router.Run(":8080")
}
