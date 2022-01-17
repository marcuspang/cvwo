package main

import (
	"cvwo/database"
	"cvwo/routes"
	"flag"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
)

var (
	port = flag.String("port", ":3000", "Port to listen on")
	// Prefork allows multiple sockets to listen on the same IP address and port combination,
	// the kernel then load balances incoming connections across the sockets
	prod = flag.Bool("prod", false, "Enable prefork in Production")
)

func main() {
	// to load the flags
	flag.Parse()

	if !*prod {
		if err := godotenv.Load(); err != nil {
			panic("Error loading .env file")
		}
	}

	// connect database and setup tables
	database.Connect(*prod)

	// setup server application
	app := fiber.New(fiber.Config{
		Prefork: *prod,
	})

	// middleware
	app.Use(logger.New())  // for logging requests
	app.Use(recover.New()) // for handling panic in code
	app.Use(cors.New(cors.Config{
		AllowCredentials: true, // setup cors to expose response to frontend
	}))

	// setup endpoints for app
	routes.Setup(app)

	// listen on port flag passed and prints error if any
	if !*prod {
		log.Fatal(app.Listen("localhost" + *port))
	} else {
		log.Fatal(app.Listen(*port))
	}
}
